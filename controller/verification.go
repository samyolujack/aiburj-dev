package controller

import (
	"net/http"
	"strconv"

	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
)

type VerificationRequest struct {
	RealName    string `json:"real_name"`
	IdNumber    string `json:"id_number"`
	IdCardFront string `json:"id_card_front"`
	IdCardBack  string `json:"id_card_back"`
}

// SubmitVerification handles user real-name verification submission
func SubmitVerification(c *gin.Context) {
	userId := c.GetInt("id")

	// Check if already submitted
	existing, _ := model.GetVerificationByUserId(userId)
	if existing != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": "已提交过认证申请，请等待审核",
			"data":    existing,
		})
		return
	}

	var req VerificationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "请求参数无效",
		})
		return
	}

	if req.RealName == "" || req.IdNumber == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "姓名和身份证号不能为空",
		})
		return
	}

	v := &model.UserVerification{
		UserId:      userId,
		RealName:    req.RealName,
		IdNumber:    req.IdNumber,
		IdCardFront: req.IdCardFront,
		IdCardBack:  req.IdCardBack,
		Status:      0, // pending
	}

	if err := model.CreateVerification(v); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "提交失败: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "实名认证申请已提交，请等待审核",
		"data":    v,
	})
}

// GetVerificationStatus returns the current user's verification status
func GetVerificationStatus(c *gin.Context) {
	userId := c.GetInt("id")

	v, err := model.GetVerificationByUserId(userId)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data": gin.H{
				"status": -1, // not submitted
			},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    v,
	})
}

// ── Admin verification management ────────────────────────────────────────

// AdminListVerifications returns all verification requests
func AdminListVerifications(c *gin.Context) {
	page := c.GetInt("page")
	if page < 1 { page = 1 }
	size := c.GetInt("size")
	if size < 1 || size > 100 { size = 20 }
	var status *int
	if s := c.Query("status"); s != "" {
		if v, err := strconv.Atoi(s); err == nil && v >= 0 && v <= 2 {
			status = &v
		}
	}

	list, total, err := model.GetAllVerifications(page, size, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	type vWithUser struct {
		model.UserVerification
		Username string `json:"username"`
	}
	result := make([]vWithUser, len(list))
	for i, v := range list {
		result[i] = vWithUser{UserVerification: v}
		if user, err := model.GetUserById(v.UserId, false); err == nil && user != nil {
			result[i].Username = user.Username
		}
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": result, "total": total})
}

// AdminReviewVerification approves or rejects a verification
func AdminReviewVerification(c *gin.Context) {
	var req struct {
		Id        int    `json:"id"`
		Status    int    `json:"status"`
		ReviewMsg string `json:"review_msg"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "参数无效"})
		return
	}
	if req.Status != 1 && req.Status != 2 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的状态，1=通过 2=拒绝"})
		return
	}
	if err := model.UpdateVerificationStatus(req.Id, req.Status, req.ReviewMsg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "审核完成"})
}
