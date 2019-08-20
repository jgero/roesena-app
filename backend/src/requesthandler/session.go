package requesthandler

import (
	"db"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"go.mongodb.org/mongo-driver/bson"
)

// CreateSession checks if username and password are correct,\
// generates a session id and stores it in the database and a cookie
func CreateSession(w http.ResponseWriter, req *http.Request) {
	// the response is always a json string
	w.Header().Set("Content-Type", "application/json")

	if req.Method == "POST" {
		// try to read a Person from the request body
		var details map[string]interface{}
		err := json.NewDecoder(req.Body).Decode(&details)
		username, unameerr := details["username"].(string)
		password, pwerr := details["password"].(string)
		if err != nil || !unameerr || !pwerr {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("body could not be read")})
			return
		}
		// get user from db to compare passwords
		responder := db.HTTPResponder{W: w}
		qElem := db.GetElement{Collection: "persons", HTTPResponder: responder, Filter: bson.M{"name": username}}
		res := qElem.Run()
		if res == nil {
			return
		}
		// check if password is a string
		if checkPassword(password, res[0]["password"]) {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("wrong password")})
			return
		}
		// create session id and store it in the database
		sessionID := uuid.New().String()
		qElement := db.UpdateOneElement{
			Collection:    "persons",
			Element:       bson.D{{"$set", bson.M{"sessionId": sessionID}}},
			Filter:        bson.M{"name": username},
			IgnoreSession: true,
			HTTPResponder: responder,
		}
		resp := qElement.Run()
		if resp == nil {
			return
		}
		// set the cookie with the session id
		http.SetCookie(w, &http.Cookie{
			Name:  "session_token",
			Value: sessionID,
		})
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "authenticated"})
		return
	}
	// all unused HTTP methods arrive here
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(map[string]interface{}{"Error": "Use POST when trying to authenticate"})
}

func checkPassword(pwone string, pwtwo interface{}) bool {
	if reqPW, okay := pwtwo.(string); okay {
		// compare the password from the db with the password from the user input
		err := bcrypt.CompareHashAndPassword([]byte(pwone), []byte(reqPW))
		if err == nil {
			return true
		}

	}
	return false
}

// RestoreSession looks if there are any leftover cookies\
// and returns the username if the session id is still valid
func RestoreSession(w http.ResponseWriter, req *http.Request) {
	// the response will always be json
	w.Header().Set("Content-Type", "application/json")
	// request has to be a get
	if req.Method == "GET" {
		// get the session_token cookie
		cookie, err := req.Cookie("session_token")
		if err != nil {
			// if there is no cookie just do nothing and return unauthorized
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": "no cookie left over from previous sessions"})
			return
		}
		// check which user the cookie belongs to
		responder := db.HTTPResponder{W: w}
		qElem := db.GetElement{
			Collection:    "persons",
			Filter:        bson.M{"sessionId": cookie.Value},
			HTTPResponder: responder,
		}
		res := qElem.Run()
		if res == nil {
			// something went wrong, delete cookie
			// this is done by setting max age to -1
			http.SetCookie(w, &http.Cookie{
				Name:   "session_token",
				Value:  "",
				MaxAge: -1,
			})
			return
		}
		// arriving here means the session_id of the cookie was still valid
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{"username": res[0]["name"]})
	}
}

// CloseSession deletes a session id from the database and removes the cookie
func CloseSession(w http.ResponseWriter, req *http.Request) {
	// the response is always a json string
	w.Header().Set("Content-Type", "application/json")
	// only accept posts
	if req.Method == "POST" {
		p := strings.Split(req.URL.Path, "/")
		// check if there is something after the "/" after "logout"
		if (len(p) == 4) && p[3] != "" {
			// delete cookie
			http.SetCookie(w, &http.Cookie{
				Name:   "session_token",
				Value:  "",
				MaxAge: -1,
			})
			// unset sessionId in db
			responder := db.HTTPResponder{W: w}
			qElem := db.UpdateOneElement{
				Collection:    "persons",
				Filter:        bson.M{"name": p[3]},
				Element:       bson.D{{"$unset", bson.M{"sessionId": ""}}},
				IgnoreSession: true,
				HTTPResponder: responder,
			}
			res := qElem.Run()
			if res == nil {
				return
			}
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": fmt.Sprintf("%v is logged out", p[3])})
			return
		}
	}
	// bad request (wrong method)
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(map[string]interface{}{"Error": "check URI and use POST"})
}
