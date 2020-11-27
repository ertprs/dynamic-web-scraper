var express = require("express");
var router = express.Router();
const Scrape = require("../../models/Scrape");

const getPagination = (page, size) => {
  const limit = size ? + size : 15;
  const offset = page && (page-1) >= 0 ? (page-1) * limit : 0;
  return {
    limit,
    offset
  };
};

const getPagingData = (data, page, limit) => {
  const {
    count: totalItems,
    rows: scrapes
  } = data;
  const currentPage = page ? + page : 1;
  const totalPages = Math.ceil(totalItems / limit);
  scrapes.forEach(s => {
    s.content = JSON.parse(s.content);
    let attrs = [];
    JSON.parse(s.attributes).forEach(attr => {
      attrs.push(attr.name);
    });
    s.attributes = attrs.join(", ");
  });
  return {
    totalItems,
    scrapes,
    totalPages,
    currentPage,
    size: limit,
    prevPage: currentPage - 1,
    nextPage: currentPage + 1,
  };
};

router.get("/", function (req, res, next) {
  const {
    page,
    size,
    title
  } = req.query;

  var condition = title ? {
    title: {
      [Op.like]: `%${title}%`
    }
  } : null;
  const { limit, offset } = getPagination(page, size);

  Scrape.findAndCountAll({
      where: condition,
      limit,
      offset
    })
    .then(data => {
      const response = getPagingData(data, page, limit);
      // return res.send(response);
      return res.render("dashboard/index", {
        data: response,
        layout: "dashboard/layouts/master",
        title: "Dashboard",
        active: {
          dashboard: true
        },
      });
    })
    .catch(err => {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving scrapes."
      });
    });
});

module.exports = router;