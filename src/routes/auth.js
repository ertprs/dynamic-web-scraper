var express = require("express");
var router = express.Router();
const User = require("../../models/User")
const bcrypt = require("bcrypt");

router.get("/login", function (req, res, next) {
  if(req.session.userInfo) res.redirect('/admin/dashboard')
  
//   res.send("ok login now");
  res.render("auth/login", {
    layout: "layouts/authMaster",
    title: "Scraper",
    active: { login: true },
  });
});

router.post("/login", async function (req, res, next) {
  if(req.session.userInfo) res.redirect('/admin/dashboard')
  
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user === null) {
    return res.status(404).send("Cannot find user.");
  } else {
    try {
      if(bcrypt.compare(req.body.password, user.password)){
        let info = {id: user.id, name:user.name, email:user.email}
        req.session.userInfo = info;
        
        res.redirect("/admin/dashboard");
      } else {
        res.send("Login failed.");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
  
  // res.render("dashboard/scraper/index", {
  //   layout: "dashboard/layouts/master",
  //   title: "Scraper",
  //   active: { scraper: true },
  // });
});

router.get("/logout", function (req, res, next) {
    if(!req.session.userInfo) return res.redirect("/auth/login");
  
    global.venomClient.close();
    req.session.destroy(err => {
      if(err) return res.redirect("/auth/login");

      // res.clearCookie(process.env.SESS_NAME);
      // sess001
      return res.redirect("/auth/login")
    })
    return res.send("You are logged out.")
});

router.get("/register", function (req, res, next) {
  if(req.session.userInfo) res.redirect('/admin/dashboard')
  
  res.send("ok register now");
  // res.render("dashboard/scraper/index", {
  //   layout: "dashboard/layouts/master",
  //   title: "Scraper",
  //   active: { scraper: true },
  // });
});

router.post("/register", async function (req, res, next) {
  if(req.session.userInfo) res.redirect('/admin/dashboard')
  
  let hashedPwd = req.body.password;
  try {
    const salt = await bcrypt.genSalt();
    hashedPwd = await bcrypt.hash(req.body.password, 10);
    console.log(salt);
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
