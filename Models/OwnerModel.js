const mongoose = require("mongoose");
const OwnerModel = new mongoose.Schema({
  Name: {
    type: String,
    trim: true,
    required: [true, "enter Name"],
  },
  Horses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "HorseModel",
      // required: [true, "please enter Horse"],
    },
  ],
  History: [
    {
      type: String,
      trim: true,
    },
  ],
  image: {
    type: String,
    trim: true,
  },
  SoftDelete: {
    type: Boolean,
    default: 0,
    select: false,
  },
});
module.exports = mongoose.model("OwnerModel", OwnerModel);
