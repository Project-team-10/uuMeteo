require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { checkAndUpdateAlerts } = require("./src/services/alerts.service");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.FE_URL,
    exposedHeaders: ["Set-cookie"],
  })
); // Enable CORS for all routes

// use JSONs
app.use(express.json({limit: '50mb'}));

// for url encoded content type
app.use(express.urlencoded({ extended: true }));

// Session support for passport.js
var session = require("express-session");
var SQLiteStore = require("connect-sqlite3")(session);
var passport = require("passport");
const { registerUser } = require("./src/services/auth.service");
const { findUserByUsername } = require("./src/repositories/auth.repository");
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./db" }),
    cookie: { sameSite: "none", secure: true },
  })
);
app.use(passport.authenticate("session"));

app.use("/devices", require("./src/controllers/device.controller"));
app.use("/temperatures", require("./src/controllers/temperature.controller"));
app.use("/me", require("./src/controllers/me.controller"));
app.use("/", require("./src/controllers/auth.controller"));
app.use("/alerts", require("./src/controllers/alerts.controller"));

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);

  if (findUserByUsername(process.env.USERNAME)) {
    console.log("Default user already exists.");
  } else {
    registerUser(process.env.USERNAME, process.env.PASSWORD);
  }

  // Schedule the alert check job to run every minute
  setInterval(checkAndUpdateAlerts, 60000);
});
