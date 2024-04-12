const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to a SQLite database.
let dbPath = path.resolve(__dirname, "temperatures.db");
let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQLite database.");
});

// Create table.
db.run(
  "CREATE TABLE IF NOT EXISTS temperatures(value NUMBER, deviceId TEXT, time TEXT)",
  (err) => {
    if (err) {
      return console.error(err.message);
    }
  }
);

// GET all temperatures.
app.get("/temperatures", (req, res) => {
  db.all("SELECT * FROM temperatures", [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// POST add a new temperature.
app.post("/temperatures", (req, res) => {
  const value = req.body.value;
  const deviceId = req.body.deviceId;
  const time = new Date().toLocaleString();
  db.run(
    `INSERT INTO temperatures(value, deviceId, time) VALUES(?, ?, ?)`,
    [value, deviceId, time],
    function (err) {
      if (err) {
        return console.log(err.message);
      }
      res.json({ id: this.lastID });
    }
  );
});

// DELETE delete all temperatures.
app.delete("/temperatures", (req, res) => {
  db.run("DELETE FROM temperatures", [], function (err) {
    if (err) {
      return console.log(err.message);
    }
    res.json({ deletedRows: this.changes });
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
