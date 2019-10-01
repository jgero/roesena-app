package requesthandler

import (
	"db"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// HandleEvent acts on all http requests concerning articles
func HandleEvent(w http.ResponseWriter, req *http.Request) {
	// the response is always a json string
	w.Header().Set("Content-Type", "application/json")
	// take URL like: (/api/article/asdf) and split it
	p := strings.Split(req.URL.Path, "/")
	// get the parameters
	id, hasId := req.URL.Query()["id"]
	start, hasStart := req.URL.Query()["start"]
	end, hasEnd := req.URL.Query()["end"]

	if len(p) == 3 {
		// get the session_token cookie
		cookie, err := req.Cookie("session_token")
		if err != nil {
			// if there is no cookie just do nothing and return unauthorized
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": "please log in first"})
			return
		}

		// this type handles the error responding
		responder := db.HTTPResponder{W: w}
		// all of the methods create a query element, so it can be defined here
		var qElem db.QueryElement
		if req.Method == "GET" {
			if hasId {
				if id[0] != "*" {
					// get the element with the given id
					objID, _ := primitive.ObjectIDFromHex(id[0])
					qElem = &db.GetElement{Collection: "events", Filter: bson.M{"_id": objID}, Session: cookie.Value, HTTPResponder: responder}
				} else {
					// get all elements
					qElem = &db.GetElement{Collection: "events", Filter: bson.M{}, Session: cookie.Value, HTTPResponder: responder}
				}
			} else if hasStart && hasEnd {
				// convert all the start parts to ints
				startDate, syok := strconv.Atoi(start[0])
				// convert all the end parts to ints
				endDate, eyok := strconv.Atoi(end[0])
				if syok != nil || eyok != nil {
					w.WriteHeader(http.StatusBadRequest)
					json.NewEncoder(w).Encode(map[string]string{"Error": "bad time parameters"})
					return
				}
				// get events by date
				qElem = &db.GetElement{
					Collection: "events",
					// start date or end date have to be in the timeframe
					Filter: bson.M{
						"$and": bson.A{
							// startDate is in the filter timespan
							bson.M{
								"startDate": bson.M{
									"$lte": endDate,
								},
							},
							bson.M{
								"endDate": bson.M{
									"$gte": startDate,
								},
							},
						},
					},
					Session:       cookie.Value,
					HTTPResponder: responder,
				}
			}
		} else if req.Method == "POST" || ((req.Method == "PUT" || req.Method == "DELETE") && hasId) {
			// here switch with put post delete
			switch req.Method {
			case "POST":
				qElem = &db.InsertOneElement{Collection: "events", Element: req.Body, Session: cookie.Value, HTTPResponder: responder}
				break
			case "PUT":
				objID, _ := primitive.ObjectIDFromHex(id[0])
				qElem = &db.ReplaceOneElement{Collection: "events", Filter: bson.M{"_id": objID}, Element: req.Body, Session: cookie.Value, HTTPResponder: responder}
				break
			case "DELETE":
				objID, _ := primitive.ObjectIDFromHex(id[0])
				qElem = &db.DeleteOneElement{Collection: "events", Filter: bson.M{"_id": objID}, Session: cookie.Value, HTTPResponder: responder}
				break
			}
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
