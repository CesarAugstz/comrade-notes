package auth

import (
	"context"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

func AuthMiddleware(jwtService *JWTService) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "missing authorization header"})
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenString == authHeader {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid authorization format"})
			}

			claims, err := jwtService.ValidateToken(tokenString)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid token"})
			}

			ctx := context.WithValue(c.Request().Context(), "userID", claims.UserID)
			ctx = context.WithValue(ctx, "email", claims.Email)
			c.SetRequest(c.Request().WithContext(ctx))

			return next(c)
		}
	}
}
