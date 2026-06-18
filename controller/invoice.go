package controller

import (
	"net/http"

	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
)

type InvoiceRequest struct {
	Type   string  `json:"type"`
	Title  string  `json:"title"`
	TaxId  string  `json:"tax_id"`
	Amount float64 `json:"amount"`
	Email  string  `json:"email"`
	Remark string  `json:"remark"`
}

// SubmitInvoice creates a new invoice request
func SubmitInvoice(c *gin.Context) {
	userId := c.GetInt("id")

	var req InvoiceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "请求参数无效",
		})
		return
	}

	if req.Title == "" || req.Amount <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "发票抬头和金额不能为空",
		})
		return
	}

	invoiceType := req.Type
	if invoiceType == "" {
		invoiceType = "personal"
	}

	invoice := &model.Invoice{
		UserId: userId,
		Type:   invoiceType,
		Title:  req.Title,
		TaxId:  req.TaxId,
		Amount: req.Amount,
		Email:  req.Email,
		Remark: req.Remark,
		Status: "pending",
	}

	if err := model.CreateInvoice(invoice); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "提交失败: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "发票申请已提交",
		"data":    invoice,
	})
}

// GetMyInvoices returns the current user's invoices
func GetMyInvoices(c *gin.Context) {
	userId := c.GetInt("id")
	page := c.GetInt("page")
	if page < 1 {
		page = 1
	}
	size := c.GetInt("size")
	if size < 1 || size > 50 {
		size = 20
	}

	invoices, total, err := model.GetUserInvoices(userId, page, size)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    invoices,
		"total":   total,
	})
}
