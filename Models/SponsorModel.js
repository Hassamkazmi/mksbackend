const mongoose = require("mongoose");
const SponsorModel = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Enter image  "]
    },
    DescriptionEn: {
      type: String,
      trim: true,
      required: [true, "Please Enter Description in English "]
    },
    DescriptionAr: {
      type: String,
      trim: true,
      required: [true, "Please Enter Description in Arabic  "]
    },
    TitleEn: {
      type: String,
      trim: true,
      required: [true, "Please Enter  English Title "]
    },
    TitleAr: {
      type: String,
      trim: true,
      required: [true, " Please Enter Arabic Title  "]
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
module.exports = mongoose.model("SponsorModel", SponsorModel);
