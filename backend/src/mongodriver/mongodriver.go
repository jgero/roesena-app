package mongodriver

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Person is the structure for requests to /api/person
type Person struct {
	Name string
}

// Appointment is the structure for requests to /api/appointments
type Appointment struct {
	start       DateAndTime
	end         DateAndTime
	description string
}

// DateAndTime stores a Date and a Timestamp in one struct
type DateAndTime struct {
	date Date
	time string
}

// Date contains attributes for day, month and year
type Date struct {
	day   string
	month string
	year  string
}

// Connect connects to the MongoDB and returns the client
func Connect() (*mongo.Client, error) {
	// Set client options
	clientOptions := options.Client().ApplyURI("mongodb://mongo:27017")
	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		return nil, err
	}
	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		return nil, err
	}
	return client, nil
}

// AddPerson saves persons to the MongoDB
func AddPerson(person Person, client *mongo.Client) error {
	collection := client.Database("test").Collection("persons")
	// for now ignore the insert result element, the id of that element is not needed
	_, err := collection.InsertOne(context.TODO(), person)
	// just return the error if one occurs
	if err != nil {
		return err
	}
	return nil
}

// GetPersonWithName returns the person with the provided name
func GetPersonWithName(name string, client *mongo.Client) ([]Person, error) {
	collection := client.Database("test").Collection("persons")
	// get the persons with the given name
	filter := bson.M{"name": name}
	// if no name is there, get all the persons
	if name == "" {
		filter = bson.M{}
	}
	// create a value into which the result can be decoded
	var result []Person
	res, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return []Person{}, err
	}
	err = res.All(context.TODO(), &result)
	if err != nil {
		return []Person{}, err
	}
	return result, nil
}

// DeletePersonWithName deletes the person with a specific name
func DeletePersonWithName(name string, client *mongo.Client) error {
	collection := client.Database("test").Collection("persons")
	// create a filter that matches the given name
	filter := bson.M{"name": name}
	// delete ONE element in the collection
	_, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return err
	}
	return nil
}
