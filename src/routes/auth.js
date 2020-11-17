var express = require("express");
var router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcrypt");

router.get("/login", function (req, res, next) {
  if (req.session.userInfo) return res.redirect("/dashboard");
  //   res.send("ok login now");
  res.render("auth/login", {
    layout: "layouts/authMaster",
    title: "Scraper",
    active: { login: true },
    message: req.flash("message"),
    old_email: req.flash("old_email"),
  });
});

router.post("/login", async function (req, res, next) {
  if (req.session.userInfo) return res.redirect("/dashboard");
  backURL = req.header("Referer") || "/";

  const user = await User.findOne({ where: { email: req.body.email } });
  if (user === null) {
    req.flash("message", "Email atau password salah.");
    req.flash("old_email", req.body.email);
    return res.redirect(backURL);
  } else {
    bcrypt.compare(req.body.password, user.password, function (error, result) {
      if (error) {
        return res.status(500).send(err);
      }
      if (result) {
        req.session.userInfo = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        return res.redirect("/dashboard");
      } else {
        req.flash("message", "Email atau password salah.");
        req.flash("old_email", req.body.email);
        return res.redirect(backURL);
      }
    });
  }

  // res.render("dashboard/scraper/index", {
  //   layout: "dashboard/layouts/master",
  //   title: "Scraper",
  //   active: { scraper: true },
  // });
});

router.get("/logout", function (req, res, next) {
  if (!req.session.userInfo) return res.redirect("/auth/login");

  if (global.venomClient) global.venomClient.close();
  req.session.destroy((error) => {
    if (error) return res.status(500).send(error);
    return res.redirect("/auth/login");
  });
});

router.get("/register", function (req, res, next) {
  if (req.session.userInfo) return res.redirect("/dashboard");

  res.send("ok register now");
  // res.render("dashboard/scraper/index", {
  //   layout: "dashboard/layouts/master",
  //   title: "Scraper",
  //   active: { scraper: true },
  // });
});

router.post("/register", async function (req, res, next) {
  if (req.session.userInfo) return res.redirect("/dashboard");

  let hashedPwd = req.body.password;
  try {
    hashedPwd = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPwd);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPwd,
    role: "USER",
  }).catch((err) => {
    console.log("errMsg:", err);
  });

  req.session.userInfo = user;

  res.send(user);

  res.render("dashboard/scraper/index", {
    layout: "dashboard/layouts/master",
    title: "Scraper",
    active: { scraper: true },
  });
});

module.exports = router;
