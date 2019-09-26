package requesthandler

import (
	"db"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// HandleImage acts on all http requests concerning images
func HandleImage(w http.ResponseWriter, req *http.Request) {
	// the response is always a json string
	w.Header().Set("Content-Type", "application/json")
	// take URL like: (/api/image/asdf) and split it
	p := strings.Split(req.URL.Path, "/")
	// get the id parameter
	id, hasId := req.URL.Query()["id"]
	// if it's a POST the id is not needed
	if len(p) == 3 && (req.Method == "POST" || ((req.Method == "GET" || req.Method == "PUT" || req.Method == "DELETE") && hasId)) {
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
			if id[0] != "*" {
				// get the element with the given id
				objID, _ := primitive.ObjectIDFromHex(id[0])
				qElem = &db.GetElement{Collection: "images", Filter: bson.M{"_id": objID}, HTTPResponder: responder}
			} else {
				// get all elements
				qElem = &db.GetElement{Collection: "images", Filter: bson.M{}, HTTPResponder: responder, Projection: bson.D{{"_id", 1}, {"description", 1}, {"tags", 1}}}
			}
			break
		case "POST":
			qElem = &db.InsertOneElement{Collection: "images", Element: req.Body, Session: cookie.Value, HTTPResponder: responder}
			break
		case "PUT":
			objID, _ := primitive.ObjectIDFromHex(id[0])
			qElem = &db.ReplaceOneElement{Collection: "images", Filter: bson.M{"_id": objID}, Element: req.Body, Session: cookie.Value, HTTPResponder: responder}
			break
		case "DELETE":
			objID, _ := primitive.ObjectIDFromHex(id[0])
			qElem = &db.DeleteOneElement{Collection: "images", Filter: bson.M{"_id": objID}, Session: cookie.Value, HTTPResponder: responder}
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
