package db

import (
	"fmt"
)

// UnauthorizedError is used, when a user makes a request for something that is out of his authority group
type UnauthorizedError struct {
	DeniedAction string
}

func (e *UnauthorizedError) Error() string {
	return fmt.Sprintf("not allowed to do: %v", e.DeniedAction)
}

// NoMatchesError is used, when a database query does not carry any results
type NoMatchesError struct {
	Field string
	Value string
}

func (e *NoMatchesError) Error() string {
	return fmt.Sprintf("no matches for for field '%v' with value '%v'", e.Field, e.Value)
}
