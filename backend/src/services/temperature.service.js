const { getDeviceBySecretKey } = require("../repositories/device.repository");
const {
  addTemperatures,
  deleteTemperatures,
} = require("../repositories/temperature.repository");
const { checkAlerts } = require("./alerts.service");

module.exports.addTemperatures = async function (values, secretKey) {
  const device = await getDeviceBySecretKey(secretKey);
  if (!device) {
    throw new Error("Device not found");
  }

  await checkAlerts(device.deviceId, values);
  addTemperatures(values, device.deviceId);
};

module.exports.deleteTemperatures = async function (secretKey) {
  const device = await getDeviceBySecretKey(secretKey);
  if (!device) {
    throw new Error("Device not found");
  }
  deleteTemperatures(device.deviceId);
};
