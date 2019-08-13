package requesthandler

import (
	"encoding/json"
	"fmt"
	"mongodriver"
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/mongo"
)

// HandlePerson acts on all http requests concerning persons
func HandlePerson(w http.ResponseWriter, req *http.Request, client *mongo.Client) {
	// the response is always a json string
	w.Header().Set("Content-Type", "application/json")
	switch req.Method {
	case "GET":
		handleGet(w, req, client)
		break
	case "POST":
		handlePost(w, req, client)
		break
	case "DELETE":
		handleDelete(w, req, client)
		break
	case "PUT":
		handlePut(w, req, client)
		break
	default:
		// all unused HTTP methods arrive here
		w.WriteHeader(http.StatusNotImplemented)
		json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("unused HTTP method:  %v", req.Method)})
		w.Write([]byte("{\"error\": \"unused HTTP method\"}"))
	}
}

func handleGet(w http.ResponseWriter, req *http.Request, client *mongo.Client) {
	// take URL like: (/api/person/john) and split it
	p := strings.Split(req.URL.Path, "/")
	// if the URL has a trailing "/" the length is 4 and the route is valid
	switch len(p) {
	case 4:
		// get the persons with a given name, also works with the empty name
		person, err := mongodriver.GetPersonWithName(p[3], client)
		if err != nil {
			// respond with 500 when error in database happens
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("error when reading %v from databse", p[3])})
			return
		}
		if len(person) == 0 {
			// return 404 if there were no persons
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("no person found with name %v", p[3])})
			return
		}
		// send person, the status code 200 will be set automatically
		json.NewEncoder(w).Encode(person)
		return
	case 3:
	case 2:
	case 1:
	case 0:
		// these path part lengths are too short, that means a wrong route was passed somewhere internally
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("faulty URI in person handler: %v", req.URL.Path)})
		return
	default:
		// this is the more likely error case: here the route has too many parts
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("faulty URI path provided: %v", req.URL.Path)})
		return
	}
}

func handlePost(w http.ResponseWriter, req *http.Request, client *mongo.Client) {
	p := strings.Split(req.URL.Path, "/")
	// check if there is nothing after the "/" after "person"
	if (len(p) == 4) && (p[3] == "") {
		var person map[string]interface{}
		// try to read a Person from the request body
		err := json.NewDecoder(req.Body).Decode(&person)
		if err != nil {
			// request is bad if it's not a Person
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("body could not be read as Person type")})
			return
		}
		err = mongodriver.AddPerson(person, client)
		if err != nil {
			// internal error when adding person fails
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("error when reading %v from databse", p[3])})
			return
		}
		// no errors, just return the body again
		json.NewEncoder(w).Encode(person)
		return
	}
	// bad request, there are too many subPaths or a name provided
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(map[string]interface{}{"Error": "URI does not match a POST to /api/person/"})
	return
}

func handlePut(w http.ResponseWriter, req *http.Request, client *mongo.Client) {
	p := strings.Split(req.URL.Path, "/")
	if (len(p) == 4) && (p[3] != "") {
		var newPerson map[string]interface{}
		err := json.NewDecoder(req.Body).Decode(&newPerson)
		if err != nil {
			// bad request when decoding json fails
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": "body is not readable json"})
			return
		}
		err = mongodriver.ReplacePerson(p[3], newPerson, client)
		if err != nil {
			// internal error when replacing person fails
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("error when replacing %v in databse", p[3])})
			return
		}
		// the element was replaced
		json.NewEncoder(w).Encode(map[string]interface{}{"status": fmt.Sprintf("person %v was replaced", p[3])})
		return
	}
	// bad request, there are too many subPaths or no name is provided
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("URI does not match a PUT to /api/person/name")})
	return
}

func handleDelete(w http.ResponseWriter, req *http.Request, client *mongo.Client) {
	p := strings.Split(req.URL.Path, "/")
	if (len(p) == 4) && (p[3] != "") {
		err := mongodriver.DeletePersonWithName(p[3], client)
		if err != nil {
			// internal error when deleting person fails
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("error when deleting %v from databse", p[3])})
			return
		}
		// the element was deleted
		json.NewEncoder(w).Encode(map[string]interface{}{"status": fmt.Sprintf("person %v was deleted", p[3])})
		return
	}
	// bad request, there are too many subPaths or no name is provided
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(map[string]interface{}{"Error": fmt.Sprintf("URI does not match a DELETE to /api/person/name")})
	return
}
