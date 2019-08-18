package db

import (
	"context"
)

// GetElement collects all the needed fields to insert an element into the database
type GetElement struct {
	// the name of the collection on the database
	Collection string
	// the filter for searching the elements, the autority group check has to be already in this filter!!
	Filter interface{}
	// "extend" the client type
	dbClient
}

// Run then executes the query on the database, including the authority check
func (elem *GetElement) Run() ([]map[string]interface{}, error) {
	// get the collection that is specified in the struct
	client := elem.connect()
	collection := client.Database("roesena").Collection(elem.Collection)
	// find all the elements that match this filter
	res, err := collection.Find(context.TODO(), elem.Filter)
	// return the original error and empty []map
	if err != nil {
		elem.disconnect(client)
		return []map[string]interface{}{}, err
	}
	// try to parse the result
	var result []map[string]interface{}
	err = res.All(context.TODO(), &result)
	// return the original error and empty []map
	if err != nil {
		elem.disconnect(client)
		return []map[string]interface{}{}, err
	}
	elem.disconnect(client)
	return result, nil
}
