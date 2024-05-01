const db = require("../db-setup");

module.exports.getAllAlerts = function () {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT 
        deviceId, 
        upperLimit, 
        lowerLimit, 
        triggered_at
      FROM alerts`,
            (err, rows) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        );
    });
};

module.exports.createAlert = function (deviceId, upperLimit, lowerLimit) {
    const stmt = db.prepare(
        `INSERT INTO alerts (deviceId, upperLimit, lowerLimit, triggered_at) VALUES (?, ?, ?, NULL)`
    );
    stmt.run(deviceId, upperLimit, lowerLimit);
};

module.exports.clearAlertTrigger = function (deviceId) {
    const stmt = db.prepare(`UPDATE alerts SET triggered_at = NULL WHERE deviceId = ?`);
    stmt.run(deviceId);
};

module.exports.deleteAlert = function (deviceId) {
    const stmt = db.prepare(`DELETE FROM alerts WHERE deviceId = ?`);
    stmt.run(deviceId);
};

module.exports.updateAlertTrigger = function (deviceId, triggeredAt) {
    const stmt = db.prepare(`UPDATE alerts SET triggered_at = ? WHERE deviceId = ?`);
    stmt.run(triggeredAt, deviceId);
};

module.exports.clearAlertTrigger = function (deviceId) {
    const stmt = db.prepare(`UPDATE alerts SET triggered_at = NULL WHERE deviceId = ?`);
    stmt.run(deviceId);
};
