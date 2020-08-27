module.exports = async () => {
  const User = require("../models/User");
  const Scrape = require("../models/Scrape");

  User.hasMany(Scrape, { as: "scrapes", foreignKey: "user_id" });
  Scrape.belongsTo(User, { as: "user", foreignKey: "user_id" });

  const errHandler = (err) => {
    console.log("errMsg:", err);
  };

  const user = await User.create({
    name: "Superadmin",
    email: "superadmin@gmail.com",
    password: "password",
  }).catch(errHandler);

  const scrape = await Scrape.create({
    name: "Testing scrape",
    user_id: user.id,
  }).catch(errHandler);

  let users = await User.findAll({
    where: {
      email: "superadmin@gmail.com",
    },
    include: [
      {
        model: Scrape,
        as: "scrapes",
      },
    ],
  }).catch(errHandler);

  console.log("data", JSON.stringify(users))
};
