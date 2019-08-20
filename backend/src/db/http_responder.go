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
	switch e.(type) {
	case *NoMatchesError:
		res.W.WriteHeader(http.StatusNotFound)
		break
	case *UnauthorizedError:
		res.W.WriteHeader(http.StatusUnauthorized)
		break
	default:
		res.W.WriteHeader(http.StatusInternalServerError)
		break
	}
	json.NewEncoder(res.W).Encode(map[string]interface{}{"Error": e.Error()})
}
