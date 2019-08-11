package main

import (
	"fmt"
	"mongodriver"
	"net/http"

	"go.mongodb.org/mongo-driver/mongo"
)

func main() {
	client, err := mongodriver.Connect()
	if err != nil {
		fmt.Println(err)
	}
	http.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		handleIndex(w, req, client)
	})
	http.ListenAndServe(":8080", nil)

}

func handleIndex(w http.ResponseWriter, req *http.Request, client *mongo.Client) {
	// w.Header().Add("content-type", "application/json")
	// w.WriteHeader(500)
	// w.Write([]byte(fmt.Sprintf("{\"error\": \"nothing defined\"}")))
	err := mongodriver.AddPersons(
		[]interface{}{mongodriver.Person{Name: "Ash"}, mongodriver.Person{Name: "Misty"}, mongodriver.Person{Name: "Brock"}}, client)
	if err != nil {
		fmt.Println("saving failed")
	}
	person, err := mongodriver.GetPersonWithName("ash", client)
	if err != nil {
		fmt.Println("searching failed")
	}
	fmt.Println(person)
	w.Write([]byte(fmt.Sprintf("test")))
}
