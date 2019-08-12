package mongodriver

import (
	"context"
	"errors"
	"fmt"

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
		return nil, errors.New(("connection to database failed"))
	}
	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		return nil, errors.New(("ping to database failed"))
	}
	return client, nil
}

// AddPersons saves persons to the MongoDB
func AddPersons(persons []interface{}, client *mongo.Client) error {
	collection := client.Database("test").Collection("persons")
	insertResult, err := collection.InsertMany(context.TODO(), persons)
	if err != nil {
		return errors.New("could not add to collection")
	}
	fmt.Println(insertResult)
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

// trainers := []interface{}{misty, brock}

// insertManyResult, err := collection.InsertMany(context.TODO(), trainers)
// if err != nil {
// 	log.Fatal(err)
// }

// fmt.Println("Inserted multiple documents: ", insertManyResult.InsertedIDs)

// err = client.Disconnect(context.TODO())

// if err != nil {
// 	log.Fatal(err)
// }
// fmt.Println("Connection to MongoDB closed.")

// }
