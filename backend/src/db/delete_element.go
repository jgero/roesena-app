package db

import (
	"context"
)

// DeleteOneElement collects all the needed fields to insert an element into the database
type DeleteOneElement struct {
	// the name of the collection on the database
	Collection string
	// the filter for the element to delete
	Filter interface{}
	// session id to check if the user is allowed to do this action
	Session string
	// "extend" the client type
	dbClient
	// "extend" the responder type
	HTTPResponder
}

// Run then executes the query on the database, including the authority check
func (elem *DeleteOneElement) Run() []map[string]interface{} {
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
		res, er := collection.DeleteOne(context.TODO(), elem.Filter)
		if er != nil {
			elem.disconnect(client)
			elem.HTTPResponder.respondError(err)
			return nil
		}
		if res.DeletedCount == 0 {
			elem.disconnect(client)
			elem.HTTPResponder.respondError(&NoMatchesError{Collection: elem.Collection})
			return nil
		}
		elem.disconnect(client)
		return []map[string]interface{}{{"delCount": res.DeletedCount}}
	}
	elem.disconnect(client)
	elem.respondError(&UnauthorizedError{DeniedAction: "inserting element"})
	return nil
}
