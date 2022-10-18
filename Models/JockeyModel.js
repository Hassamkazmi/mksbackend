const mongoose = require("mongoose");
const JockeyModel = new mongoose.Schema(
  {
    Name: {
      type: String,
      trim: true,
      required: [true, "enter jockey name"]
    },
    Age: {
      type: Number,
      required: [true, "enter age "]
    },
    WinningHistory: [
      {
        type: mongoose.Schema.ObjectId
      }
    ],

    Rating: {
      type: Number,
      trim: true
    },
    image: {
      type: String,
      trim: true
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
module.exports = mongoose.model("JockeyModel", JockeyModel);
