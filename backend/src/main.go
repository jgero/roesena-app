package main

import (
	"fmt"
	"mongodriver"
	"net/http"
	"requesthandler"
)

func main() {
	client, err := mongodriver.Connect()
	if err != nil {
		fmt.Println(err)
	}
	http.HandleFunc("/api/person/", func(w http.ResponseWriter, req *http.Request) {
		requesthandler.HandlePerson(w, req, client)
	})
	http.ListenAndServe(":8080", nil)
}
