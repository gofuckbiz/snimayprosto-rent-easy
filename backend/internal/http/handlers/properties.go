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
	q := h.DB.Preload("Images").Order("created_at desc")
	if city != "" {
		like := "%" + city + "%"
		q = q.Where("city ILIKE ? OR address ILIKE ?", like, like)
	}
	if err := q.Limit(100).Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db_error"})
		return
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


