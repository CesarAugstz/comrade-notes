package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"

	"github.com/cesaraugstz/comrade-notes/api/internal/database"
)

type AuthHandlers struct {
	oauth    *OAuthService
	jwt      *JWTService
	db       *gorm.DB
	sessions map[string]time.Time
}

func NewAuthHandlers(oauth *OAuthService, jwt *JWTService, db *gorm.DB) *AuthHandlers {
	return &AuthHandlers{
		oauth:    oauth,
		jwt:      jwt,
		db:       db,
		sessions: make(map[string]time.Time),
	}
}

func (h *AuthHandlers) GoogleLogin(c echo.Context) error {
	state := generateRandomString(32)
	h.sessions[state] = time.Now().Add(10 * time.Minute)

	url := h.oauth.GetAuthURL(state)
	return c.Redirect(http.StatusTemporaryRedirect, url)
}

func (h *AuthHandlers) GoogleCallback(c echo.Context) error {
	state := c.QueryParam("state")
	code := c.QueryParam("code")

	if _, exists := h.sessions[state]; !exists {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid state"})
	}
	delete(h.sessions, state)

	token, err := h.oauth.ExchangeCode(context.Background(), code)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to exchange code"})
	}

	googleUser, err := h.oauth.GetUserInfo(context.Background(), token)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to get user info"})
	}

	user, err := h.findOrCreateUser(googleUser)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to create user"})
	}

	jwtToken, err := h.jwt.GenerateToken(user.ID, user.Email)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to generate token"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"token": jwtToken,
		"user":  user,
	})
}

func (h *AuthHandlers) findOrCreateUser(googleUser *GoogleUser) (*database.User, error) {
	var user database.User

	err := h.db.Where("google_id = ?", googleUser.ID).First(&user).Error
	if err == nil {
		return &user, nil
	}

	if err != gorm.ErrRecordNotFound {
		return nil, err
	}

	user = database.User{
		Email:     googleUser.Email,
		Name:      googleUser.Name,
		AvatarURL: googleUser.Picture,
		GoogleID:  googleUser.ID,
	}

	if err := h.db.Create(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func generateRandomString(length int) string {
	bytes := make([]byte, length/2)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}
