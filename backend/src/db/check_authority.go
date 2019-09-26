package db

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func getAuthority(sessionID string, client *mongo.Client) (int, error) {
	collection := client.Database("roesena").Collection("persons")
	filter := bson.M{"sessionId": sessionID}
	res, err := collection.Find(context.TODO(), filter)
	// error when requesting on db
	if err != nil {
		return 0, err
	}
	// try to parse the result
	var result []map[string]interface{}
	err = res.All(context.TODO(), &result)
	// return the original error and empty []map
	if err != nil {
		return 0, err
	}
	// respod with error when nothing matched
	if len(result) == 0 {
		return 0, err
	}
	authLvl := int(result[0]["authorityLevel"].(float64))
	return authLvl, nil
}
