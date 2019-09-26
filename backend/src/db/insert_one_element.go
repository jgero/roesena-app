package db

import (
	"context"
	"encoding/json"
	"errors"
	"io"
)

// InsertOneElement collects all the needed fields to insert an element into the database
type InsertOneElement struct {
	// the name of the collection on the database
	Collection string
	// the element that should be inserted
	Element io.ReadCloser
	// session id to check if the user is allowed to do this action
	Session string
	// "extend" the client type
	dbClient
	// "extend" the responder type
	HTTPResponder
}

// Run then executes the query on the database, including the authority check
func (elem *InsertOneElement) Run() []map[string]interface{} {
	client := elem.connect()
	collection := client.Database("roesena").Collection(elem.Collection)
	auth, err := getAuthority(elem.Session, client)
	if err != nil {
		elem.disconnect(client)
		elem.HTTPResponder.respondError(err)
		return nil
	}
	// TODO: do some actual checkin, not just set it to 4
	if auth >= 4 {
		// if true {
		var insertEl interface{}
		err := json.NewDecoder(elem.Element).Decode(&insertEl)
		if err != nil {
			elem.disconnect(client)
			elem.HTTPResponder.respondError(err)
			return nil
		}
		// insert one result is just the id, so not necessary to check it
		res, er := collection.InsertOne(context.TODO(), insertEl)
		if er != nil {
			elem.disconnect(client)
			elem.HTTPResponder.respondError(err)
			return nil
		}
		if res.InsertedID == nil {
			elem.disconnect(client)
			elem.HTTPResponder.respondError(errors.New("noting was inserted"))
			return nil
		}
		elem.disconnect(client)
		return []map[string]interface{}{{"id": res.InsertedID}}
	}
	elem.disconnect(client)
	elem.respondError(&UnauthorizedError{DeniedAction: "inserting element"})
	return nil
}
