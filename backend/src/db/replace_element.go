package db

import (
	"context"
	"encoding/json"
	"io"
)

// ReplaceOneElement collects all the needed fields to replace an element into the database
type ReplaceOneElement struct {
	// the name of the collection on the database
	Collection string
	// the data with which the filter target should be replaced with
	Element io.ReadCloser
	// the filter for searching the elements, the autority group check has to be already in this filter!!
	Filter interface{}
	// session id to check if the user is allowed to do this action
	Session string
	// "extend" the client type
	dbClient
	// "extend" the responder type
	HTTPResponder
}

// Run then executes the query on the database, including the authority check
func (elem *ReplaceOneElement) Run() []map[string]interface{} {
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
		var insertEl map[string]interface{}
		err = json.NewDecoder(elem.Element).Decode(&insertEl)
		if err != nil {
			elem.disconnect(client)
			elem.HTTPResponder.respondError(err)
			return nil
		}
		// insert one result is just the id, so not necessary to check it
		res, er := collection.ReplaceOne(context.TODO(), elem.Filter, insertEl)
		if er != nil {
			elem.disconnect(client)
			elem.HTTPResponder.respondError(er)
			return nil
		}
		if res.ModifiedCount == 0 {
			elem.disconnect(client)
			elem.HTTPResponder.respondError(&NoMatchesError{Collection: elem.Collection})
			return nil
		}
		elem.disconnect(client)
		return []map[string]interface{}{insertEl}
	}
	elem.disconnect(client)
	elem.respondError(&UnauthorizedError{DeniedAction: "inserting element"})
	return nil
}
