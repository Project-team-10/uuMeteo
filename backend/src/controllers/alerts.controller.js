const { Router } = require("express");
const authMiddleware = require("../auth-middleware");
const { getAllAlerts, createAlert } = require("../repositories/alerts.repository");

const router = new Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
    const alerts = await getAllAlerts();
    return res.json(alerts);
});

router.post("/", async (req, res) => {
    const { deviceId, upperLimit, lowerLimit } = req.body;

    try {
        await createAlert(deviceId, upperLimit, lowerLimit);
        return res.status(200).send("Alert created");
    } catch (error) {
        console.error(error);
        return res.status(400).send("Error creating alert");
    }
});

router.put("/clear", async (req, res) => {
    const { deviceId } = req.body;

    try {
        await clearAlertTrigger(deviceId);
        return res.status(200).send("Alert cleared");
    } catch (error) {
        console.error(error);
        return res.status(400).send("Error clearing alert");
    }
});


router.delete("/", async (req, res) => {
    const { deviceId } = req.body;

    try {
        await deleteAlert(deviceId);
        return res.status(200).send("Alert deleted");
    } catch (error) {
        console.error(error);
        return res.status(400).send("Error deleting alert");
    }
});

module.exports = router;
