package database

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/cesaraugstz/comrade-notes/api/internal/config"
)

func NewConnection(cfg *config.Config) *gorm.DB {
	createDatabaseIfNotExists(cfg)

	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	err = db.AutoMigrate(&User{}, &Category{}, &Wishlist{}, &WishlistItem{}, &Link{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	if cfg.SeedDB == "true" {
		SeedDatabase(db)
	}

	log.Println("Database connected and migrated successfully")
	return db
}

func createDatabaseIfNotExists(cfg *config.Config) {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=postgres sslmode=%s",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBSSLMode)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})

	if err != nil {
		log.Fatal("Failed to connect to postgres database:", err)
	}

	var count int64
	db.Raw("SELECT 1 FROM pg_database WHERE datname = ?", cfg.DBName).Count(&count)

	if count == 0 {
		result := db.Exec(fmt.Sprintf("CREATE DATABASE %s", cfg.DBName))
		if result.Error != nil {
			log.Fatal("Failed to create database:", result.Error)
		}
		log.Printf("Database '%s' created successfully", cfg.DBName)
	} else {
		log.Printf("Database '%s' already exists", cfg.DBName)
	}

	sqlDB, _ := db.DB()
	sqlDB.Close()
}
