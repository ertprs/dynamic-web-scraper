var express = require("express");
var router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/", function (req, res, next) {
  res.render("dashboard/scraper/index", {
    layout: "dashboard/layouts/master",
    title: "Scraper",
    active: { scraper: true },
  });
});

router.post("/", async function (req, res, next) {
  console.log(req.body);
  let hashedPwd = req.body.password;
  try {
      const salt = await bcrypt.genSalt();
      hashedPwd = await bcrypt.hash(req.body.password, 10);
      console.log(salt)
      console.log(hashedPwd)
  } catch (error) {
      console.log(error)
      res.status(500).send(error) 
  }
  
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPwd,
    role: "USER",
  }).catch((err) => {
    console.log("errMsg:", err);
  });

  res.send(user);
});

module.exports = router;
