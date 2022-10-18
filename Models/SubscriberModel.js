const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const SubscriberModel = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      trim: true,
      required: [true, "Enter first Name "],
    },
    LastName: {
      type: String,
      trim: true,
      required: [true, " Enter Last Name "],
    },
    PassportNo: {
      type: String,
      trim: true,
      required: [true, " Please Enter Passport Number"],
    },
    Status: {
      type: Boolean,
      default: 1,
    },
    PhoneNumber: {
      type: String,
      trim: true,
      required: [true, "Enter Phone Number "],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Enter Password "],
      select: false,
    },
    Email: {
      type: String,
      trim: true,
      required: [true, "Enter Email "],
    },
    PassportPicture: {
      type: String,
      required: [true, " image de"],
    },
    role: {
      type: String,
      default: "notapproveduser",
      select: false,
    },
    TrackHorse: [
      {
        type: mongoose.Schema.ObjectId,
      },
    ],
  },
  {
    autoIndex: true,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
SubscriberModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

SubscriberModel.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

SubscriberModel.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

SubscriberModel.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};
module.exports = mongoose.model("SubscriberModel", SubscriberModel);
