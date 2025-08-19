package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	AppEnv   string
	HTTPPort string

	DB struct {
		Host    string
		Port    int
		User    string
		Pass    string
		Name    string
		SSLMode string
		DSN     string // optional full DSN override
	}

	JWT struct {
		AccessSecret  string
		RefreshSecret string
		AccessTTL     time.Duration
		RefreshTTL    time.Duration
	}

	Uploads struct {
		Dir string
	}
}

func getEnv(key, def string) string {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		return v
	}
	return def
}

func getEnvInt(key string, def int) int {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return def
}

func getEnvDuration(key string, def time.Duration) time.Duration {
	if v, ok := os.LookupEnv(key); ok && v != "" {
		if d, err := time.ParseDuration(v); err == nil {
			return d
		}
	}
	return def
}

func Load() *Config {
	c := &Config{}

	c.AppEnv = getEnv("APP_ENV", "dev")
	c.HTTPPort = getEnv("HTTP_PORT", "8080")

	c.DB.Host = getEnv("DB_HOST", "127.0.0.1")
	c.DB.Port = getEnvInt("DB_PORT", 5432)
	c.DB.User = getEnv("DB_USER", "postgres")
	c.DB.Pass = getEnv("DB_PASS", "postgres")
	c.DB.Name = getEnv("DB_NAME", "rent")
	c.DB.SSLMode = getEnv("DB_SSLMODE", "disable")
	c.DB.DSN = getEnv("DB_DSN", "")

	c.JWT.AccessSecret = getEnv("JWT_ACCESS_SECRET", "super_secret_access_key_that_is_long_and_random_1234567890")
	c.JWT.RefreshSecret = getEnv("JWT_REFRESH_SECRET", "super_secret_access_key_that_is_long_and_random_1234567890")
	c.JWT.AccessTTL = getEnvDuration("JWT_ACCESS_TTL", 15*time.Minute)  // Short-lived access tokens
	c.JWT.RefreshTTL = getEnvDuration("JWT_REFRESH_TTL", 7*24*time.Hour) // 7 days refresh tokens

	c.Uploads.Dir = getEnv("UPLOADS_DIR", "uploads")

	return c
}


