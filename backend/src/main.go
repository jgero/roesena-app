package main

import (
	"net/http"
	"requesthandler"
)

func main() {
	http.HandleFunc("/api/person/", requesthandler.HandlePerson)
	http.HandleFunc("/api/login", requesthandler.CreateSession)
	http.HandleFunc("/api/logout/", requesthandler.CloseSession)
	http.HandleFunc("/api/restore", requesthandler.RestoreSession)
	http.HandleFunc("/api/upgradeUser", requesthandler.UpgradeUser)
	http.HandleFunc("/api/event", requesthandler.HandleEvent)
	http.ListenAndServe(":8080", nil)
}
