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
	http.HandleFunc("/api/login", func(w http.ResponseWriter, req *http.Request) {
		requesthandler.HandleLogin(w, req, client)
	})
	http.HandleFunc("/api/upgradeUser", func(w http.ResponseWriter, req *http.Request) {
		requesthandler.HandleNewUser(w, req, client)
	})
	http.HandleFunc("/api/restore", func(w http.ResponseWriter, req *http.Request) {
		requesthandler.HandleRestore(w, req, client)
	})
	http.ListenAndServe(":8080", nil)
}
