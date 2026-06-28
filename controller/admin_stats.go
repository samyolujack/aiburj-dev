package controller

import (
	"net/http"
	"time"

	"github.com/QuantumNous/new-api/model"
	"github.com/gin-gonic/gin"
)

// AdminStats returns global platform statistics for the admin dashboard
func AdminStats(c *gin.Context) {
	now := time.Now()
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	thisMonthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	// User counts
	var totalUsers, todayNewUsers, monthNewUsers int64
	model.DB.Model(&model.User{}).Count(&totalUsers)
	model.DB.Model(&model.User{}).Where("created_at >= ?", todayStart.Unix()).Count(&todayNewUsers)
	model.DB.Model(&model.User{}).Where("created_at >= ?", thisMonthStart.Unix()).Count(&monthNewUsers)

	// Active users (last 7 days)
	var activeUsers int64
	model.DB.Model(&model.User{}).Where("last_login >= ?", now.AddDate(0, 0, -7).Unix()).Count(&activeUsers)

	// Consumption
	var totalConsumption, todayConsumption, monthConsumption int64
	model.DB.Model(&model.Log{}).Select("COALESCE(SUM(quota), 0)").Scan(&totalConsumption)
	model.DB.Model(&model.Log{}).Where("created_at >= ?", todayStart.Unix()).Select("COALESCE(SUM(quota), 0)").Scan(&todayConsumption)
	model.DB.Model(&model.Log{}).Where("created_at >= ?", thisMonthStart.Unix()).Select("COALESCE(SUM(quota), 0)").Scan(&monthConsumption)

	// Pending tickets & invoices
	var openTickets, pendingInvoices int64
	model.DB.Model(&model.Ticket{}).Where("status = 'open'").Count(&openTickets)
	model.DB.Model(&model.Invoice{}).Where("status = 'pending'").Count(&pendingInvoices)

	// Total requests
	var totalRequests int64
	model.DB.Model(&model.Log{}).Count(&totalRequests)

	// Daily consumption trend (last 7 days)
	type dailyPoint struct {
		Date  string `json:"date"`
		Quota int64  `json:"quota"`
	}
	trend := make([]dailyPoint, 7)
	for i := 6; i >= 0; i-- {
		dayStart := time.Date(now.Year(), now.Month(), now.Day()-i, 0, 0, 0, 0, now.Location())
		dayEnd := dayStart.Add(24 * time.Hour)
		var q int64
		model.DB.Model(&model.Log{}).Where("created_at >= ? AND created_at < ?", dayStart.Unix(), dayEnd.Unix()).
			Select("COALESCE(SUM(quota), 0)").Scan(&q)
		trend[6-i] = dailyPoint{Date: dayStart.Format("01-02"), Quota: q}
	}

	// Top models (by consumption, last 30 days)
	type modelRank struct {
		Model string `json:"model"`
		Quota int64  `json:"quota"`
		Count int64  `json:"count"`
	}
	var topModels []modelRank
	model.DB.Model(&model.Log{}).Where("created_at >= ?", now.AddDate(0, 0, -30).Unix()).
		Select("model_name as model, COALESCE(SUM(quota), 0) as quota, COUNT(*) as count").
		Group("model_name").Order("quota DESC").Limit(10).Scan(&topModels)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"total_users":       totalUsers,
			"today_new_users":   todayNewUsers,
			"month_new_users":   monthNewUsers,
			"active_users":      activeUsers,
			"total_consumption": totalConsumption,
			"today_consumption": todayConsumption,
			"month_consumption": monthConsumption,
			"total_requests":    totalRequests,
			"open_tickets":      openTickets,
			"pending_invoices":  pendingInvoices,
			"daily_trend":       trend,
			"top_models":        topModels,
		},
	})
}
