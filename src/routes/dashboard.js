var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("dashboard/index", {
    layout: "dashboard/layouts/master",
    title: "Dashboard",
    active: { dashboard: true },
  });
});

module.exports = router;
