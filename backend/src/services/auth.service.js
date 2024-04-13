const {
  saveUser,
  findUserByUsername,
} = require("../repositories/auth.repository");
const bcrypt = require("bcrypt");

module.exports.registerUser = function (username, password) {
  const hash = bcrypt.hashSync(password, 10);
  return saveUser(username, hash);
};

module.exports.handlePasswordVerification = async function (
  username,
  password
) {
  console.log(`Handle local verification for user ${username}`);
  const user = await findUserByUsername(username);
  if (!user) {
    return null;
  }

  const result = await bcrypt.compare(password, user.password);
  if (result) {
    return user;
  } else {
    return null;
  }
};
