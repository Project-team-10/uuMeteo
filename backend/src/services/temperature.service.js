const { getDeviceBySecretKey } = require("../repositories/device.repository");
const {
  addTemperature,
  deleteTemperatures,
} = require("../repositories/temperature.repository");

module.exports.addTemperature = async function (value, time, secretKey) {
  const device = await getDeviceBySecretKey(secretKey);
  if (!device) {
    throw new Error("Device not found");
  }
  addTemperature(value, time, device.deviceId);
};

module.exports.deleteTemperatures = async function (secretKey) {
  const device = await getDeviceBySecretKey(secretKey);
  if (!device) {
    throw new Error("Device not found");
  }
  deleteTemperatures(device.deviceId);
};
