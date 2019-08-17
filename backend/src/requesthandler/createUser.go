package requesthandler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"golang.org/x/crypto/bcrypt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// adds the encrypted password to the user in the database
// can also be used for updating and changing an existing password
func setPassword(details LoginDetails, client *mongo.Client) error {
	// encrypt the password
	hash, err := bcrypt.GenerateFromPassword([]byte(details.Password), bcrypt.MinCost)
	if err != nil {
		return err
	}
	// get the persons collection
	collection := client.Database("roesena").Collection("persons")
	// filter for the person with the matching name
	filter := bson.M{"name": details.Username}
	// set the password of the person that matches
	_, err = collection.UpdateOne(context.TODO(), filter, bson.D{{"$set", bson.M{"password": string(hash)}}})
	if err != nil {
		return err
	}
	// TODO: check the update results if something actually got changed
	return nil
}

// HandleNewUser upgrades a person to a user with password
func HandleNewUser(w http.ResponseWriter, req *http.Request, client *mongo.Client) {
	// the response is always a json string
	w.Header().Set("Content-Type", "application/json")

	if req.Method == "POST" {
		// init the login details
		details := LoginDetails{}
		// try to read the LoginDetails from the request body
		err := json.NewDecoder(req.Body).Decode(&details)
		if err != nil {
			// json is broken
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("body could not be read")})
			return
		}
		// set the password with the provided data
		err = setPassword(details, client)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("%v", err)})
			return
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "password set"})
		return
	} else {
		// request was not a POST...
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"Error": "Use POST when trying to authenticate"})
	}
}
