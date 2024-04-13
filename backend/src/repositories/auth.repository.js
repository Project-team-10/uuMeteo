const db = require("../db-setup");
const { randomUUID } = require("crypto");

module.exports.saveUser = function (username, password) {
  const userId = randomUUID();
  const stmt = db.prepare(
    `INSERT INTO users (userId, username, password) VALUES (?, ?, ?)`
  );
  stmt.run(userId, username, password);

  return {
    userId,
    username,
  };
};

module.exports.findUserByUsername = function (username) {
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");

  return new Promise((resolve, reject) => {
    stmt.get(username, (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
};
