package db

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// the query element types will extend this type and be able to connect to and disconnect from the db easily
type dbClient struct{}

// connect connects to the MongoDB and returns the client
// close the connection after all requests are done!
func (dbClient) connect() *mongo.Client {
	// Set client options
	clientOptions := options.Client().ApplyURI("mongodb://mongo:27017")
	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		panic(err)
	}
	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		panic(err)
	}
	return client
}

func (dbClient) disconnect(client *mongo.Client) {
	client.Disconnect(context.TODO())
}

// QueryElement defines the interface for executing the querys which the types define
type QueryElement interface {
	Run() []map[string]interface{}
}
