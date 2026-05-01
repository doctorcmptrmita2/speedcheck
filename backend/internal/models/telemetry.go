package models

type TelemetryResult struct {
	ID        string  `json:"id"`
	Download  float64 `json:"download"`
	Upload    float64 `json:"upload"`
	Ping      float64 `json:"ping"`
	Jitter    float64 `json:"jitter"`
	Quality   float64 `json:"quality"`
	IPAddress string  `json:"ip_address,omitempty"`
	ISPInfo   string  `json:"isp_info,omitempty"`
	Timestamp string  `json:"timestamp,omitempty"`
}
