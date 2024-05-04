const db = require("../db-setup");

module.exports.getAllAlerts = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `
        SELECT 
          id,
          device_id, 
          upper_limit, 
          lower_limit, 
          triggered_at
        FROM alerts
      `,
      (err, rows) => {
        if (err) {
          console.error("Error fetching alerts:", err);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

module.exports.createAlert = async function (deviceId, upperLimit, lowerLimit) {
  if (!deviceId || typeof deviceId !== "string") {
    console.error(
      "Device ID is required to create an alert and must be a string."
    );
    throw new Error(
      "Device ID is required to create an alert and must be a string."
    );
  }

  try {
    const stmt = db.prepare(
      `INSERT INTO alerts (device_id, upper_limit, lower_limit, triggered_at) VALUES (?, ?, ?, NULL)`
    );
    await stmt.run(deviceId, upperLimit, lowerLimit);
    console.log("Alert created successfully.");
  } catch (error) {
    console.error("Error creating alert:", error);
    throw error;
  }
};

module.exports.clearAlertTrigger = function (alertId) {
  const stmt = db.prepare(`UPDATE alerts SET triggered_at = NULL WHERE id = ?`);
  stmt.run(alertId);
};

module.exports.deleteAlert = function (id) {
  const stmt = db.prepare(`DELETE FROM alerts WHERE id = ?`);
  stmt.run(id);
};

module.exports.updateAlertTrigger = function (alertId, triggeredAt) {
  const stmt = db.prepare(`UPDATE alerts SET triggered_at = ? WHERE id = ?`);
  stmt.run(triggeredAt, alertId);
};
