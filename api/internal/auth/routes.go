package auth

import (
	"github.com/labstack/echo/v4"
)

type Routes struct {
	handlers *AuthHandlers
}

func NewRoutes(handlers *AuthHandlers) *Routes {
	return &Routes{
		handlers: handlers,
	}
}

func (r *Routes) RegisterRoutes(e *echo.Echo) {
	authGroup := e.Group("/auth")

	authGroup.GET("/google", r.handlers.GoogleLogin)
	authGroup.GET("/google/callback", r.handlers.GoogleCallback)
	authGroup.POST("/login", r.handlers.UsernameLogin)
	authGroup.POST("/singup", r.handlers.Singup)
}
