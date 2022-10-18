const mongoose = require("mongoose");
const NewsModel = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, " Enter Image "],
    },

    DescriptionEn: {
      type: String,
      trim: true,
      required: [true, "Enter English Description  "],
    },
    DescriptionAr: {
      type: String,
      trim: true,
      required: [true, "Enter Arabic Description  "],
    },
    TitleEn: {
      type: String,
      trim: true,
      required: [true, " English English Title  "],
    },
    TitleAr: {
      type: String,
      trim: true,
      required: [true, " Enter Arabic  Title "],
    },
    SecondTitleEn: {
      type: String,
      trim: true,
      required: [true, "enter  English SecondTitle  "],
    },
    SecondTitleAr: {
      type: String,
      trim: true,
      required: [true, "Enter Arabic  SecondTitle  "],
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
NewsModel.statics.search = function(searchTerm) {
  const stringSearchFields = ['DescriptionEn', 'DescriptionAr'];
  const numberSearchFields = ['image'];
  const query = {
      $or: [
          ...stringSearchFields.map(field => ({
              [field]: new RegExp('^' + searchTerm, 'i')
          })),
          ...numberSearchFields.map(field => ({
              $where: `/^${searchTerm}.*/.test(this.${field})`
          }))
      ]
  };
  return this.find(query);
};
module.exports = mongoose.model("NewsModel", NewsModel);
