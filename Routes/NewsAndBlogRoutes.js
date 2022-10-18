const express = require("express");
const router = express.Router();
const {
  CreateNewsAndBlog,
  NewsGet,
  DeleteNews,
  EditNews,
  SearchNews,
} = require("../Controller/NewsAndBlogController");
const { upload } = require("../Utils/ImageUpload");

router.route("/uploadnews", upload.single("image")).post(CreateNewsAndBlog);

router.route("/newsget").get(NewsGet);
router.route("/newsgetsearch").get(SearchNews);
router.route("/deletenews/:id").delete(DeleteNews);
router.route("/updatenews/:id", upload.single("image")).put(EditNews);

module.exports = router;
