package handlers

import (
	"net/http"
	"strings"

	"gofuckbiz/snimayprosto-rent-easy/internal/auth"
	"gofuckbiz/snimayprosto-rent-easy/internal/config"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		h := c.GetHeader("Authorization")
		if h == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing_authorization"})
			return
		}
		parts := strings.SplitN(h, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid_authorization"})
			return
		}
		claims, err := auth.ParseToken(parts[1], cfg.JWT.AccessSecret)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid_token"})
			return
		}
		// Store as uint to avoid type conversion issues
		c.Set("userId", uint(claims.UserID))
		c.Next()
	}
}


