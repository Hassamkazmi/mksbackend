const express = require("express");
const router = express.Router();
const {
  AdsGet,
  CreateAdvertisment,
  EditAds,
  DeleteAds,
  SoftDelete
} = require("../Controller/AdvertismentController");
const { upload } = require("../Utils/ImageUpload");

router.route("/uploadAds", upload.single("image")).post(CreateAdvertisment);
router.route("/Adsget").get(AdsGet);
router.route("/deleteAds/:id").delete(DeleteAds);
router.route("/updateAds/:id", upload.single("image")).put(EditAds);
router.route("/softdeleteAds/:id").put(SoftDelete);
module.exports = router;
