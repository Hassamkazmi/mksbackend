const mongoose = require("mongoose");
const SliderModel = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "please enter  image "]
    },
    TitleEn: {
      type: String,
      trim: true,
      required: [true, " Please Enter Title in English  "]
    },
    TitleAr: {
      type: String,
      trim: true,
      required: [true, " Please Enter Title in Arabic   "]
    },
    IsActive: {
      type: Boolean,
      default: 1
    },
    SoftDelete: {
      type: Boolean,
      default: 0,
      select: false
    }
  },
  {
    autoIndex: true,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);
module.exports = mongoose.model("SliderModel", SliderModel);
