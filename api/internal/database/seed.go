package database

import (
	"gorm.io/gorm"
	"log"
)

func SeedDatabase(db *gorm.DB) {
	log.Println("Starting database seeding...")

	seedCategories(db)

	seedUsers(db)

	log.Println("Database seeding completed!")
}

func seedCategories(db *gorm.DB) {
	categories := []Category{
		{Name: "Alugueis"},
		{Name: "Casa"},
	}

	for _, category := range categories {
		var existing Category
		if err := db.Where("name = ?", category.Name).First(&existing).Error; err != nil {
			if err := db.Create(&category).Error; err != nil {
				log.Printf("Failed to seed category %s: %v", category.Name, err)
			} else {
				log.Printf("Seeded category: %s", category.Name)
			}
		}
	}
}

func seedUsers(db *gorm.DB) {
	users := []User{
		{
			Email: "admin@admin.com",
			Name:  "Admin",
		},
	}

	for _, user := range users {
		var existing User
		if err := db.Where("email = ?", user.Email).First(&existing).Error; err != nil {
			if err := db.Create(&user).Error; err != nil {
				log.Printf("Failed to seed user %s: %v", user.Email, err)
			} else {
				log.Printf("Seeded user: %s", user.Email)
			}
		}
	}
}
