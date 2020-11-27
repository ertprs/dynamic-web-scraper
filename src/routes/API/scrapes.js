var express = require("express");
var router = express.Router();
const ObjectID = require("bson").ObjectID;
const Scrape = require("../../../models/Scrape");

router.get("/", function (req, res, next) {
  let objectId = new ObjectID();

  res.render("dashboard/scraper/index", {
    layout: "dashboard/layouts/master",
    title: "Scraper",
    objectId: objectId.toString(),
    active: {
      scraper: true
    },
  });
});

router.get("/:id", async function (req, res, next) {
  try {
    let scrape = await Scrape.findOne({
      where: {
        id: req.params.id
      }
    });
    if (scrape) {
      scrape.content = JSON.parse(scrape.content);
      scrape.attributes = JSON.parse(scrape.attributes);
      return res.send({
        isError: false,
        stsCode: 200,
        data: scrape,
      });
    } else {
      return res.send({
        isError: true,
        stsCode: 404,
        msg: "Data tidak ditemukan.",
      });
    }
  } catch (error) {
    return res.send({
      isError: true,
      stsCode: 500,
      msg: "Oops, terjadi kesalahan. Coba beberapa saat lagi.",
      errMsg: error.message,
    });
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    let input = req.body;

    let scrape = await Scrape.findOne({
      where: {
        id: req.params.id
      }
    });
    if (scrape) {
      let strXML = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
  xmlns:dc="${input.url}">
  
  <rdf:Description rdf:about="${input.title}">`;

      for (let i = 0; i < input.attribute_names.length; i++) {
        strXML += `\n<dc:${input.attribute_names[i].replace(/\s/g, "-")}>${
        input.attribute_values[i]
      }</dc:${input.attribute_names[i].replace(/\s/g, "-")}>`;
      }
      strXML += `
    </rdf:Description>
  </rdf:RDF>`;

      let arrContentJson = [];
      for (let i = 0; i < input.attribute_names.length; i++) {
        arrContentJson.push({
          name: input.attribute_names[i].replace(/\s/g, "-"),
          value: input.attribute_values[i]
        });
      }
      // Unserilize things
      let attrs = [];
      JSON.parse(scrape.attributes).forEach(attr => {
        attrs.push(attr);
      });
      let arrAttrs = []
      for (let i = 0; i < input.attribute_names.length; i++) {
        arrAttrs.push({
          name: input.attribute_names[i].replace(/\s/g, "-"),
          selectors: {
            name: attrs[i].selectors.name,
            type: attrs[i].selectors.type,
            traversal_type: attrs[i].selectors.traversal_type,
          }
        });
      }
      Scrape.update({
        url: input.url,
        page_title: input.title,
        content: JSON.stringify({
          xml: strXML,
          json: {
            url: input.url,
            title: input.title,
            attributes: arrContentJson
          }
        }),
        // user_id: req.session.userInfo.id
        attributes: JSON.stringify(arrAttrs)
      }, {
        where: {
          id: req.params.id
        }
      });
      return res.send({
        isError: false,
        stsCode: 200,
        message: "Data berhasil diperbarui."
      });
    } else {
      return res.send({
        isError: true,
        stsCode: 404,
        msg: "Data tidak ditemukan.",
      });
    }
  } catch (error) {
    return res.send({
      isError: true,
      stsCode: 500,
      msg: "Oops, terjadi kesalahan. Coba beberapa saat lagi.",
      errMsg: error.message,
    });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let scrape = await Scrape.findOne({
      where: {
        id: req.params.id
      }
    });
    if (scrape) {
      Scrape.destroy({
        where: { id: req.params.id }
      })
      return res.send({
        isError: false,
        stsCode: 200,
        message: "Data berhasil dihapus."
      });
    } else {
      return res.send({
        isError: true,
        stsCode: 404,
        msg: "Data tidak ditemukan.",
      });
    }
  } catch (error) {
    return res.send({
      isError: true,
      stsCode: 500,
      msg: "Oops, terjadi kesalahan. Coba beberapa saat lagi.",
      errMsg: error.message,
    });
  }
});

router.get("/:objectId/download", async function (req, res, next) {
  let objectId = req.params.objectId;
  const scrape = await Scrape.findOne({
    where: {
      code: objectId
    }
  });
  if (scrape === null) {
    return res.status(404).send("Cannot find data.");
  } else {
    const fileData = scrape.content
    const fileName = `${scrape.page_title}.owl`
    const fileType = 'text/plain'

    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': fileType,
    })

    const download = Buffer.from(fileData)
    res.end(download)
  }
  // const file = __dirname + `/${objectId}.owl`;
  // res.download(file);
});

module.exports = router;