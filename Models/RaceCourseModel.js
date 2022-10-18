const mongoose = require("mongoose");
const RaceCourseModel = new mongoose.Schema(
  {
    Country: {
      type: String,
      trim: true,
      required: [true, "country require"],
    },
    TrackName: {
      type: String,
      trim: true,
      required: [true, "TrackNameRequried"],
    },
    TrackLength: {
      type: String,
      trim: true,
      required: [true, "TrackLength needed"],
    },
    image: {
      type: String,
      required: [true, "image Required"],
    },
    SoftDelete: {
      type: Boolean,
      default: 0,
      select: false,
    },
  },
  {
    autoIndex: true,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
module.exports = mongoose.model("RaceCourseModel", RaceCourseModel);
