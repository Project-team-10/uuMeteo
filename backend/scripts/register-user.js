const { registerUser } = require("../src/services/auth.service");

const username = process.argv[2];
const password = process.argv[3];

registerUser(username, password);
