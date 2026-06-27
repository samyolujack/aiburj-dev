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

// ── Admin invoice management ─────────────────────────────────────────────

// AdminListInvoices returns all invoices with filters
func AdminListInvoices(c *gin.Context) {
	page := c.GetInt("page")
	if page < 1 { page = 1 }
	size := c.GetInt("size")
	if size < 1 || size > 100 { size = 20 }
	status := c.Query("status")

	invoices, total, err := model.GetAllInvoices(page, size, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	type invWithUser struct {
		model.Invoice
		Username string `json:"username"`
	}
	result := make([]invWithUser, len(invoices))
	for i, inv := range invoices {
		result[i] = invWithUser{Invoice: inv}
		if user, err := model.GetUserById(inv.UserId, false); err == nil && user != nil {
			result[i].Username = user.Username
		}
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": result, "total": total})
}

// AdminUpdateInvoice updates invoice status
func AdminUpdateInvoice(c *gin.Context) {
	var req struct {
		Id     int    `json:"id"`
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "参数无效"})
		return
	}
	if req.Status != "pending" && req.Status != "approved" && req.Status != "rejected" && req.Status != "issued" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的状态"})
		return
	}
	if err := model.UpdateInvoiceStatus(req.Id, req.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "状态已更新"})
}
