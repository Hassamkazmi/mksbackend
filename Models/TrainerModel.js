const mongoose = require("mongoose");
const TrainerModel = new mongoose.Schema(
  {
    Name: {
      type: String,
      trim: true,
      required: [true, "please enter trainer name"]
    },
    Age: {
      type: Number,
      maxlength: 2,
      required: [true, "please enter trainer age"]
    },
    Detail: {
      type: String,
      trim: true,
      required: [true, "please enter trainer detail"]
    },
    Remarks: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true,
      required: [true, "please enter trainer image"]
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
module.exports = mongoose.model("TrainerModel", TrainerModel);
