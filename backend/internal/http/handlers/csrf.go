package handlers

import (
	"crypto/rand"
	"encoding/base64"
	"net/http"

	"github.com/gin-gonic/gin"
)

const (
	CSRFTokenHeader = "X-CSRF-Token"
	CSRFTokenCookie = "csrf_token"
	CSRFTokenLength = 32
)

// CSRFMiddleware generates and validates CSRF tokens
func CSRFMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Skip CSRF for GET requests, static files, and authentication endpoints
		if c.Request.Method == "GET" || 
		   c.Request.URL.Path == "/health" ||
		   c.Request.URL.Path == "/auth/login" ||
		   c.Request.URL.Path == "/auth/register" ||
		   c.Request.URL.Path == "/auth/refresh" {
			c.Next()
			return
		}

		// Get CSRF token from cookie
		csrfCookie, err := c.Cookie(CSRFTokenCookie)
		if err != nil {
			// Generate new CSRF token
			csrfToken := generateCSRFToken()
			c.SetCookie(CSRFTokenCookie, csrfToken, 3600, "/", "", false, true) // HttpOnly, Secure in production
			c.Next()
			return
		}

		// Get CSRF token from header
		csrfHeader := c.GetHeader(CSRFTokenHeader)
		if csrfHeader == "" {
			c.JSON(http.StatusForbidden, gin.H{"error": "csrf_token_missing"})
			c.Abort()
			return
		}

		// Validate CSRF token
		if csrfHeader != csrfCookie {
			c.JSON(http.StatusForbidden, gin.H{"error": "csrf_token_invalid"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// generateCSRFToken creates a random CSRF token
func generateCSRFToken() string {
	b := make([]byte, CSRFTokenLength)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

// GetCSRFToken returns the current CSRF token for the client
func GetCSRFToken(c *gin.Context) string {
	csrfToken, err := c.Cookie(CSRFTokenCookie)
	if err != nil {
		csrfToken = generateCSRFToken()
		c.SetCookie(CSRFTokenCookie, csrfToken, 3600, "/", "", false, true)
	}
	return csrfToken
}
