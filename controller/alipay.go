package controller

import (
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strings"
	"time"

	"github.com/QuantumNous/new-api/model"

	"github.com/gin-gonic/gin"
)

// ── Alipay 配置 ────────────────────────────────────────────────────────────

func getAlipayConfig() (appId, privateKey, publicKey, gateway string) {
	return os.Getenv("ALIPAY_APP_ID"),
		os.Getenv("ALIPAY_PRIVATE_KEY"),
		os.Getenv("ALIPAY_PUBLIC_KEY"),
		"https://openapi.alipay.com/gateway.do"
}

// ── Authorize: 跳转支付宝授权页 ─────────────────────────────────────────────

// AlipayAuthorize redirects user to Alipay OAuth authorization page
func AlipayAuthorize(c *gin.Context) {
	appId, _, _, _ := getAlipayConfig()
	if appId == "" {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"success": false,
			"message": "支付宝认证暂未配置",
		})
		return
	}

	state := fmt.Sprintf("%x", time.Now().UnixNano())
	redirectUri := getAlipayRedirectUri(c)

	authUrl := fmt.Sprintf(
		"https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=%s&scope=auth_user&redirect_uri=%s&state=%s",
		appId,
		url.QueryEscape(redirectUri),
		state,
	)

	c.Redirect(http.StatusTemporaryRedirect, authUrl)
}

func getAlipayRedirectUri(c *gin.Context) string {
	scheme := "http"
	if c.Request.TLS != nil || c.GetHeader("X-Forwarded-Proto") == "https" {
		scheme = "https"
	}
	return fmt.Sprintf("%s://%s/api/oauth/alipay/callback", scheme, c.Request.Host)
}

// ── Callback: 处理支付宝回调 ────────────────────────────────────────────────

// AlipayCallback handles the OAuth callback from Alipay
func AlipayCallback(c *gin.Context) {
	appId, privateKeyPem, _, gateway := getAlipayConfig()
	if appId == "" {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"success": false,
			"message": "支付宝认证暂未配置",
		})
		return
	}

	authCode := c.Query("auth_code")
	if authCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "授权失败，未获取到授权码",
		})
		return
	}

	// Step 1: 用 auth_code 换取 access_token
	accessToken, userId, err := alipayGetAccessToken(appId, privateKeyPem, gateway, authCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "换取token失败: " + err.Error(),
		})
		return
	}

	// Step 2: 用 access_token 获取用户实名信息
	realName, certNo, err := alipayGetUserInfo(appId, privateKeyPem, gateway, accessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "获取用户信息失败: " + err.Error(),
		})
		return
	}

	// Step 3: 保存认证信息（自动审核通过）
	aiburjUserId := c.GetInt("id")
	existing, _ := model.GetVerificationByUserId(aiburjUserId)

	if existing != nil {
		// 更新已有记录
		existing.RealName = realName
		existing.IdNumber = certNo
		existing.Status = 1 // 自动通过
		model.DB.Save(existing)
	} else {
		// 新建认证记录
		v := &model.UserVerification{
			UserId:      aiburjUserId,
			RealName:    realName,
			IdNumber:    certNo,
			Status:      1, // 自动通过
		}
		model.CreateVerification(v)
	}

	// 关联支付宝userId
	_ = userId // 可用于后续业务

	c.Redirect(http.StatusTemporaryRedirect, "/verification?alipay=success")
}

// ── 支付宝API调用 ──────────────────────────────────────────────────────────

func alipayGetAccessToken(appId, privateKeyPem, gateway, authCode string) (accessToken, userId string, err error) {
	bizContent := map[string]string{
		"grant_type":  "authorization_code",
		"code":        authCode,
	}
	body, _ := json.Marshal(bizContent)

	params := alipayBuildParams(appId, "alipay.system.oauth.token", string(body))
	resp, err := alipayDoRequest(gateway, appId, privateKeyPem, params)
	if err != nil {
		return "", "", err
	}

	var result struct {
		AlipaySystemOauthTokenResponse struct {
			AccessToken string `json:"access_token"`
			UserId      string `json:"user_id"`
		} `json:"alipay_system_oauth_token_response"`
	}
	if err := json.Unmarshal(resp, &result); err != nil {
		return "", "", fmt.Errorf("解析token响应失败: %w", err)
	}

	return result.AlipaySystemOauthTokenResponse.AccessToken,
		result.AlipaySystemOauthTokenResponse.UserId,
		nil
}

func alipayGetUserInfo(appId, privateKeyPem, gateway, accessToken string) (realName, certNo string, err error) {
	bizContent := map[string]string{}
	body, _ := json.Marshal(bizContent)

	params := alipayBuildParams(appId, "alipay.user.info.share", string(body))
	params["auth_token"] = accessToken

	resp, err := alipayDoRequest(gateway, appId, privateKeyPem, params)
	if err != nil {
		return "", "", err
	}

	var result struct {
		AlipayUserInfoShareResponse struct {
			RealName string `json:"real_name"`
			CertNo   string `json:"cert_no"`
			UserId   string `json:"user_id"`
		} `json:"alipay_user_info_share_response"`
	}
	if err := json.Unmarshal(resp, &result); err != nil {
		return "", "", fmt.Errorf("解析用户信息响应失败: %w", err)
	}

	return result.AlipayUserInfoShareResponse.RealName,
		result.AlipayUserInfoShareResponse.CertNo,
		nil
}

// ── 签名和请求工具 ──────────────────────────────────────────────────────────

func alipayBuildParams(appId, method, bizContent string) map[string]string {
	return map[string]string{
		"app_id":      appId,
		"method":      method,
		"format":      "json",
		"charset":     "utf-8",
		"sign_type":   "RSA2",
		"timestamp":   time.Now().Format("2006-01-02 15:04:05"),
		"version":     "1.0",
		"biz_content": bizContent,
	}
}

func alipayDoRequest(gateway, appId, privateKeyPem string, params map[string]string) ([]byte, error) {
	// Sort keys
	keys := make([]string, 0, len(params))
	for k := range params {
		if k != "sign" {
			keys = append(keys, k)
		}
	}
	sort.Strings(keys)

	// Build sign string
	var signBuilder strings.Builder
	for i, k := range keys {
		if i > 0 {
			signBuilder.WriteString("&")
		}
		signBuilder.WriteString(k)
		signBuilder.WriteString("=")
		signBuilder.WriteString(params[k])
	}

	// Sign
	privateKey, err := parsePrivateKey(privateKeyPem)
	if err != nil {
		return nil, fmt.Errorf("解析私钥失败: %w", err)
	}
	hash := sha256.Sum256([]byte(signBuilder.String()))
	signature, err := rsa.SignPKCS1v15(rand.Reader, privateKey, crypto.SHA256, hash[:])
	if err != nil {
		return nil, fmt.Errorf("签名失败: %w", err)
	}
	params["sign"] = base64.StdEncoding.EncodeToString(signature)

	// Build form body
	form := url.Values{}
	for k, v := range params {
		form.Set(k, v)
	}

	resp, err := http.Post(gateway, "application/x-www-form-urlencoded", strings.NewReader(form.Encode()))
	if err != nil {
		return nil, fmt.Errorf("请求支付宝失败: %w", err)
	}
	defer resp.Body.Close()

	return io.ReadAll(resp.Body)
}

func parsePrivateKey(pemStr string) (*rsa.PrivateKey, error) {
	block, _ := pem.Decode([]byte(pemStr))
	if block == nil {
		return nil, fmt.Errorf("无法解析PEM私钥")
	}
	return x509.ParsePKCS1PrivateKey(block.Bytes)
}
