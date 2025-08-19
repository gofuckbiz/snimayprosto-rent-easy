package main

import (
	"fmt"
	"log"
	"os"

	"gofuckbiz/snimayprosto-rent-easy/internal/config"
	"gofuckbiz/snimayprosto-rent-easy/internal/core"
	"gofuckbiz/snimayprosto-rent-easy/internal/database"
	handlers "gofuckbiz/snimayprosto-rent-easy/internal/http/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func ensureUploadsDir(dir string) error {
	if dir == "" {
		return nil
	}
	return os.MkdirAll(dir, 0o755)
}

func main() {
	cfg := config.Load()

	r := gin.Default()

	// ✅ CORS middleware (через gin-contrib/cors)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:8081", "http://127.0.0.1:8081"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-CSRF-Token"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// подключение к БД
	db, err := database.OpenPostgres(cfg)
	if err != nil {
		log.Fatalf("postgres: %v", err)
	}

	// миграции
	if err := db.AutoMigrate(&core.User{}, &core.Property{}, &core.PropertyImage{}, &core.Favorite{}, &core.Conversation{}, &core.Message{}, &core.UserPlan{}, &core.PropertyPromotion{}); err != nil {
		log.Fatalf("migrate: %v", err)
	}

	// папка для загрузок
	if err := ensureUploadsDir(cfg.Uploads.Dir); err != nil {
		log.Fatalf("uploads dir: %v", err)
	}

	// health-check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"ok": true})
	})

	// auth
	auth := handlers.NewAuthHandler(db, cfg)
	r.POST("/auth/register", auth.Register)
	r.POST("/auth/login", auth.Login)
	r.POST("/auth/refresh", auth.Refresh)
	r.POST("/auth/logout", auth.Logout)
	r.GET("/auth/me", handlers.AuthMiddleware(cfg), auth.Me)
	r.PUT("/auth/role", handlers.AuthMiddleware(cfg), auth.UpdateRole)

	// properties
	props := handlers.NewPropertiesHandler(db, cfg)
	r.POST("/properties", handlers.AuthMiddleware(cfg), props.Create)
	r.GET("/properties", props.List)
	r.GET("/properties/:id", props.Get)
	r.POST("/properties/:id/images", handlers.AuthMiddleware(cfg), props.UploadImages)
	r.GET("/properties/my", handlers.AuthMiddleware(cfg), props.MyListings)
	r.POST("/properties/:id/promote", handlers.AuthMiddleware(cfg), props.PromoteProperty)

	// plans
	plans := handlers.NewPlansHandler(db, cfg)
	r.GET("/plans/my", handlers.AuthMiddleware(cfg), plans.GetMyPlan)
	r.POST("/plans/upgrade", handlers.AuthMiddleware(cfg), plans.UpgradePlan)

	// chat
	chat := handlers.NewChatHandler(db, cfg)
	r.POST("/chat/start/:propertyId", handlers.AuthMiddleware(cfg), chat.StartConversation)
	r.GET("/chat/:conversationId/messages", handlers.AuthMiddleware(cfg), chat.ListMessages)
	r.GET("/chat/conversations", handlers.AuthMiddleware(cfg), chat.ListConversations)
	r.GET("/ws/chat/:conversationId", chat.Socket) // WebSocket route, token in query param

	// stats
	stats := handlers.NewStatsHandler(db, cfg)
	r.GET("/stats", stats.GetStats)

	// serve uploaded files
	r.Static("/uploads", cfg.Uploads.Dir)

	// запуск сервера
	addr := fmt.Sprintf(":%s", cfg.HTTPPort)
	if err := r.Run(addr); err != nil {
		log.Fatal(err)
	}
}
