var express = require("express");
var router = express.Router();
var request = require("request");
var area = require("../area");
var classifyPoint = require("robust-point-in-polygon");

//eu1.locationiq.com/v1/search.php?key=YOUR_PRIVATE_TOKEN&q=SEARCH_STRING&format=json
/* GET home page. */
router.get("/:loc", function(req, res, next) {
  let umlautMap = {
    Ü: "UE",
    Ä: "AE",
    Ö: "OE",
    ü: "ue",
    ä: "ae",
    ö: "oe",
    ß: "ss"
  };

  function replaceUmlaute(str) {
    return str
      .replace(/[\u00dc|\u00c4|\u00d6][a-z]/g, a => {
        var big = umlautMap[a.slice(0, 1)];
        return big.charAt(0) + big.charAt(1).toLowerCase() + a.slice(1);
      })
      .replace(
        new RegExp("[" + Object.keys(umlautMap).join("|") + "]", "g"),
        a => umlautMap[a]
      );
  }
  let location = replaceUmlaute(req.params.loc);

  let inPoly = (obj, cord) => {
    let vertices = Object.keys(obj).length;
    let breaker = 0;
    let scanResto = Object.keys(obj).map(key => {
      breaker++;
      if (
        classifyPoint(obj[key], cord) === -1 ||
        classifyPoint(obj[key], cord) === 0
      ) {
        return {
          status: "success",
          message: key
        };
      } else if (!breaker == vertices && key == 1) {
        return {
          status: "failed",
          message: "not found"
        };
      }
    });
    console.log(">>>scanREst" + scanResto);
    let nearestResto = scanResto.reduce((accumulator, currentValue) => {
      return currentValue || accumulator;
    });

    let failed = {
      status: "failed",
      message: "not found"
    };
    return nearestResto ? nearestResto : failed;
  };
  let uri = encodeURI(
    "https://eu1.locationiq.com/v1/search.php?key=63cda5ceaf9969&q="
  );
  request(uri + location + "&format=json", { json: true }, function(
    error,
    response,
    body
  ) {
    if (!error && response.statusCode === 200) {
      let cords = [body[0].lon, body[0].lat];
      console.log(">>>" + cords);
      return res.json(inPoly(area, cords));
    } else {
      return res.json(error);
    }
  });
});

module.exports = router;
