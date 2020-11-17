module.exports = (req, res, next) => {
  if (req.session.userInfo) return res.redirect("/dashboard");
  next();
};
