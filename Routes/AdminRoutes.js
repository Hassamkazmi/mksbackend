const express = require("express");
const router = express.Router();
const {
  GetAdmin,
  CreateAdmin,
  DeleteAdmin,
  UpdateAdmin,
  LoginAdmin,
  logOut,
} = require("../Controller/AdminController");

router.route("/createAdmin").post(CreateAdmin);
router.route("/Admin").get(GetAdmin);
router.route("/login").post(LoginAdmin);
router.route("/logoutadmin").post(logOut);
router.route("/deleteAdmin/:id").delete(DeleteAdmin);
router.route("/updateAdmin/:id").put(UpdateAdmin);
module.exports = router;
