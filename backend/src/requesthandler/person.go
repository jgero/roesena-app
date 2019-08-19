package requesthandler

import (
	"db"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
)

// HandlePerson acts on all http requests concerning persons
func HandlePerson(w http.ResponseWriter, req *http.Request) {
	// the response is always a json string
	w.Header().Set("Content-Type", "application/json")
	// take URL like: (/api/person/john) and split it
	p := strings.Split(req.URL.Path, "/")
	// if the URL has a trailing "/" the length is 4 and the route is valid
	// if it's a GET the last segment is allowed to be an empty string, otherwise not
	if len(p) == 4 && (req.Method == "GET" || ((req.Method == "POST" || req.Method == "PUT" || req.Method == "DELETE") && p[3] != "")) {
		// get the session_token cookie
		cookie, err := req.Cookie("session_token")
		if err != nil && req.Method != "GET" {
			// if there is no cookie just do nothing and return unauthorized
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": "please log in first"})
			return
		}
		// this type handles the error responding
		responder := db.HTTPResponder{W: w}
		// all of the methods create a query element, so it can be defined here
		var qElem db.QueryElement
		switch req.Method {
		case "GET":
			if p[3] != "" {
				// get the element with the given name
				qElem = &db.GetElement{Collection: "persons", Filter: bson.M{"name": p[3]}, HTTPResponder: responder}
			} else {
				// get all elements
				qElem = &db.GetElement{Collection: "persons", Filter: bson.M{}, HTTPResponder: responder}
			}
			break
		case "POST":
			qElem = &db.InsertOneElement{Collection: "persons", Element: req.Body, Session: cookie.String(), HTTPResponder: responder}
			break
		case "PUT":
			qElem = &db.ReplaceOneElement{Collection: "persons", Filter: bson.M{"name": p[3]}, Element: req.Body, Session: cookie.String(), HTTPResponder: responder}
			break
		case "DELETE":
			qElem = &db.DeleteOneElement{Collection: "persons", Filter: bson.M{"name": p[3]}, Session: cookie.String()}
			break
		}
		// Run() automatically responds on error and returns nil
		res := qElem.Run()
		if res != nil {
			// only have to write here when res is not nil
			// when res is nil Run() will have responded alredy
			json.NewEncoder(w).Encode(res)
		}
		return
	}
	// route has wrong nuber of parts or unknown request method
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("faulty URI path provided: %v", req.URL.Path)})
}
