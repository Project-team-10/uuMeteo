const {
  getLatestTemperature,
} = require("../repositories/temperature.repository");
const {
  getAllAlerts,
  updateAlertTrigger,
  getAlertsForDevice,
} = require("../repositories/alerts.repository");

async function checkAlerts(deviceId, measurements) {
  try {
    const alerts = await getAlertsForDevice(deviceId);
    for (const alert of alerts) {
      for (const measurement of measurements) {
        if (
          measurement.temperature >= alert.upper_limit ||
          measurement.temperature <= alert.lower_limit
        ) {
          updateAlertTrigger(
            alert.id,
            new Date(measurement.time).toISOString()
          );
          console.log(`Alert for device ${alert.device_id} triggered.`);
        }
      }
    }
  } catch (error) {
    console.error("Error checking and updating alerts:", error);
  }
}

module.exports = {
  checkAlerts,
};
