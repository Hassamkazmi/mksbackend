const mongoose = require("mongoose");
// race course name flag  day time  raceName  raceType   race kind  weather track length   description prizeswith ranks  (total)
// horse name nationality  age  gender  color (rating) history
// overall rating
// jockey  nationality weight historyonly by rank age rating
// owner history
// trainer history
// c d cl bf
// breeder
// pedigree
// earning
// career of horse
// horse last three games history
const RaceModel = new mongoose.Schema(
  {
    RaceKind: {
      type: String,
      trim: true,
      required: [true, "declare Race Kind"],
    },
    raceName: {
      type: String,
      trim: true,
      required: [true, "declare RaceName"],
    },

    Description: {
      type: String,
      trim: true,
      required: [true, "declare Description"],
    },

    RaceCourse: {
      type: mongoose.Schema.ObjectId,
      ref: "RaceCourseModel",
    },
    Weather: {
      type: String,
      trim: true,
      required: [true, "declare weather"],
    },
    Horses: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "HorseModel",
        required: true,
      },
    ],

    Prizes: [
      {
        Rank: {
          type: Number,
        },
        Amount: {
          type: Number,
        },
      },
    ],
    RaceStatus: {
      type: String,
      trim: true,
      default: "upcoming",
    },
    DayNTime: {
      type: String,
      required: true,
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
module.exports = mongoose.model("RaceModel", RaceModel);
