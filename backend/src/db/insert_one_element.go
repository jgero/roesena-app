package db

import (
	"context"
)

// InsertOneElement collects all the needed fields to insert an element into the database
type InsertOneElement struct {
	// the name of the collection on the database
	Collection string
	// the element that should be inserted
	Element interface{}
	// session id to check if the user is allowed to do this action
	Session string
	// "extend" the client type
	dbClient
}

// Run then executes the query on the database, including the authority check
func (elem *InsertOneElement) Run() error {
	client := elem.connect()
	collection := client.Database("roesena").Collection(elem.Collection)
	auth, err := getAuthority(elem.Session, client)
	if err != nil {
		elem.disconnect(client)
		return err
	}
	if auth >= 4 {
		_, err = collection.InsertOne(context.TODO(), elem.Element)
		if err != nil {
			elem.disconnect(client)
			return err
		}
		elem.disconnect(client)
		return nil
	}
	elem.disconnect(client)
	return &UnauthorizedError{DeniedAction: "inserting element"}
}
