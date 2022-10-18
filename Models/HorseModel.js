const mongoose = require("mongoose");
// race course name flag  day time  raceName  raceType   race kind  weather track length   description prizeswith ranks  (total)
// horse name nationality  age  gender  color (rating) history
// overall rating
//jockey  nationality weight historyonly by rank age rating
// owner history
//trainer history
// c d cl bf
//breeder
//pedigree
// earning
// career of horse
// horse last three games history
const HorseModel = new mongoose.Schema(
  {
    HorseImage: {
      type: String,
      required: [true, "please enter horse image"]
    },
    ActiveOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "OwnerModel",
      required: [true, "please enter Owner"]
    },
    Owner: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "OwnerModel",
        required: [true, "please enter Owner"]
      }
    ],
    ActiveJockey: {
      type: mongoose.Schema.ObjectId,
      ref: "JockeyModel",
      required: [true, "please enter Jockey"]
    },
    Jockey: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "JockeyModel",
        required: [true, "please enter Jockey"]
      }
    ],

    Age: {
      type: Number,
      required: [true, "Enter Age"]
    },
    NameEn: {
      type: String,
      trim: true,
      required: [true, "Enter Name in English"]
    },
    NameAr: {
      type: String,
      trim: true,
      required: [true, "Enter Name in Arabic"]
    },

    ActiveTrainer: {
      type: mongoose.Schema.ObjectId,
      required: [true, "please enter active trainer"]
    },
    Breeder: {
      type: String,
      trim: true,
      required: [true, "enter  Breeder"]
    },
    Trainer: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "TrainerModel"
      }
    ],
    Remarks: {
      type: String,
      trim: true,
      required: [true, "enter  Remarks"]
    },
    HorseRating: {
      type: Number,
      required: [true, "please enter Rating"]
    },
    Sex: {
      type: String,
      trim: true,
      required: [true, "enter Sex"]
    },
    Color: {
      type: String,
      trim: true,
      required: [true, "enter Color "]
    },
    KindOfHorse: {
      type: String,
      trim: true,
      required: [true, "enter KindOfHorse"]
    },
    Dam: {
      type: mongoose.Schema.ObjectId,
      ref: "HorseModel",
      default: null
    },
    Sire: {
      type: mongoose.Schema.ObjectId,
      ref: "HorseModel",
      default: null
    },
    GSire: {
      type: mongoose.Schema.ObjectId,
      ref: "HorseModel",
      default: null
    },
    Earning: {
      type: Number
    },

    History: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "RaceModel"
      }
    ],
    OverAllRating: {
      type: Number,
      required: [true, "please enter overall rating"]
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
module.exports = mongoose.model("HorseModel", HorseModel);
