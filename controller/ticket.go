package controller

import (
	"net/http"

	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
)

type TicketRequest struct {
	Type        string `json:"type"`
	Subject     string `json:"subject"`
	Description string `json:"description"`
	Contact     string `json:"contact"`
}

// SubmitTicket creates a new support ticket
func SubmitTicket(c *gin.Context) {
	userId := c.GetInt("id")

	var req TicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "请求参数无效",
		})
		return
	}

	if req.Subject == "" || req.Description == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "标题和描述不能为空",
		})
		return
	}

	ticketType := req.Type
	if ticketType == "" {
		ticketType = "bug"
	}

	ticket := &model.Ticket{
		UserId:      userId,
		Type:        ticketType,
		Subject:     req.Subject,
		Description: req.Description,
		Contact:     req.Contact,
		Status:      "open",
	}

	if err := model.CreateTicket(ticket); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "提交失败: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "工单已提交",
		"data":    ticket,
	})
}

// GetMyTickets returns the current user's tickets
func GetMyTickets(c *gin.Context) {
	userId := c.GetInt("id")
	page := c.GetInt("page")
	if page < 1 {
		page = 1
	}
	size := c.GetInt("size")
	if size < 1 || size > 50 {
		size = 20
	}

	tickets, total, err := model.GetUserTickets(userId, page, size)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    tickets,
		"total":   total,
	})
}

// ── Admin ticket management ──────────────────────────────────────────────

// AdminListTickets returns all tickets with filters
func AdminListTickets(c *gin.Context) {
	page := c.GetInt("page")
	if page < 1 {
		page = 1
	}
	size := c.GetInt("size")
	if size < 1 || size > 100 {
		size = 20
	}
	status := c.Query("status")
	ticketType := c.Query("type")

	tickets, total, err := model.GetAllTickets(page, size, status, ticketType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": err.Error(),
		})
		return
	}

	// Attach username for display
	type ticketWithUser struct {
		model.Ticket
		Username string `json:"username"`
	}
	result := make([]ticketWithUser, len(tickets))
	for i, t := range tickets {
		result[i] = ticketWithUser{Ticket: t}
		if user, err := model.GetUserById(t.UserId, false); err == nil && user != nil {
			result[i].Username = user.Username
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    result,
		"total":   total,
	})
}

// AdminUpdateTicket updates ticket status (admin)
func AdminUpdateTicket(c *gin.Context) {
	var req struct {
		Id     int    `json:"id"`
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "参数无效"})
		return
	}
	if req.Status != "open" && req.Status != "in_progress" && req.Status != "closed" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的状态"})
		return
	}
	if err := model.UpdateTicketStatus(req.Id, req.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "状态已更新"})
}
