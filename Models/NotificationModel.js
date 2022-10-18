const mongoose = require("mongoose");
const NotificationModel = new mongoose.Schema(
  {
    UserId: {
      type:  mongoose.Schema.ObjectId,
      ref: "SubscriberModel",
    },
    HorseId: {
      type:  mongoose.Schema.ObjectId,
      ref: "HorseModel",
    },
    message: {
      type: String,
      trim: true,
    },
    Time: {
      type: Date,
      default: Date.now,
    },
    
    SoftDelete: {
      type: Boolean,
      default: 0,
      select: false
    }
  },
  {
    autoIndex: true,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
module.exports = mongoose.model("NotificationModel", NotificationModel);
