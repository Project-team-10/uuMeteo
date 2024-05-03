const { getDeviceBySecretKey } = require("../repositories/device.repository");
const {
  addTemperatures,
  deleteTemperatures,
} = require("../repositories/temperature.repository");

module.exports.addTemperatures = async function (values, secretKey) {
  const device = await getDeviceBySecretKey(secretKey);
  if (!device) {
    throw new Error("Device not found");
  }
  addTemperatures(values, device.deviceId);
};

module.exports.deleteTemperatures = async function (secretKey) {
  const device = await getDeviceBySecretKey(secretKey);
  if (!device) {
    throw new Error("Device not found");
  }
  deleteTemperatures(device.deviceId);
};
