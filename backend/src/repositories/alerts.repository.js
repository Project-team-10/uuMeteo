const db = require("../db-setup");

module.exports.getAllAlerts = () => {
    return new Promise((resolve, reject) => {
        db.all(`
        SELECT 
          device_id, 
          upper_limit, 
          lower_limit, 
          triggered_at
        FROM alerts
      `, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

module.exports.createAlert = function (device_id, upper_limit, lower_limit) {
    if (!device_id) {
        return Promise.reject(new Error('Device ID is required to create an alert.'));
    }

    return new Promise((resolve, reject) => {
        const stmt = db.prepare(
            `INSERT INTO alerts (device_id, upper_limit, lower_limit, triggered_at) VALUES (?, ?, ?, NULL)`
        );
        stmt.run(device_id, upper_limit, lower_limit, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

module.exports.clearAlertTrigger = function (device_id) {
    const stmt = db.prepare(`UPDATE alerts SET triggered_at = NULL WHERE device_id = ?`);
    stmt.run(device_id);
};

module.exports.deleteAlert = function (device_id) {
    const stmt = db.prepare(`DELETE FROM alerts WHERE device_id = ?`);
    stmt.run(device_id);
};

module.exports.updateAlertTrigger = function (device_id, triggeredAt) {
    const stmt = db.prepare(`UPDATE alerts SET triggered_at = ? WHERE device_id = ?`);
    stmt.run(triggeredAt, device_id);
};

module.exports.clearAlertTrigger = function (device_id) {
    const stmt = db.prepare(`UPDATE alerts SET triggered_at = NULL WHERE device_id = ?`);
    stmt.run(device_id);
};