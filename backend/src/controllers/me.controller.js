const { Router } = require("express");
const authMiddleware = require("../auth-middleware");

const router = new Router();

router.use(authMiddleware);

router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      res.status(200).json(req.user);
    } else {
      res.status(401).send("User not logged in");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
