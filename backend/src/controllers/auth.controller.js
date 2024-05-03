const { Router } = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { handlePasswordVerification } = require("../services/auth.service");

const router = new Router();
const { FE_URL } = process.env;

router.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: `${FE_URL}`,
    // failureRedirect: `${FE_URL}#/login`,
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("ok");
  });
});

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    try {
      const result = await handlePasswordVerification(username, password);
      if (!result) {
        return cb(null, false, {
          message: "Incorrect username or password.",
        });
      }
      return cb(null, result);
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id_user, username: user.username, email: user.email });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

module.exports = router;
