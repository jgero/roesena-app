package requesthandler

import (
	"db"
	"encoding/json"
	"net/http"
	"strings"
	"time"

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
		startTime, serr := time.Parse(time.RFC3339, start[0])
		endTime, eerr := time.Parse(time.RFC3339, end[0])
		if serr != nil || eerr != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"Error": "bad time parameters"})
			return
		}
		responder := db.HTTPResponder{W: w}
		qElem := db.GetElement{
			Collection: "events",
			// start date or end date have to be in the timeframe
			Filter: bson.M{
				"$or": bson.A{bson.M{
					"$and": bson.A{bson.M{
						"startDate": bson.M{
							"$gte": startTime,
						},
					},
						bson.M{
							"startDate": bson.M{
								"$lte": endTime,
							},
						}},
				},
					bson.M{
						"$and": bson.A{bson.M{
							"endDate": bson.M{
								"$gte": startTime,
							},
						}, bson.M{
							"endDate": bson.M{
								"$lte": endTime,
							},
						}},
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
