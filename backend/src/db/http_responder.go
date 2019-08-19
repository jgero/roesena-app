package db

import (
	"encoding/json"
	"net/http"
)

// HTTPResponder needs the ResponseWriter to be able to perform its actions
type HTTPResponder struct {
	W http.ResponseWriter
}

// respondError creates a response for an error
func (res *HTTPResponder) respondError(e error) {
	json.NewEncoder(res.W).Encode(map[string]interface{}{"Error": e.Error()})
	switch e.(type) {
	case *NoMatchesError:
		res.W.WriteHeader(http.StatusNotFound)
		return
	case *UnauthorizedError:
		res.W.WriteHeader(http.StatusUnauthorized)
		return
	default:
		res.W.WriteHeader(http.StatusInternalServerError)
		return
	}
}
