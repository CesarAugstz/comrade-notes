package errors

import (
	"net/http"
)

type AppError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Status  int    `json:"-"`
}

func (e *AppError) Error() string {
	return e.Message
}

var (
	ErrInvalidCredentials = &AppError{
		Code:    "INVALID_CREDENTIALS",
		Message: "Invalid email or password",
		Status:  http.StatusUnauthorized,
	}

	ErrUserNotFound = &AppError{
		Code:    "USER_NOT_FOUND",
		Message: "User not found",
		Status:  http.StatusNotFound,
	}

	ErrInvalidInput = &AppError{
		Code:    "INVALID_INPUT",
		Message: "Invalid input data",
		Status:  http.StatusBadRequest,
	}

	ErrInternalServer = &AppError{
		Code:    "INTERNAL_ERROR",
		Message: "Internal server error",
		Status:  http.StatusInternalServerError,
	}

	ErrInvalidState = &AppError{
		Code:    "INVALID_STATE",
		Message: "Invalid authentication state",
		Status:  http.StatusBadRequest,
	}

	ErrTokenGeneration = &AppError{
		Code:    "TOKEN_GENERATION_FAILED",
		Message: "Failed to generate authentication token",
		Status:  http.StatusInternalServerError,
	}
)

func NewAppError(code, message string, status int) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Status:  status,
	}
}
