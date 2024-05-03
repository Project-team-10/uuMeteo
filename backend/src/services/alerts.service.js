const { getLatestTemperature } = require("../repositories/temperature.repository");
const { getAllAlerts, updateAlertTrigger } = require("../repositories/alerts.repository");

async function checkAndUpdateAlerts() {
    try {
        const alerts = await getAllAlerts();
        for (const alert of alerts) {
            const latestTemperature = await getLatestTemperature(alert.deviceId);
            if (latestTemperature >= alert.upperLimit || latestTemperature <= alert.lowerLimit) {
                await updateAlertTrigger(alert.deviceId, new Date().toISOString());
            }
        }
    } catch (error) {
        console.error("Error checking and updating alerts:", error);
    }
}

module.exports = {
    checkAndUpdateAlerts,
};
