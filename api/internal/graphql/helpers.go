package graphql

import "context"

func getUserIDFromContext(ctx context.Context) uint {
	if userID, ok := ctx.Value("userID").(uint); ok {
		return userID
	}
	return 0
}

func stringPtr(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func stringValue(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func uintPtr(u uint) *uint {
	return &u
}
