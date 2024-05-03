const { Router } = require("express");
const authMiddleware = require("../auth-middleware");
const { validateRequest } = require("zod-express-middleware");
const { z } = require("zod");
const {
  getTemperaturesForDevice,
  getLastTemperatures: getLastTemperatureForDevice,
  getLastTemperatures,
  getHourlyTemperatures,
  getDailyTemperatures,
} = require("../repositories/temperature.repository");
const {
  addTemperatures,
  deleteTemperatures,
} = require("../services/temperature.service");

const router = new Router();

router.get("/realtime", authMiddleware, async (req, res) => {
  const temperatures = await getLastTemperatures();
  return res.json(temperatures);
});

router.get(
  "/:deviceId",
  authMiddleware,
  validateRequest({
    params: z.object({
      deviceId: z.string().uuid(),
    }),
    query: z.object({
      time: z.enum(["1h", "1d"]),
      from: z.coerce.date(),
      to: z.coerce.date(),
    }),
  }),
  async (req, res) => {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);

    if (req.query.time === "1h")
      return res.json(
        await getHourlyTemperatures(req.params.deviceId, from, to)
      );
    if (req.query.time === "1d")
      return res.json(
        await getDailyTemperatures(req.params.deviceId, from, to)
      );
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
      await addTemperatures(req.body.values, req.body.secretKey);
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
