package handlers

import (
	"encoding/json"
	"net/http"
)

type ServerNode struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Location string `json:"location"`
	URL      string `json:"url"` // Empty implies current origin
	Sponsor  string `json:"sponsor"`
}

func ServersHandler(w http.ResponseWriter, r *http.Request) {
	// Future-proofing for multi-server logic.
	// Returns a single default node for now.
	servers := []ServerNode{
		{
			ID:       "default",
			Name:     "Primary Edge Node",
			Location: "Global (Auto-routed)",
			URL:      "", // Frontend handles this
			Sponsor:  "SpeedCheck.DEV",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(servers)
}
