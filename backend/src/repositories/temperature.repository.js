const db = require("../db-setup");
const { parse } = require("date-fns");

module.exports.getTemperaturesForDevice = function (deviceId, time) {
  const stmt = db.prepare(`
    SELECT * 
    FROM temperatures
    WHERE deviceId = ?
    AND time >= strftime('%Y-%m-%d %H:%M:%S', 'now', '${time}')
    ORDER BY time DESC
  `);

  return new Promise((resolve, reject) => {
    stmt.all(deviceId, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports.getLatestTemperature = async function (deviceId) {
  const stmt = db.prepare(`
    SELECT value
    FROM temperatures
    WHERE deviceId = ?
    ORDER BY time DESC
    LIMIT 1
  `);

  const result = await stmt.get(deviceId);
  return result ? result.value : null;
};

module.exports.getLastTemperatures = function () {
  const stmt =
    db.prepare(`SELECT t.deviceId as deviceId, t.value AS value, MAX(t.time) AS time
  FROM temperatures t
  GROUP BY t.deviceId
  `);

  return new Promise((resolve, reject) => {
    stmt.all((err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

module.exports.getHourlyTemperatures = (deviceId, from, to) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      WITH TimeDiff AS (
        SELECT
            deviceId,
            value AS temperature,
            time,
            strftime('%s', time) - COALESCE(strftime('%s', LAG(time) OVER (PARTITION BY deviceId ORDER BY time)), strftime('%s', time)) AS diff_in_seconds
        FROM
            temperatures
        WHERE deviceId = '${deviceId}' AND time >= '${from.toISOString()}' AND time < '${to.toISOString()}'
      ),
      WeightedTemps AS (
        SELECT
            deviceId,
            temperature,
            time,
            CAST(diff_in_seconds / 60.0 AS REAL) AS weight_minutes -- Calculate the weight as minutes
        FROM
            TimeDiff
      ),
      HourlyWeightedAverages AS (
        SELECT
            deviceId,
            strftime('%Y-%m-%d %H', time) AS time,
            SUM(temperature * weight_minutes) / SUM(weight_minutes) AS value
        FROM
            WeightedTemps
        GROUP BY
            deviceId, strftime('%Y-%m-%d %H', time)
      )
      SELECT * FROM HourlyWeightedAverages;
      `,
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            rows.map((row) => ({
              ...row,
              time: parse(row.time, "yyyy-MM-dd HH", new Date()),
            }))
          );
        }
      }
    );
  });
};

module.exports.getDailyTemperatures = (deviceId, from, to) => {
  return new Promise((resolve, reject) => {
    db.all(
      `
      WITH TimeDiff AS (
        SELECT
            deviceId,
            value AS temperature,
            time,
            strftime('%s', time) - COALESCE(strftime('%s', LAG(time) OVER (PARTITION BY deviceId ORDER BY time)), strftime('%s', time)) AS diff_in_seconds
        FROM
            temperatures
        WHERE deviceId = '${deviceId}' AND time >= '${from.toISOString()}' AND time < '${to.toISOString()}'
      ),
      WeightedTemps AS (
        SELECT
            deviceId,
            temperature,
            time,
            CAST(diff_in_seconds / 60.0 AS REAL) AS weight_minutes -- Calculate the weight as minutes
        FROM
            TimeDiff
      ),
      DailyWeightedAverages AS (
        SELECT
            deviceId,
            strftime('%Y-%m-%d', time) AS time,
            SUM(temperature * weight_minutes) / SUM(weight_minutes) AS value
        FROM
            WeightedTemps
        GROUP BY
            deviceId, strftime('%Y-%m-%d', time)
      )
      SELECT * FROM DailyWeightedAverages;
`,
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            rows.map((row) => ({
              ...row,
              time: parse(row.time, "yyyy-MM-dd", new Date()),
            }))
          );
        }
      }
    );
  });
};

module.exports.getAllTemperatures = function (deviceId) {
  const stmt = db.prepare(`
    SELECT * 
    FROM temperatures
    WHERE deviceId = ?
    ORDER BY time DESC
  `);

  return new Promise((resolve, reject) => {
    stmt.all(deviceId, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

}

module.exports.addTemperatures = function (values, deviceId) {
  const stmt = db.prepare(
    `INSERT INTO temperatures (value, time, deviceId) VALUES (?, ?, ?)`
  );

  for (const value of values) {
    stmt.run(value.temperature, value.time, deviceId);
  }
};

module.exports.deleteTemperatures = function (deviceId) {
  const stmt = db.prepare(`DELETE FROM temperatures WHERE deviceId = ?`);

  stmt.run(deviceId);
};

module.exports.deleteTemperatureByTime = function (deviceId, time) {
  const stmt = db.prepare(`DELETE FROM temperatures WHERE deviceId = ? AND time = ?`);

  stmt.run(deviceId, time);
};