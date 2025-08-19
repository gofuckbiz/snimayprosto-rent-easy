package handlers

import (
	"net/http"
	"time"

	"gofuckbiz/snimayprosto-rent-easy/internal/config"
	"gofuckbiz/snimayprosto-rent-easy/internal/core"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PlansHandler struct {
	DB  *gorm.DB
	Cfg *config.Config
}

func NewPlansHandler(db *gorm.DB, cfg *config.Config) *PlansHandler {
	return &PlansHandler{
		DB:  db,
		Cfg: cfg,
	}
}

type upgradePlanRequest struct {
	PlanType string `json:"planType" binding:"required,oneof=premium unlimited"`
}

func (h *PlansHandler) GetMyPlan(c *gin.Context) {
	userIDVal, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_not_found"})
		return
	}

	var userID uint
	switch v := userIDVal.(type) {
	case float64:
		userID = uint(v)
	case uint:
		userID = v
	case int:
		userID = uint(v)
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid_user_id_type"})
		return
	}

	var plan core.UserPlan
	if err := h.DB.Where("user_id = ?", userID).First(&plan).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Create default free plan
			plan = core.UserPlan{
				UserID:      userID,
				PlanType:    "free",
				MaxListings: 3,
			}
			if err := h.DB.Create(&plan).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "create_plan_failed"})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "plan_lookup_failed"})
			return
		}
	}

	// Count current active listings
	var activeListings int64
	if err := h.DB.Model(&core.Property{}).Where("owner_id = ?", userID).Count(&activeListings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "count_listings_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"plan":           plan,
		"activeListings": activeListings,
		"canCreateMore":  activeListings < int64(plan.MaxListings),
	})
}

func (h *PlansHandler) UpgradePlan(c *gin.Context) {
	userIDVal, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user_not_found"})
		return
	}

	var userID uint
	switch v := userIDVal.(type) {
	case float64:
		userID = uint(v)
	case uint:
		userID = v
	case int:
		userID = uint(v)
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid_user_id_type"})
		return
	}

	var req upgradePlanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}

	// Determine plan details
	var maxListings int
	var expiresAt *time.Time
	switch req.PlanType {
	case "premium":
		maxListings = 10
		expires := time.Now().AddDate(0, 1, 0) // 1 month
		expiresAt = &expires
	case "unlimited":
		maxListings = 999999 // Effectively unlimited
		expires := time.Now().AddDate(0, 1, 0) // 1 month
		expiresAt = &expires
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_plan_type"})
		return
	}

	// Update or create plan
	var plan core.UserPlan
	if err := h.DB.Where("user_id = ?", userID).First(&plan).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			plan = core.UserPlan{
				UserID:      userID,
				PlanType:    req.PlanType,
				MaxListings: maxListings,
				ExpiresAt:   expiresAt,
			}
			if err := h.DB.Create(&plan).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "create_plan_failed"})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "plan_lookup_failed"})
			return
		}
	} else {
		plan.PlanType = req.PlanType
		plan.MaxListings = maxListings
		plan.ExpiresAt = expiresAt
		if err := h.DB.Save(&plan).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "update_plan_failed"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "plan_upgraded",
		"plan":    plan,
	})
}