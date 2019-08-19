package requesthandler

import (
	"db"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"go.mongodb.org/mongo-driver/bson"
)

// UpgradeUser adds an encrypted password to an already existing person in the database
func UpgradeUser(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if req.Method == "POST" {
		// try to read the login details from the request body
		var details map[string]interface{}
		err := json.NewDecoder(req.Body).Decode(&details)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("body could not be read")})
			return
		}
		// try to encrypt the password
		encpw, encerr := createPassword(details["password"])
		if encerr != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("password is no string")})
			return
		}
		responder := db.HTTPResponder{W: w}
		qElem := db.UpdateOneElement{
			Collection:    "persons",
			Element:       bson.D{{"$set", bson.M{"password": encpw}}},
			Filter:        bson.M{"name": details["username"]},
			IgnoreSession: true,
			HTTPResponder: responder,
		}
		res := qElem.Run()
		if res == nil {
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "password changed"})
		return
	}
	// request was not a POST...
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(map[string]interface{}{"Error": "Use POST when trying to authenticate"})
}

// encrypts the password
func createPassword(pw interface{}) (string, error) {
	if pws, ok := pw.(string); ok {
		hash, err := bcrypt.GenerateFromPassword([]byte(pws), bcrypt.MinCost)
		if err != nil {
			return "", err
		}
		return string(hash), nil
	}
	return "", errors.New("details is no string")
}
