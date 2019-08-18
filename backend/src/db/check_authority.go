package db

import (
	"context"

	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func getAuthority(sessionId string, client *mongo.Client) (int, error) {
	collection := client.Database("roesena").Collection("persons")
	filter := bson.M{"sessionId": sessionId}
	res := collection.FindOne(context.TODO(), filter)
	var result map[string]interface{}
	decodeerr := res.Decode(&result)
	if decodeerr != nil {
		return -1, decodeerr
	}
	authGrp, ok := result["authorityGroup"].(int)
	if !ok {
		return -1, errors.New("authorityGroup is not an int")
	}
	return authGrp, nil
}
