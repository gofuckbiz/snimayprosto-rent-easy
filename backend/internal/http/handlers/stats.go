package handlers

import (
	"net/http"

	"gofuckbiz/snimayprosto-rent-easy/internal/config"
	"gofuckbiz/snimayprosto-rent-easy/internal/core"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type StatsHandler struct {
	DB  *gorm.DB
	Cfg *config.Config
}

func NewStatsHandler(db *gorm.DB, cfg *config.Config) *StatsHandler {
	return &StatsHandler{
		DB:  db,
		Cfg: cfg,
	}
}

func (h *StatsHandler) GetStats(c *gin.Context) {
	// Count properties
	var propertyCount int64
	if err := h.DB.Model(&core.Property{}).Count(&propertyCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed_to_count_properties"})
		return
	}

	// Count users
	var userCount int64
	if err := h.DB.Model(&core.User{}).Count(&userCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed_to_count_users"})
		return
	}

	// Count conversations (as a proxy for satisfied customers)
	var conversationCount int64
	if err := h.DB.Model(&core.Conversation{}).Count(&conversationCount).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed_to_count_conversations"})
		return
	}

	// Calculate satisfaction rate (simplified - based on conversations)
	// In a real app, you'd have a separate table for ratings/reviews
	satisfactionRate := 95 // Default high rate, in real app calculate from reviews

	// Format the response
	stats := gin.H{
		"properties": propertyCount,
		"users": userCount,
		"satisfaction": satisfactionRate,
		"support": "24/7", // Static for now
	}

	c.JSON(http.StatusOK, stats)
}
