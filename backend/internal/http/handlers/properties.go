package handlers

import (
	"net/http"
	"strconv"
	"strings"
	"path/filepath"
	"fmt"
	"os"
	"errors"
	"sort"

	"gofuckbiz/snimayprosto-rent-easy/internal/config"
	"gofuckbiz/snimayprosto-rent-easy/internal/core"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PropertiesHandler struct {
	DB  *gorm.DB
	Cfg *config.Config
}

func NewPropertiesHandler(db *gorm.DB, cfg *config.Config) *PropertiesHandler {
	return &PropertiesHandler{
		DB:  db,
		Cfg: cfg,
	}
}

type createPropertyRequest struct {
	Title        string   `json:"title" binding:"required"`
	Description  string   `json:"description"`
	Address      string   `json:"address" binding:"required"`
	PropertyType string   `json:"propertyType" binding:"required"`
	Rooms        string   `json:"rooms" binding:"required"`
	Price        string   `json:"price" binding:"required"`
	PriceType    string   `json:"priceType" binding:"required"`
	Phone        string   `json:"phone" binding:"required"`
	Email        string   `json:"email"`
	Amenities    []string `json:"amenities"`
	IsUrgent     bool     `json:"isUrgent"`
	Visibility   string   `json:"visibility" binding:"required"`
	Latitude     float64  `json:"latitude"`
	Longitude    float64  `json:"longitude"`
}

func (h *PropertiesHandler) Create(c *gin.Context) {
	userIDVal, ok := c.Get("userId")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	var userIDUint uint
	switch v := userIDVal.(type) {
	case uint:
		userIDUint = v
	case int:
		if v >= 0 { userIDUint = uint(v) }
	case int64:
		if v >= 0 { userIDUint = uint(v) }
	default:
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// Check user's plan and listing limit
	var plan core.UserPlan
	if err := h.DB.Where("user_id = ?", userIDUint).First(&plan).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			// Create default free plan
			plan = core.UserPlan{
				UserID:      userIDUint,
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
	if err := h.DB.Model(&core.Property{}).Where("owner_id = ?", userIDUint).Count(&activeListings).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "count_listings_failed"})
		return
	}

	// Check if user can create more listings
	if activeListings >= int64(plan.MaxListings) {
		c.JSON(http.StatusForbidden, gin.H{
			"error":          "listing_limit_exceeded",
			"currentPlan":    plan.PlanType,
			"maxListings":    plan.MaxListings,
			"activeListings": activeListings,
		})
		return
	}

	var req createPropertyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}

	rooms, _ := strconv.Atoi(req.Rooms)
	if req.Rooms == "studio" {
		rooms = 0
	} else if req.Rooms == "5+" {
		rooms = 5
	}
	price, _ := strconv.ParseFloat(req.Price, 64)
	p := core.Property{
		OwnerID:      userIDUint,
		Title:        req.Title,
		Description:  req.Description,
		Address:      req.Address,
		PropertyType: req.PropertyType,
		Rooms:        rooms,
		Price:        price,
		PriceType:    req.PriceType,
		ContactPhone: req.Phone,
		ContactEmail: req.Email,
		Amenities:    strings.Join(req.Amenities, ","),
		IsUrgent:     req.IsUrgent,
		Visibility:   req.Visibility,
		Lat:          req.Latitude,
		Lng:          req.Longitude,
	}
	if err := h.DB.Create(&p).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db_error"})
		return
	}
	c.JSON(http.StatusCreated, p)
}

func (h *PropertiesHandler) List(c *gin.Context) {
	city := strings.TrimSpace(c.Query("city"))
	var items []core.Property
	
	// First get promoted properties, then regular ones
	q := h.DB.Preload("Images").
		Select("properties.*, CASE WHEN property_promotions.id IS NOT NULL AND property_promotions.expires_at > NOW() THEN 1 ELSE 0 END as is_promoted").
		Joins("LEFT JOIN property_promotions ON properties.id = property_promotions.property_id AND property_promotions.expires_at > NOW()").
		Order("is_promoted DESC, created_at DESC")
	
	if city != "" {
		like := "%" + city + "%"
		q = q.Where("city ILIKE ? OR address ILIKE ?", like, like)
	}
	if err := q.Limit(100).Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db_error"})
		return
	}
	
	// Add promotion status to each property
	for i := range items {
		var promotion core.PropertyPromotion
		if err := h.DB.Where("property_id = ? AND expires_at > NOW()", items[i].ID).First(&promotion).Error; err == nil {
			// Property is promoted - this will be handled in frontend
		}
	}
	
	c.JSON(http.StatusOK, gin.H{"items": items})
}

func (h *PropertiesHandler) Get(c *gin.Context) {
	propertyID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid property ID"})
		return
	}

	var property core.Property
	if err := h.DB.Preload("Images").First(&property, propertyID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Property not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch property"})
		return
	}

	// Sort images by order after loading
	if len(property.Images) > 0 {
		sort.Slice(property.Images, func(i, j int) bool {
			return property.Images[i].Order < property.Images[j].Order
		})
	}

	c.JSON(http.StatusOK, property)
}

func (h *PropertiesHandler) UploadImages(c *gin.Context) {
	propertyIDStr := c.Param("id")
	propertyID, err := strconv.ParseUint(propertyIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_property_id"})
		return
	}

	// Check if property exists and user owns it
	var property core.Property
	if err := h.DB.First(&property, propertyID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "property_not_found"})
		return
	}

	userIDVal, ok := c.Get("userId")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	var userIDUint uint
	switch v := userIDVal.(type) {
	case uint:
		userIDUint = v
	case int:
		if v >= 0 { userIDUint = uint(v) }
	case int64:
		if v >= 0 { userIDUint = uint(v) }
	default:
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	if property.OwnerID != userIDUint {
		c.JSON(http.StatusForbidden, gin.H{"error": "not_owner"})
		return
	}

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_form"})
		return
	}

	files := form.File["images"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no_images"})
		return
	}

	var uploadedImages []core.PropertyImage
	for i, file := range files {
		if file.Size > 5*1024*1024 { // 5MB limit
			continue
		}

		// Generate unique filename
		ext := filepath.Ext(file.Filename)
		filename := fmt.Sprintf("property_%d_%d%s", propertyID, i, ext)
		filepath := filepath.Join(h.Cfg.Uploads.Dir, filename)

		// Ensure uploads directory exists
		if err := os.MkdirAll(h.Cfg.Uploads.Dir, 0755); err != nil {
			continue
		}

		if err := c.SaveUploadedFile(file, filepath); err != nil {
			continue
		}

		// Save to database
		img := core.PropertyImage{
			PropertyID: uint(propertyID),
			URL:        "/uploads/" + filename,
			Order:      i,
		}
		if err := h.DB.Create(&img).Error; err != nil {
			continue
		}
		uploadedImages = append(uploadedImages, img)
	}

	c.JSON(http.StatusOK, gin.H{"images": uploadedImages})
}

func (h *PropertiesHandler) MyListings(c *gin.Context) {
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

	var properties []core.Property
	if err := h.DB.Preload("Images").Where("owner_id = ?", userID).Order("created_at DESC").Find(&properties).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "fetch_failed"})
		return
	}

	// Add promotion status
	type PropertyWithPromotion struct {
		core.Property
		IsPromoted bool      `json:"isPromoted"`
		ExpiresAt  *time.Time `json:"promotionExpiresAt,omitempty"`
	}

	var result []PropertyWithPromotion
	for _, prop := range properties {
		var promotion core.PropertyPromotion
		isPromoted := false
		var expiresAt *time.Time
		
		if err := h.DB.Where("property_id = ? AND expires_at > NOW()", prop.ID).First(&promotion).Error; err == nil {
			isPromoted = true
			expiresAt = &promotion.ExpiresAt
		}

		result = append(result, PropertyWithPromotion{
			Property:   prop,
			IsPromoted: isPromoted,
			ExpiresAt:  expiresAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{"items": result})
}

func (h *PropertiesHandler) PromoteProperty(c *gin.Context) {
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

	propertyID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_property_id"})
		return
	}

	// Verify property ownership
	var property core.Property
	if err := h.DB.Where("id = ? AND owner_id = ?", propertyID, userID).First(&property).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "property_not_found_or_not_owned"})
		return
	}

	// Check if already promoted
	var existingPromotion core.PropertyPromotion
	if err := h.DB.Where("property_id = ? AND expires_at > NOW()", propertyID).First(&existingPromotion).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "already_promoted"})
		return
	}

	// Create promotion (7 days)
	promotion := core.PropertyPromotion{
		PropertyID: uint(propertyID),
		UserID:     userID,
		ExpiresAt:  time.Now().AddDate(0, 0, 7), // 7 days
	}

	if err := h.DB.Create(&promotion).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "promotion_failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "property_promoted",
		"expiresAt": promotion.ExpiresAt,
	})
}


