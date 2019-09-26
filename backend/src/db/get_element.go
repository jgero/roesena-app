package db

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo/options"
)

// GetElement collects all the needed fields to insert an element into the database
type GetElement struct {
	// the name of the collection on the database
	Collection string
	// the filter for searching the elements, the autority group check has to be already in this filter!!
	Filter interface{}
	// the fields that should be returned
	Projection interface{}
	// "extend" the client type
	dbClient
	// "extend" the responder type
	HTTPResponder
}

// Run then executes the query on the database, including the authority check
func (elem *GetElement) Run() []map[string]interface{} {
	// get the collection that is specified in the struct
	client := elem.connect()
	collection := client.Database("roesena").Collection(elem.Collection)
	// find all the elements that match this filter
	res, err := collection.Find(context.TODO(), elem.Filter, options.Find().SetProjection(elem.Projection))
	// return the original error and empty []map
	if err != nil {
		elem.disconnect(client)
		elem.HTTPResponder.respondError(err)
		return nil
	}
	// try to parse the result
	var result []map[string]interface{}
	err = res.All(context.TODO(), &result)
	// return the original error and empty []map
	if err != nil {
		elem.disconnect(client)
		elem.HTTPResponder.respondError(err)
		return nil
	}
	if len(result) == 0 {
		// respod with error when nothing matched
		elem.disconnect(client)
		elem.HTTPResponder.respondError(&NoMatchesError{Collection: elem.Collection})
		return nil
	}
	elem.disconnect(client)
	return result
}
