const { Router } = require("express");
const authMiddleware = require("../auth-middleware");
const { validateRequest } = require("zod-express-middleware");
const { z } = require("zod");
const {
  getTemperaturesForDevice,
} = require("../repositories/temperature.repository");
const {
  addTemperatures: addTemperature,
  deleteTemperatures,
} = require("../services/temperature.service");

const router = new Router();

router.use(authMiddleware);

router.get(
  "/:deviceId",
  validateRequest({
    params: z.object({
      deviceId: z.string(),
    }),
    query: z.object({
      time: z.enum(["1h", "1d", "1w", "1m"]),
    }),
  }),
  async (req, res) => {
    let time;
    if (req.query.time === "1h") time = "-1 hour";
    if (req.query.time === "1d") time = "-1 day";
    if (req.query.time === "1w") time = "-7 day";
    if (req.query.time === "1m") time = "-1 month";

    const temperatures = await getTemperaturesForDevice(
      req.params.deviceId,
      time
    );
    return res.json(temperatures);
  }
);

router.post(
  "/",
  validateRequest({
    body: z.object({
      values: z.array(
        z.object({
          temperature: z.number(),
          time: z.string(),
        })
      ),
      secretKey: z.string(),
    }),
  }),
  async (req, res) => {
    try {
      await addTemperature(req.body.values, req.body.secretKey);
      return res.sendStatus(200);
    } catch (e) {
      console.error(e);
      return res.sendStatus(400);
    }
  }
);

router.delete(
  "/",
  validateRequest({
    body: z.object({
      secretKey: z.string(),
    }),
  }),
  async (req, res) => {
    try {
      await deleteTemperatures(req.body.secretKey);
      return res.sendStatus(200);
    } catch (e) {
      console.error(e);
      return res.sendStatus(400);
    }
  }
);

module.exports = router;
