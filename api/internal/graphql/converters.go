package graphql

import (
	"strconv"
	"time"

	"github.com/cesaraugstz/comrade-notes/api/internal/database"
)

func convertWishlists(dbWishlists []database.Wishlist) []*Wishlist {
	wishlists := make([]*Wishlist, len(dbWishlists))
	for i, w := range dbWishlists {
		wishlists[i] = convertWishlist(&w)
	}
	return wishlists
}

func convertWishlist(w *database.Wishlist) *Wishlist {
	wishlist := &Wishlist{
		ID:          strconv.Itoa(int(w.ID)),
		Name:        w.Name,
		Description: stringPtr(w.Description),
		Owner:       convertUser(&w.Owner),
		Items:       convertWishlistItems(w.Items),
		CreatedAt:   w.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   w.UpdatedAt.Format(time.RFC3339),
	}

	if w.Category != nil {
		wishlist.Category = convertCategory(w.Category)
	}

	return wishlist
}

func convertWishlistItems(items []database.WishlistItem) []*WishlistItem {
	result := make([]*WishlistItem, len(items))
	for i, item := range items {
		result[i] = convertWishlistItem(&item)
	}
	return result
}

func convertWishlistItem(item *database.WishlistItem) *WishlistItem {
	result := &WishlistItem{
		ID:          strconv.Itoa(int(item.ID)),
		Name:        item.Name,
		Description: stringPtr(item.Description),
		Rating:      item.Rating,
		Links:       convertLinks(item.Links),
		CreatedAt:   item.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   item.UpdatedAt.Format(time.RFC3339),
	}

	if item.Category != nil {
		result.Category = convertCategory(item.Category)
	}

	return result
}

func convertLinks(links []database.Link) []*Link {
	result := make([]*Link, len(links))
	for i, link := range links {
		result[i] = convertLink(&link)
	}
	return result
}

func convertLink(link *database.Link) *Link {
	return &Link{
		ID:        strconv.Itoa(int(link.ID)),
		URL:       link.URL,
		Title:     stringPtr(link.Title),
		Price:     link.Price,
		CreatedAt: link.CreatedAt.Format(time.RFC3339),
		UpdatedAt: link.UpdatedAt.Format(time.RFC3339),
	}
}

func convertUser(user *database.User) *User {
	return &User{
		ID:        strconv.Itoa(int(user.ID)),
		Email:     user.Email,
		Name:      user.Name,
		AvatarURL: stringPtr(user.AvatarURL),
		CreatedAt: user.CreatedAt.Format(time.RFC3339),
		UpdatedAt: user.UpdatedAt.Format(time.RFC3339),
	}
}

func convertCategories(categories []database.Category) []*Category {
	result := make([]*Category, len(categories))
	for i, cat := range categories {
		result[i] = convertCategory(&cat)
	}
	return result
}

func convertCategory(cat *database.Category) *Category {
	return &Category{
		ID:        strconv.Itoa(int(cat.ID)),
		Name:      cat.Name,
		CreatedAt: cat.CreatedAt.Format(time.RFC3339),
		UpdatedAt: cat.UpdatedAt.Format(time.RFC3339),
	}
}
