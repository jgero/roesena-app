package requesthandler

import (
	"db"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
)

// HandleEvent return all the events that match the given route parameters
func HandleEvent(w http.ResponseWriter, req *http.Request) {
	// the response is always a json string
	w.Header().Set("Content-Type", "application/json")
	// take URL like: (/api/event) and split it
	p := strings.Split(req.URL.Path, "/")
	// get some request parameters
	start, isStart := req.URL.Query()["start"]
	end, isEnd := req.URL.Query()["end"]
	if len(p) == 3 && isStart && isEnd && req.Method == "GET" {
		// convert all the start parts to ints
		startDate, syok := strconv.Atoi(start[0])
		// convert all the end parts to ints
		endDate, eyok := strconv.Atoi(end[0])
		if syok != nil || eyok != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"Error": "bad time parameters"})
			return
		}
		responder := db.HTTPResponder{W: w}
		qElem := db.GetElement{
			Collection: "events",
			// start date or end date have to be in the timeframe
			Filter: bson.M{
				"$and": bson.A{
					// startDate is in the filter timespan
					bson.M{
						"startDate": bson.M{
							"$lte": endDate,
						},
					},
					bson.M{
						"endDate": bson.M{
							"$gte": startDate,
						},
					},
				},
			},
			HTTPResponder: responder,
		}
		res := qElem.Run()
		if res == nil {
			return
		}
		json.NewEncoder(w).Encode(res)
		return
	}
	// bad request
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(map[string]string{"Error": "too many route sub paths"})
}
