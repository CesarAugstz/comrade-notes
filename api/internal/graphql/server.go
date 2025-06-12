package graphql

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/labstack/echo/v4"
)

func NewGraphQLHandler(resolver *Resolver) echo.HandlerFunc {
	h := handler.NewDefaultServer(NewExecutableSchema(Config{Resolvers: resolver}))
	
	return echo.WrapHandler(h)
}

func NewPlaygroundHandler() echo.HandlerFunc {
	h := playground.Handler("GraphQL Playground", "/graphql")
	
	return echo.WrapHandler(h)
}

