package core

import "time"

type User struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Email        string    `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string    `json:"-"`
	Name         string    `json:"name"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"createdAt"`
}

type Property struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	OwnerID      uint      `gorm:"index;not null" json:"ownerId"`
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	Price        float64   `json:"price"`
	PriceType    string    `json:"priceType"`
	City         string    `json:"city"`
	Address      string    `json:"address"`
	Lat          float64   `json:"lat"`
	Lng          float64   `json:"lng"`
	Rooms        int       `json:"rooms"`
	Area         int       `json:"area"`
	Amenities    string    `json:"amenities"` // simple CSV for minimal start
	PropertyType string    `json:"propertyType"`
	ContactPhone string    `json:"phone"`
	ContactEmail string    `json:"email"`
	IsUrgent     bool      `json:"isUrgent"`
	Visibility   string    `json:"visibility"`
	CreatedAt    time.Time `json:"createdAt"`

	Images []PropertyImage `json:"images"`
}

type PropertyImage struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	PropertyID uint   `gorm:"index;not null" json:"propertyId"`
	URL        string `json:"url"`
	Order      int    `json:"order"`
}

type Favorite struct {
	UserID     uint `gorm:"primaryKey" json:"userId"`
	PropertyID uint `gorm:"primaryKey" json:"propertyId"`
}

// Conversation represents a 1:1 chat between a seeker and an owner, optionally bound to a property
type Conversation struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	PropertyID  *uint     `gorm:"index" json:"propertyId,omitempty"`
	InitiatorID uint      `gorm:"index;not null" json:"initiatorId"`
	RecipientID uint      `gorm:"index;not null" json:"recipientId"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`

	LastMessageAt *time.Time `json:"lastMessageAt"`
}

// Message in a conversation
type Message struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	ConversationID uint      `gorm:"index;not null" json:"conversationId"`
	SenderID       uint      `gorm:"index;not null" json:"senderId"`
	Type           string    `gorm:"type:varchar(20);default:text" json:"type"` // text,image
	Content        string    `gorm:"type:text" json:"content"`
	AttachmentURL  string    `json:"attachmentUrl"`
	CreatedAt      time.Time `json:"createdAt"`
	ReadAt         *time.Time `json:"readAt"`
}

// UserPlan represents a user's subscription plan
type UserPlan struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"uniqueIndex;not null" json:"userId"`
	PlanType    string    `gorm:"type:varchar(20);default:free" json:"planType"` // free, premium, unlimited
	MaxListings int       `gorm:"default:3" json:"maxListings"`
	ExpiresAt   *time.Time `json:"expiresAt"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// PropertyPromotion represents a promoted listing
type PropertyPromotion struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	PropertyID uint      `gorm:"uniqueIndex;not null" json:"propertyId"`
	UserID     uint      `gorm:"index;not null" json:"userId"`
	ExpiresAt  time.Time `gorm:"not null" json:"expiresAt"`
	CreatedAt  time.Time `json:"createdAt"`
}


