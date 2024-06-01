const db = require("../db-setup");
const { randomUUID, randomBytes } = require("crypto");

module.exports.getAllDevices = function () {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM devices", (err, rows) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports.registerDevice = function (name) {
  const deviceId = randomUUID();
  const deviceSecretKey = randomBytes(32).toString("hex");
  const stmt = db.prepare(
    `INSERT INTO devices (deviceId, name, secretKey) VALUES (?, ?, ?)`
  );
  stmt.run(deviceId, name, deviceSecretKey);

  return {
    deviceId,
    name,
    deviceSecretKey,
  };
};

module.exports.deleteDevice = function (deviceId) {
  const deleteFromTemperatures = db.prepare(
    `DELETE FROM temperatures WHERE deviceId = ?`
  );
  deleteFromTemperatures.run(deviceId);
  const deleteFromAlerts = db.prepare(`DELETE FROM alerts WHERE device_id = ?`);
  deleteFromAlerts.run(deviceId);
  const deleteDevice = db.prepare(`DELETE FROM devices WHERE deviceId = ?`);
  deleteDevice.run(deviceId);
};

module.exports.getDeviceBySecretKey = function (secretKey) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`SELECT * FROM devices WHERE secretKey = ?`);
    stmt.get(secretKey, (err, row) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};
