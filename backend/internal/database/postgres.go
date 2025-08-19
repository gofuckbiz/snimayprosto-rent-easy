package database

import (
	"fmt"
	"log"

	"gofuckbiz/snimayprosto-rent-easy/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func OpenPostgres(cfg *config.Config) (*gorm.DB, error) {
	var dsn string
	if cfg.DB.DSN != "" {
		dsn = cfg.DB.DSN
	} else {
		dsn = fmt.Sprintf(
			"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
			cfg.DB.Host, cfg.DB.Port, cfg.DB.User, cfg.DB.Pass, cfg.DB.Name, cfg.DB.SSLMode,
		)
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Verify connection
	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}
	if err := sqlDB.Ping(); err != nil {
		return nil, err
	}
	log.Println("connected to postgres")
	return db, nil
}


