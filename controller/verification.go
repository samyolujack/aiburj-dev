package controller

import (
	"net/http"

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
