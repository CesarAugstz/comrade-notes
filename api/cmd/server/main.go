package main

import (
	"log/slog"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/cesaraugstz/comrade-notes/api/internal/auth"
	"github.com/cesaraugstz/comrade-notes/api/internal/config"
	"github.com/cesaraugstz/comrade-notes/api/internal/database"
	"github.com/cesaraugstz/comrade-notes/api/internal/graphql"
)

func main() {
	cfg := config.Load()
	db := database.NewConnection(cfg)

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	oauthService := auth.NewOAuthService(cfg)
	jwtService := auth.NewJWTService(cfg.JWTSecret)
	authHandlers := auth.NewAuthHandlers(oauthService, jwtService, db)

	e.GET("/auth/google", authHandlers.GoogleLogin)
	e.GET("/auth/google/callback", authHandlers.GoogleCallback)

	resolver := &graphql.Resolver{DB: db}

	e.POST("/graphql", graphql.NewGraphQLHandler(resolver), auth.AuthMiddleware(jwtService))
	e.GET("/playground", graphql.NewPlaygroundHandler())
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(200, map[string]string{"status": "ok"})
	})

	slog.Info("Server starting on :" + cfg.Port)
	if err := e.Start(":" + cfg.Port); err != nil {
		slog.Error("Server failed to start", "error", err)
	}
}
