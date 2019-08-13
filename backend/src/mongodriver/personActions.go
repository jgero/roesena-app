package mongodriver

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// AddPerson saves persons to the MongoDB
func AddPerson(person map[string]interface{}, client *mongo.Client) error {
	collection := client.Database("roesena").Collection("persons")
	// for now ignore the insert result element, the id of that element is not needed
	_, err := collection.InsertOne(context.TODO(), person)
	// just return the error if one occurs
	if err != nil {
		return err
	}
	return nil
}

// ReplacePerson replaces a person with the 'replaceName' with the given 'newPerson'
func ReplacePerson(replaceName string, newPerson map[string]interface{}, client *mongo.Client) error {
	collection := client.Database("roesena").Collection("persons")
	// create the filter to replace the element
	filter := bson.M{"name": replaceName}
	// replace the element
	_, err := collection.ReplaceOne(context.TODO(), filter, newPerson)
	if err != nil {
		return err
	}
	return nil
}

// GetPersonWithName returns the person with the provided name
func GetPersonWithName(name string, client *mongo.Client) ([]map[string]interface{}, error) {
	collection := client.Database("roesena").Collection("persons")
	// get the persons with the given name
	filter := bson.M{"name": name}
	// if no name is there, get all the persons
	if name == "" {
		filter = bson.M{}
	}
	// create a value into which the result can be decoded
	var result []map[string]interface{}
	res, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return []map[string]interface{}{}, err
	}
	err = res.All(context.TODO(), &result)
	if err != nil {
		return []map[string]interface{}{}, err
	}
	return result, nil
}

// DeletePersonWithName deletes the person with a specific name
func DeletePersonWithName(name string, client *mongo.Client) error {
	collection := client.Database("roesena").Collection("persons")
	// create a filter that matches the given name
	filter := bson.M{"name": name}
	// delete ONE element in the collection
	_, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return err
	}
	return nil
}
