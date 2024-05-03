const { Router } = require("express");
const authMiddleware = require("../auth-middleware");
const { getAllAlerts, createAlert, clearAlertTrigger, deleteAlert } = require("../repositories/alerts.repository"); const router = new Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
    const alerts = await getAllAlerts();
    return res.json(alerts);
});

router.post("/", async (req, res) => {
    const { deviceId, upperLimit, lowerLimit } = req.body;

    try {
        await createAlert(deviceId, upperLimit, lowerLimit);
        return res.status(200).json({ message: "Alert created" });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Error creating alert" });
    }
});

router.put("/:id/clear", async (req, res) => {
    const alertId = req.params.id;

    try {
        await clearAlertTrigger(alertId);
        return res.status(200).send("Alert cleared");
    } catch (error) {
        console.error(error);
        return res.status(400).send("Error clearing alert");
    }
});


router.delete("/:id", async (req, res) => {
    const alertId = req.params.id;

    try {
        await deleteAlert(alertId);
        return res.status(200).send("Alert deleted");
    } catch (error) {
        console.error(error);
        return res.status(400).send("Error deleting alert");
    }
});

module.exports = router;
