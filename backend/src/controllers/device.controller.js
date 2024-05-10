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

// device.routes.js
router.post(
  "/",
  validateRequest({ body: z.object({ name: z.string() }) }),
  (req, res) => {
    const device = req.body;
    const newDevice = registerDevice(device.name);
    return res.json(newDevice);
  }
);
//delete router
router.delete(
  "/:deviceId",
  validateRequest({ params: z.object({ deviceId: z.string() }) }),
  (req, res) => {
    const { deviceId } = req.params;
    return res.json(deleteDevice(deviceId));
  }
);
module.exports = router;
