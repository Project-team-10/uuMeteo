const {
  getLatestTemperature,
} = require("../repositories/temperature.repository");
const {
  getAllAlerts,
  updateAlertTrigger,
} = require("../repositories/alerts.repository");

async function checkAndUpdateAlerts() {
  console.log("Checking and updating alerts...");
  try {
    const alerts = await getAllAlerts();
    for (const alert of alerts) {
      console.log(alert);
      const latestTemperature = await getLatestTemperature(alert.device_id);
      console.log(latestTemperature);
      if (
        latestTemperature >= alert.upper_limit ||
        latestTemperature <= alert.lower_limit
      ) {
        await updateAlertTrigger(alert.id, new Date().toISOString());
        console.log(`Alert for device ${alert.device_id} triggered.`);
      }
    }
  } catch (error) {
    console.error("Error checking and updating alerts:", error);
  }
}

module.exports = {
  checkAndUpdateAlerts,
};
