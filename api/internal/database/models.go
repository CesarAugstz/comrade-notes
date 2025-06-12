package database

import (
	"gorm.io/gorm"
	"time"
)

type User struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	Email     string    `gorm:"uniqueIndex;not null" json:"email"`
	Name      string    `gorm:"not null" json:"name"`
	AvatarURL string    `json:"avatar_url"`
	GoogleID  string    `gorm:"uniqueIndex;not null" json:"google_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Category struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	Name      string    `gorm:"uniqueIndex;not null" json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Wishlist struct {
	ID          uint           `gorm:"primarykey" json:"id"`
	Name        string         `gorm:"not null" json:"name"`
	Description string         `json:"description"`
	CategoryID  *uint          `json:"category_id"`
	Category    *Category      `gorm:"foreignKey:CategoryID" json:"category"`
	OwnerID     uint           `gorm:"not null" json:"owner_id"`
	Owner       User           `gorm:"foreignKey:OwnerID" json:"owner"`
	Items       []WishlistItem `gorm:"foreignKey:WishlistID" json:"items"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
}

type WishlistItem struct {
	ID          uint      `gorm:"primarykey" json:"id"`
	Name        string    `gorm:"not null" json:"name"`
	Description string    `json:"description"`
	CategoryID  *uint     `json:"category_id"`
	Category    *Category `gorm:"foreignKey:CategoryID" json:"category"`
	Rating      *int      `gorm:"check:rating >= 0 AND rating <= 5" json:"rating"`
	WishlistID  uint      `gorm:"not null" json:"wishlist_id"`
	Links       []Link    `gorm:"foreignKey:WishlistItemID" json:"links"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Link struct {
	ID             uint      `gorm:"primarykey" json:"id"`
	URL            string    `gorm:"not null" json:"url"`
	Title          string    `json:"title"`
	Price          *string   `json:"price"`
	WishlistItemID uint      `gorm:"not null" json:"wishlist_item_id"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&User{},
		&Category{},
		&Wishlist{},
		&WishlistItem{},
		&Link{},
	)
}
