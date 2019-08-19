package db

import (
	"context"
)

// UpdateOneElement collects all the needed fields to replace an element into the database
type UpdateOneElement struct {
	// the name of the collection on the database
	Collection string
	// the data with which the filter target should be replaced with
	Element interface{}
	// the filter for searching the elements, the autority group check has to be already in this filter!!
	Filter interface{}
	// session id to check if the user is allowed to do this action
	Session string
	// setting this will ignore authentication
	IgnoreSession bool
	// "extend" the client type
	dbClient
	// "extend" the responder type
	HTTPResponder
}

// Run then executes the query on the database, including the authority check
func (elem *UpdateOneElement) Run() []map[string]interface{} {
	client := elem.connect()
	collection := client.Database("roesena").Collection(elem.Collection)
	auth := 4
	// auth, err := getAuthority(elem.Session, client)
	// if err != nil {
	// 	elem.disconnect(client)
	// 	elem.HTTPResponder.respondError(err)
	// 	return nil
	// }
	// TODO: do some actual checkin, not just set it to 4
	if elem.IgnoreSession || auth >= 4 {
		res, er := collection.UpdateOne(context.TODO(), elem.Filter, elem.Element)
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
		return []map[string]interface{}{{"mod": res.ModifiedCount}}
	}
	elem.disconnect(client)
	elem.respondError(&UnauthorizedError{DeniedAction: "inserting element"})
	return nil
}
