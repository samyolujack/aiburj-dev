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

// ── 方案A: 获取会员信息（免费，已实现）──────────────────────────────────────

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
	redirectUri := getAlipayRedirectUri(c, "callback")

	authUrl := fmt.Sprintf(
		"https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=%s&scope=auth_user&redirect_uri=%s&state=%s",
		appId,
		url.QueryEscape(redirectUri),
		state,
	)

	c.Redirect(http.StatusTemporaryRedirect, authUrl)
}

func getAlipayRedirectUri(c *gin.Context, path string) string {
	scheme := "http"
	if c.Request.TLS != nil || c.GetHeader("X-Forwarded-Proto") == "https" {
		scheme = "https"
	}
	return fmt.Sprintf("%s://%s/api/oauth/alipay/%s", scheme, c.Request.Host, path)
}

// AlipayCallback handles the OAuth callback from Alipay (方案A)
func AlipayCallback(c *gin.Context) {
	appId, privateKeyPem, _, gateway := getAlipayConfig()
	if appId == "" {
		c.JSON(http.StatusServiceUnavailable, gin.H{"success": false, "message": "支付宝认证暂未配置"})
		return
	}

	authCode := c.Query("auth_code")
	if authCode == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "授权失败"})
		return
	}

	accessToken, _, err := alipayGetAccessToken(appId, privateKeyPem, gateway, authCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "换取token失败: " + err.Error()})
		return
	}

	realName, certNo, err := alipayGetUserInfo(appId, privateKeyPem, gateway, accessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "获取用户信息失败: " + err.Error()})
		return
	}

	saveVerification(c.GetInt("id"), realName, certNo)
	c.Redirect(http.StatusTemporaryRedirect, "/verification?alipay=success")
}

// ── 方案B: 身份验证产品（刷脸，收费）─────────────────────────────────────────

// AlipayCertifyInitiate starts the identity certification process (方案B)
func AlipayCertifyInitiate(c *gin.Context) {
	appId, privateKeyPem, _, gateway := getAlipayConfig()
	if appId == "" {
		c.JSON(http.StatusServiceUnavailable, gin.H{"success": false, "message": "支付宝认证暂未配置"})
		return
	}

	userId := c.GetInt("id")

	// Generate unique certify ID
	outBizNo := fmt.Sprintf("verify_%d_%d", userId, time.Now().UnixNano())
	returnUrl := getAlipayRedirectUri(c, "certify-callback")

	bizContent, _ := json.Marshal(map[string]string{
		"out_biz_no":   outBizNo,
		"biz_code":     "FACE",
		"return_url":   returnUrl,
	})

	params := alipayBuildParams(appId, "alipay.user.certify.open.initialize", string(bizContent))
	resp, err := alipayDoRequest(gateway, appId, privateKeyPem, params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "发起认证失败: " + err.Error()})
		return
	}

	var result struct {
		AlipayUserCertifyOpenInitializeResponse struct {
			CertifyId string `json:"certify_id"`
			CertifyUrl string `json:"certify_url"`
			Code       string `json:"code"`
			Msg        string `json:"msg"`
		} `json:"alipay_user_certify_open_initialize_response"`
	}
	if err := json.Unmarshal(resp, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "解析响应失败"})
		return
	}

	r := result.AlipayUserCertifyOpenInitializeResponse
	if r.Code != "10000" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": r.Msg})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"certify_url": r.CertifyUrl,
		"certify_id":  r.CertifyId,
	})
}

// AlipayCertifyCallback handles the return from Alipay certification (方案B)
func AlipayCertifyCallback(c *gin.Context) {
	appId, privateKeyPem, _, gateway := getAlipayConfig()
	if appId == "" {
		c.Redirect(http.StatusTemporaryRedirect, "/verification?alipay=error")
		return
	}

	certifyId := c.Query("certify_id")
	if certifyId == "" {
		c.Redirect(http.StatusTemporaryRedirect, "/verification?alipay=error")
		return
	}

	// Query certification result
	bizContent, _ := json.Marshal(map[string]string{"certify_id": certifyId})
	params := alipayBuildParams(appId, "alipay.user.certify.open.query", string(bizContent))
	resp, err := alipayDoRequest(gateway, appId, privateKeyPem, params)
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, "/verification?alipay=error")
		return
	}

	var result struct {
		AlipayUserCertifyOpenQueryResponse struct {
			Passed     string `json:"passed"`
			IdentityInfo string `json:"identity_info"`
			Code       string `json:"code"`
		} `json:"alipay_user_certify_open_query_response"`
	}
	json.Unmarshal(resp, &result)
	r := result.AlipayUserCertifyOpenQueryResponse

	if r.Passed != "T" {
		c.Redirect(http.StatusTemporaryRedirect, "/verification?alipay=fail")
		return
	}

	// Parse identity info to get real_name and cert_no
	var identity struct {
		RealName string `json:"cert_name"`
		CertNo   string `json:"cert_no"`
	}
	json.Unmarshal([]byte(r.IdentityInfo), &identity)

	saveVerification(c.GetInt("id"), identity.RealName, identity.CertNo)
	c.Redirect(http.StatusTemporaryRedirect, "/verification?alipay=success")
}

// ── 方案A API调用 ──────────────────────────────────────────────────────────

func alipayGetAccessToken(appId, privateKeyPem, gateway, authCode string) (string, string, error) {
	bizContent, _ := json.Marshal(map[string]string{
		"grant_type": "authorization_code",
		"code":       authCode,
	})
	params := alipayBuildParams(appId, "alipay.system.oauth.token", string(bizContent))
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
	json.Unmarshal(resp, &result)
	return result.AlipaySystemOauthTokenResponse.AccessToken,
		result.AlipaySystemOauthTokenResponse.UserId, nil
}

func alipayGetUserInfo(appId, privateKeyPem, gateway, accessToken string) (string, string, error) {
	params := alipayBuildParams(appId, "alipay.user.info.share", "{}")
	params["auth_token"] = accessToken
	resp, err := alipayDoRequest(gateway, appId, privateKeyPem, params)
	if err != nil {
		return "", "", err
	}
	var result struct {
		AlipayUserInfoShareResponse struct {
			RealName string `json:"real_name"`
			CertNo   string `json:"cert_no"`
		} `json:"alipay_user_info_share_response"`
	}
	json.Unmarshal(resp, &result)
	return result.AlipayUserInfoShareResponse.RealName,
		result.AlipayUserInfoShareResponse.CertNo, nil
}

// ── 共享工具函数 ─────────────────────────────────────────────────────────

func saveVerification(userId int, realName, certNo string) {
	existing, _ := model.GetVerificationByUserId(userId)
	if existing != nil {
		existing.RealName = realName
		existing.IdNumber = certNo
		existing.Status = 1
		model.DB.Save(existing)
	} else {
		model.CreateVerification(&model.UserVerification{
			UserId:   userId,
			RealName: realName,
			IdNumber: certNo,
			Status:   1,
		})
	}
}

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
	keys := make([]string, 0, len(params))
	for k := range params {
		if k != "sign" {
			keys = append(keys, k)
		}
	}
	sort.Strings(keys)

	var signBuilder strings.Builder
	for i, k := range keys {
		if i > 0 {
			signBuilder.WriteString("&")
		}
		signBuilder.WriteString(k)
		signBuilder.WriteString("=")
		signBuilder.WriteString(params[k])
	}

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
	key, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		return x509.ParsePKCS1PrivateKey(block.Bytes)
	}
	rsaKey, ok := key.(*rsa.PrivateKey)
	if !ok {
		return nil, fmt.Errorf("非RSA私钥")
	}
	return rsaKey, nil
}
