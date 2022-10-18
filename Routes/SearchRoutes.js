const express = require("express");
const router = express.Router();
const { SearchApi } = require("../Controller/SearchApiController");

router.route("/search").get(SearchApi);

module.exports = router;
