package main

import (
	"log/slog"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"

	"github.com/cesaraugstz/comrade-notes/api/internal/auth"
	"github.com/cesaraugstz/comrade-notes/api/internal/config"
	"github.com/cesaraugstz/comrade-notes/api/internal/database"
	"github.com/cesaraugstz/comrade-notes/api/internal/graphql"
	"github.com/cesaraugstz/comrade-notes/api/internal/shared/middleware"
)

func main() {
	cfg := config.Load()
	db := database.NewConnection(cfg)

	e := echo.New()

	e.Use(echoMiddleware.Logger())
	e.Use(echoMiddleware.Recover())
	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000", cfg.WebURL},
		AllowMethods:     []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowCredentials: true,
	}))

	e.Use(middleware.ErrorHandler())

	oauthService := auth.NewOAuthService(cfg)
	jwtService := auth.NewJWTService(cfg.JWTSecret)
	authHandlers := auth.NewAuthHandlers(oauthService, jwtService, db, cfg)

	authRoutes := auth.NewRoutes(authHandlers)
	authRoutes.RegisterRoutes(e)

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
