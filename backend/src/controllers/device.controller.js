const { Router } = require("express");
const authMiddleware = require("../auth-middleware");
const {
  getAllDevices,
  registerDevice,
  deleteDevice,
} = require("../repositories/device.repository");
const { validateRequest } = require("zod-express-middleware");
const { z } = require("zod");

const router = new Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  const devices = await getAllDevices();
  return res.json(devices);
});

router.post(
  "/",
  validateRequest({ body: z.object({ name: z.string() }) }),
  (req, res) => {
    const device = req.body;
    return res.json(registerDevice(device.name));
  }
);

//delete router
router.delete("/:deviceId", async (req, res) => {
  const { deviceId } = req.params;
  return res.json(deleteDevice(deviceId));
});

module.exports = router;
