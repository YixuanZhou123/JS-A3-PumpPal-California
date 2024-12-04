#!/usr/bin/env bash

# Create a new database if one doesn't exist
sqlite3 db.sqlite3 "
  CREATE TABLE IF NOT EXISTS saved-markers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL,
    longitude REAL,
  );
"
