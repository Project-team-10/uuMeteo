const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Connect to a SQLite database.
let dbPath = path.resolve(process.cwd(), "database.sqlite");
let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Connected to the SQLite database.");
});

// enable foreign key support
db.run("PRAGMA foreign_keys = ON", handleErrorCallback);

db.run(
  "CREATE TABLE IF NOT EXISTS devices(deviceId TEXT PRIMARY KEY, name TEXT, secretKey TEXT)",
  handleErrorCallback
);

db.run(
  "CREATE TABLE IF NOT EXISTS temperatures(value NUMBER, deviceId TEXT NOT NULL, time TEXT, FOREIGN KEY(deviceId) REFERENCES devices(deviceId))",
  handleErrorCallback
);

db.run(
  "CREATE TABLE IF NOT EXISTS users(userId TEXT PRIMARY KEY, username TEXT, password TEXT)",
  handleErrorCallback
);
db.run(
  "CREATE UNIQUE INDEX IF NOT EXISTS idx_username ON users(username)",
  handleErrorCallback
);

function handleErrorCallback(err) {
  if (err) {
    return console.error(err);
  }
}

module.exports = db;
