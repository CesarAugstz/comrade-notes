package middleware

import (
	"log/slog"
	"net/http"

	appErrors "github.com/cesaraugstz/comrade-notes/api/internal/shared/errors"
	"github.com/labstack/echo/v4"
)

func ErrorHandler() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			err := next(c)
			if err == nil {
				return nil
			}

			if appErr, ok := err.(*appErrors.AppError); ok {
				return c.JSON(appErr.Status, map[string]interface{}{
					"error": map[string]string{
						"code":    appErr.Code,
						"message": appErr.Message,
					},
				})
			}

			if httpErr, ok := err.(*echo.HTTPError); ok {
				return c.JSON(httpErr.Code, map[string]interface{}{
					"error": map[string]interface{}{
						"code":    "HTTP_ERROR",
						"message": httpErr.Message,
					},
				})
			}

			slog.Error("Unexpected error", "error", err.Error())

			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"error": map[string]string{
					"code":    "INTERNAL_ERROR",
					"message": "Internal server error",
				},
			})
		}
	}
}
