const mongoose = require("mongoose");
const AdvertismentModel = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, " Enter Image "]
    },
    DescriptionEn: {
      type: String,
      trim: true,
      required: [true, " Enter English Description "]
    },
    DescriptionAr: {
      type: String,
      trim: true,
      required: [true, " Enter Arabic Description "]
    },
    TitleEn: {
      type: String,
      trim: true,
      required: [true, " Enter English Title "]
    },
    TitleAr: {
      type: String,
      trim: true,
      required: [true, " Enter Arabic Title"]
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
module.exports = mongoose.model("AdvertismentModel", AdvertismentModel);
