package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"

	"github.com/cesaraugstz/comrade-notes/api/internal/config"
	"github.com/cesaraugstz/comrade-notes/api/internal/database"
	appErrors "github.com/cesaraugstz/comrade-notes/api/internal/shared/errors"
)

type AuthHandlers struct {
	oauth     *OAuthService
	jwt       *JWTService
	db        *gorm.DB
	sessions  map[string]time.Time
	validator *validator.Validate
	config    *config.Config
}

func NewAuthHandlers(oauth *OAuthService, jwt *JWTService, db *gorm.DB, cfg *config.Config) *AuthHandlers {
	return &AuthHandlers{
		oauth:     oauth,
		jwt:       jwt,
		db:        db,
		sessions:  make(map[string]time.Time),
		validator: validator.New(),
		config:    cfg,
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

	return c.JSON(http.StatusOK, map[string]any{
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

func (h *AuthHandlers) UsernameLogin(c echo.Context) error {
	var req LoginRequest

	if err := c.Bind(&req); err != nil {
		return appErrors.ErrInvalidInput
	}

	if err := h.validator.Struct(req); err != nil {
		return appErrors.NewAppError("VALIDATION_ERROR", "Invalid input: "+err.Error(), http.StatusBadRequest)
	}

	var user database.User
	if err := h.db.Where("email = ?", req.Login).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return appErrors.ErrInvalidCredentials
		}
		return appErrors.ErrInternalServer
	}

	if !CheckPasswordHash(req.Password, user.Password) {
		return appErrors.ErrInvalidCredentials
	}

	jwtToken, err := h.jwt.GenerateToken(user.ID, user.Email)
	if err != nil {
		return appErrors.ErrTokenGeneration
	}

	user.Password = ""

	return c.JSON(http.StatusOK, AuthResponse{
		Token: jwtToken,
		User:  user,
	})
}

func (h *AuthHandlers) Singup(c echo.Context) error {
  fmt.Println("singup", h.config.EnableSingup)
	if h.config.EnableSingup == "false" {
		return &appErrors.AppError{
			Code:    "FORBIDDEN",
			Message: "Singup is disabled",
			Status:  http.StatusForbidden,
		}
	}

	var req SingupRequest

	if err := c.Bind(&req); err != nil {
		return appErrors.ErrInvalidInput
	}

	if err := h.validator.Struct(req); err != nil {
		return appErrors.NewAppError("VALIDATION_ERROR", "Invalid input: "+err.Error(), http.StatusBadRequest)
	}

	var user database.User

	hashed_password, err := HashPassword(req.Password)

	if err != nil {
		return appErrors.ErrInternalServer
	}

	user = database.User{
		Email:    req.Email,
		Name:     req.Name,
		Password: hashed_password,
	}

	if err := h.db.Create(&user).Error; err != nil {
		return appErrors.ErrInternalServer
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "User created"})
}

func generateRandomString(length int) string {
	bytes := make([]byte, length/2)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}
