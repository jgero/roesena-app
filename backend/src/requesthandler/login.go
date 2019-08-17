package requesthandler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type unauthorizedError struct {
	deniedAction string
}

func (e *unauthorizedError) Error() string {
	return fmt.Sprintf("not allowed to do: %v", e.deniedAction)
}

type noMatchesError struct {
	field string
	value string
}

func (e *noMatchesError) Error() string {
	return fmt.Sprintf("no matches for for field '%v' with value '%v'", e.field, e.value)
}

// LoginDetails contains the data needed for logging in
type LoginDetails struct {
	// these attributes have to start with an uppercase to be exported so the json decoder can use it
	// then the name of the json field has to be assigned
	Username string `json:"username"`
	Password string `json:"password"`
}

// creates a session for the user if the login details are correct
func createSession(details LoginDetails, client *mongo.Client) (string, error) {
	// get the persons collection
	collection := client.Database("roesena").Collection("persons")
	// filter for the person with the matching name
	filter := bson.M{"name": details.Username}
	// create a value into which the result can be decoded
	// map is used because its not known what fields this person has
	var result map[string]interface{}
	// find the person in the database
	res := collection.FindOne(context.TODO(), filter)
	// try to decode the result, if there were no matches this will create an error
	err := res.Decode(&result)
	if err != nil {
		return "", &noMatchesError{field: "name", value: details.Username}
	}
	// check if passwords match
	if checkPassword(details, result) {
		// password matches
		// generate uuid
		sessionToken := uuid.New()
		// get the string of the uuid
		sessionTokenString := sessionToken.String()
		// set the sessionId in the database
		updateResult, updateErr := collection.UpdateOne(context.TODO(), filter, bson.D{{"$set", bson.M{"sessionId": sessionTokenString}}})
		if updateErr != nil {
			// internal server error when accessing database
			return "", updateErr
		}
		if updateResult.MatchedCount == 0 {
			// no matches for given name
			return "", &noMatchesError{field: "name", value: details.Username}
		}
		// if session id is set in database return it
		return sessionTokenString, nil
	}
	return "", &unauthorizedError{deniedAction: "login with wrong password"}
}

func checkPassword(requestDetails LoginDetails, databaseEntry map[string]interface{}) bool {
	// check if password is a string
	if str, ok := databaseEntry["password"].(string); ok {
		// compare the password from the db with the password from the user input
		err := bcrypt.CompareHashAndPassword([]byte(str), []byte(requestDetails.Password))
		if err != nil {
			return false
		}
		return true
	}
	return false
}

// HandleLogin handles logins
func HandleLogin(w http.ResponseWriter, req *http.Request, client *mongo.Client) {
	// the response is always a json string
	w.Header().Set("Content-Type", "application/json")

	if req.Method == "POST" {
		// init the login details
		details := LoginDetails{}
		// try to read a Person from the request body
		err := json.NewDecoder(req.Body).Decode(&details)
		if err != nil {
			// request is bad if it's not a Person
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("body could not be read as sessionDetails type")})
			return
		}
		sessionID, sessErr := createSession(details, client)
		if sessErr != nil {
			switch sessErr.(type) {
			case *noMatchesError:
				w.WriteHeader(http.StatusNotFound)
				break
			case *unauthorizedError:
				w.WriteHeader(http.StatusUnauthorized)
				break
			default:
				w.WriteHeader(http.StatusInternalServerError)
			}
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("%v", sessErr.Error())})
			return
		}
		// set the cookie with the session id
		http.SetCookie(w, &http.Cookie{
			Name:  "session_token",
			Value: sessionID,
		})
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "authenticated"})
		return
	}
	// all unused HTTP methods arrive here
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(map[string]interface{}{"Error": "Use POST when trying to authenticate"})
}

func HandleRestore(w http.ResponseWriter, req *http.Request, client *mongo.Client) {
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
		// get the persons collection
		collection := client.Database("roesena").Collection("persons")
		// filter for the person with the matching sessionId
		filter := bson.M{"sessionId": cookie.Value}
		// create a value into which the result can be decoded
		// map is used because its not known what fields this person has
		var result map[string]interface{}
		// find the person in the database
		res := collection.FindOne(context.TODO(), filter)
		// try to decode the result, if there were no matches this will create an error
		err = res.Decode(&result)
		if err != nil {
			// no user has that cookie, so the cookie can be deleted from the http request
			// this is done by setting max age to -1
			http.SetCookie(w, &http.Cookie{
				Name:   "session_token",
				Value:  "",
				MaxAge: -1,
			})
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("cookie %v is outdated", cookie)})
			return
		}
		// arriving here means the session_id of the cookie was still valid
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{"username": result["name"]})
	}
}
