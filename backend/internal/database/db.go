package database

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

func InitDB(dbPath string) error {
	var err error
	DB, err = sql.Open("sqlite", dbPath)
	if err != nil {
		return err
	}

	createTableQuery := `
	CREATE TABLE IF NOT EXISTS results (
		id TEXT PRIMARY KEY,
		download REAL,
		upload REAL,
		ping REAL,
		jitter REAL,
		quality REAL,
		ip_address TEXT,
		isp_info TEXT,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	_, err = DB.Exec(createTableQuery)
	if err != nil {
		return err
	}

	log.Println("Database initialized successfully at", dbPath)
	return nil
}
