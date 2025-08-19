package handlers

import (
	"fmt"
	"net/http"

	"gofuckbiz/snimayprosto-rent-easy/internal/auth"
	"gofuckbiz/snimayprosto-rent-easy/internal/config"
	"gofuckbiz/snimayprosto-rent-easy/internal/core"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AuthHandler struct {
	DB  *gorm.DB
	Cfg *config.Config
}

func NewAuthHandler(db *gorm.DB, cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		DB:  db,
		Cfg: cfg,
	}
}

type registerRequest struct {
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Phone     string `json:"phone"`
}

type loginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type updateRoleRequest struct {
	Role string `json:"role" binding:"required,oneof=landlord tenant"`
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}

	var existing core.User
	if err := h.DB.Where("email = ?", req.Email).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "email_taken"})
		return
	}

	hash, err := auth.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "hash_error"})
		return
	}

	user := core.User{
		Email:        req.Email,
		PasswordHash: hash,
		Name:         req.FirstName + " " + req.LastName,
		Role:         "user",
	}
	if err := h.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db_error"})
		return
	}

	access, err := auth.GenerateToken(user.ID, h.Cfg.JWT.AccessSecret, h.Cfg.JWT.AccessTTL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token_error"})
		return
	}
	refresh, err := auth.GenerateToken(user.ID, h.Cfg.JWT.RefreshSecret, h.Cfg.JWT.RefreshTTL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token_error"})
		return
	}

	// Set refresh token as HttpOnly cookie
	c.SetCookie("refresh_token", refresh, int(h.Cfg.JWT.RefreshTTL.Seconds()), "/", "", false, true) // HttpOnly, Secure in production

	c.JSON(http.StatusCreated, gin.H{
		"user": gin.H{"id": user.ID, "email": user.Email, "name": user.Name, "role": user.Role},
		"accessToken": access,
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}
	var user core.User
	if err := h.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid_credentials"})
		return
	}
	if err := auth.CheckPassword(user.PasswordHash, req.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid_credentials"})
		return
	}
	access, err := auth.GenerateToken(user.ID, h.Cfg.JWT.AccessSecret, h.Cfg.JWT.AccessTTL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token_error"})
		return
	}
	refresh, err := auth.GenerateToken(user.ID, h.Cfg.JWT.RefreshSecret, h.Cfg.JWT.RefreshTTL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token_error"})
		return
	}

	// Set refresh token as HttpOnly cookie
	c.SetCookie("refresh_token", refresh, int(h.Cfg.JWT.RefreshTTL.Seconds()), "/", "", false, true) // HttpOnly, Secure in production

	c.JSON(http.StatusOK, gin.H{
		"user": gin.H{"id": user.ID, "email": user.Email, "name": user.Name, "role": user.Role},
		"accessToken": access,
	})
}

func (h *AuthHandler) Me(c *gin.Context) {
	userIDVal, ok := c.Get("userId")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	var user core.User
	if err := h.DB.First(&user, userIDVal).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not_found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": user.ID, "email": user.Email, "name": user.Name, "role": user.Role})
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	// Get refresh token from cookie
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "refresh_token_missing"})
		return
	}

	// Parse and validate refresh token
	claims, err := auth.ParseToken(refreshToken, h.Cfg.JWT.RefreshSecret)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid_refresh_token"})
		return
	}

	// Generate new access token
	access, err := auth.GenerateToken(claims.UserID, h.Cfg.JWT.AccessSecret, h.Cfg.JWT.AccessTTL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token_error"})
		return
	}

	// Generate new refresh token (token rotation)
	refresh, err := auth.GenerateToken(claims.UserID, h.Cfg.JWT.RefreshSecret, h.Cfg.JWT.RefreshTTL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token_error"})
		return
	}

	// Set new refresh token as HttpOnly cookie
	c.SetCookie("refresh_token", refresh, int(h.Cfg.JWT.RefreshTTL.Seconds()), "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{
		"accessToken": access,
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	// Clear refresh token cookie
	c.SetCookie("refresh_token", "", -1, "/", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "logged_out"})
}

func (h *AuthHandler) UpdateRole(c *gin.Context) {
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

	var req updateRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_request"})
		return
	}

	fmt.Printf("Updating user %d role to: %s\n", userID, req.Role)

	if err := h.DB.Model(&core.User{}).Where("id = ?", userID).Update("role", req.Role).Error; err != nil {
		fmt.Printf("Error updating role: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update_failed"})
		return
	}

	fmt.Printf("Successfully updated user %d role to: %s\n", userID, req.Role)

	c.JSON(http.StatusOK, gin.H{"message": "role_updated"})
}


