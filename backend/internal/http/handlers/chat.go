package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gorm.io/gorm"

	"gofuckbiz/snimayprosto-rent-easy/internal/config"
	"gofuckbiz/snimayprosto-rent-easy/internal/core"
	"gofuckbiz/snimayprosto-rent-easy/internal/auth"
)

type ChatHandler struct {
	DB  *gorm.DB
	Cfg *config.Config
}

func NewChatHandler(db *gorm.DB, cfg *config.Config) *ChatHandler {
	return &ChatHandler{DB: db, Cfg: cfg}
}

// Create or get conversation between current user and property owner
func (h *ChatHandler) StartConversation(c *gin.Context) {
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

	propertyID, err := strconv.Atoi(c.Param("propertyId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_property_id"})
		return
	}

	var property core.Property
	if err := h.DB.First(&property, propertyID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "property_not_found"})
		return
	}

	var conv core.Conversation
	// try existing conversation between same pair bound to property
	if err := h.DB.Where("(initiator_id = ? AND recipient_id = ? OR initiator_id = ? AND recipient_id = ?) AND property_id = ?",
		userID, property.OwnerID, property.OwnerID, userID, property.ID).
		First(&conv).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			conv = core.Conversation{
				PropertyID:  &property.ID,
				InitiatorID: userID,
				RecipientID: property.OwnerID,
			}
			if err := h.DB.Create(&conv).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "create_conversation_failed"})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "conversation_lookup_failed"})
			return
		}
	}

	c.JSON(http.StatusOK, conv)
}

// List messages in a conversation
func (h *ChatHandler) ListMessages(c *gin.Context) {
	convID, err := strconv.Atoi(c.Param("conversationId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_conversation_id"})
		return
	}

	var msgs []core.Message
	if err := h.DB.Where("conversation_id = ?", convID).Order("created_at asc").Find(&msgs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "list_failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": msgs})
}

// List conversations for a landlord
func (h *ChatHandler) ListConversations(c *gin.Context) {
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

	// Get all conversations where user is the owner
	var conversations []core.Conversation
	if err := h.DB.Where("recipient_id = ?", userID).Find(&conversations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed_to_fetch_conversations"})
		return
	}

	// Build response with additional data
	var response []gin.H
	for _, conv := range conversations {
		// Skip conversations without property
		if conv.PropertyID == nil {
			continue
		}
		
		// Get property info
		var property core.Property
		if err := h.DB.First(&property, *conv.PropertyID).Error; err != nil {
			continue // Skip if property not found
		}

		// Get initiator info
		var initiator core.User
		if err := h.DB.First(&initiator, conv.InitiatorID).Error; err != nil {
			continue // Skip if initiator not found
		}

		// Get last message
		var lastMessage core.Message
		h.DB.Where("conversation_id = ?", conv.ID).Order("created_at DESC").First(&lastMessage)

		// Count unread messages
		var unreadCount int64
		h.DB.Model(&core.Message{}).Where("conversation_id = ? AND sender_id != ? AND id > ?", 
			conv.ID, userID, 0).Count(&unreadCount)

		response = append(response, gin.H{
			"id":              conv.ID,
			"propertyId":      *conv.PropertyID,
			"propertyTitle":   property.Title,
			"propertyPrice":   property.Price,
			"initiatorId":     conv.InitiatorID,
			"ownerId":         conv.RecipientID,
			"initiatorName":   initiator.Name,
			"lastMessage":     lastMessage,
			"unreadCount":     unreadCount,
		})
	}

	c.JSON(http.StatusOK, gin.H{"conversations": response})
}

// --- WebSocket ---
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type wsClient struct {
	conn *websocket.Conn
	user uint
	conv uint
}

// Very small in-memory hub for MVP only
var wsClients = make(map[*wsClient]struct{})

func (h *ChatHandler) Socket(c *gin.Context) {
	convID64, err := strconv.ParseUint(c.Param("conversationId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid_conversation_id"})
		return
	}
	// parse token from query
	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "missing_token"})
		return
	}
	claims, err := auth.ParseToken(token, h.Cfg.JWT.AccessSecret)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid_token"})
		return
	}
	userID := uint(claims.UserID)

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	client := &wsClient{conn: conn, user: userID, conv: uint(convID64)}
	wsClients[client] = struct{}{}

	defer func() {
		client.conn.Close()
		delete(wsClients, client)
	}()

	for {
		var incoming struct{ Type, Content string }
		if err := conn.ReadJSON(&incoming); err != nil {
			break
		}
		msg := core.Message{
			ConversationID: uint(convID64),
			SenderID:       userID,
			Type:           "text",
			Content:        incoming.Content,
		}
		if err := h.DB.Create(&msg).Error; err != nil {
			continue
		}
		// broadcast to participants of same conversation
		for c := range wsClients {
			if c.conv == uint(convID64) {
				_ = c.conn.WriteJSON(gin.H{
					"id": msg.ID,
					"conversationId": msg.ConversationID,
					"senderId": msg.SenderID,
					"type": msg.Type,
					"content": msg.Content,
					"createdAt": time.Now(),
				})
			}
		}
	}
}
