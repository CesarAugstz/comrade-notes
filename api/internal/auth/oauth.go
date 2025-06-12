package auth

import (
    "context"
    "encoding/json"
    "fmt"
    "net/http"

    "golang.org/x/oauth2"
    "golang.org/x/oauth2/google"
    "github.com/cesaraugstz/comrade-notes/api/internal/config"
)

type OAuthService struct {
    config *oauth2.Config
}

type GoogleUser struct {
    ID        string `json:"id"`
    Email     string `json:"email"`
    Name      string `json:"name"`
    Picture   string `json:"picture"`
    Verified  bool   `json:"verified_email"`
}

func NewOAuthService(cfg *config.Config) *OAuthService {
    return &OAuthService{
        config: &oauth2.Config{
            ClientID:     cfg.GoogleClientID,
            ClientSecret: cfg.GoogleSecret,
            RedirectURL:  fmt.Sprintf("http://localhost:%s/auth/google/callback", cfg.Port),
            Scopes:       []string{"openid", "profile", "email"},
            Endpoint:     google.Endpoint,
        },
    }
}

func (s *OAuthService) GetAuthURL(state string) string {
    return s.config.AuthCodeURL(state, oauth2.AccessTypeOffline)
}

func (s *OAuthService) ExchangeCode(ctx context.Context, code string) (*oauth2.Token, error) {
    return s.config.Exchange(ctx, code)
}

func (s *OAuthService) GetUserInfo(ctx context.Context, token *oauth2.Token) (*GoogleUser, error) {
    client := s.config.Client(ctx, token)
    
    resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("failed to get user info: %s", resp.Status)
    }

    var user GoogleUser
    if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
        return nil, err
    }

    return &user, nil
}
