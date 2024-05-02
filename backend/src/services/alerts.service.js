const { getTemperaturesForDevice } = require("../repositories/temperature.repository");
const { getAllAlerts, updateAlertTrigger } = require("../repositories/alerts.repository");

async function checkAndUpdateAlerts() {
    try {
        const alerts = await getAllAlerts();
        for (const alert of alerts) {
            const temperatures = await getTemperaturesForDevice(alert.deviceId, "-1 hour");
            const lastTemperature = temperatures[0]?.value;
            if (lastTemperature >= alert.upperLimit || lastTemperature <= alert.lowerLimit) {
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
