const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const OwnerModel = require("../Models/OwnerModel");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { Owner } = require("../Utils/Path");
const Features = require("../Utils/Features");
exports.CreateOwner = Trackerror(async (req, res, next) => {
  const { Name, Horses, Rating } = req.body;
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Owner}/${Image}`, file.mimetype);

  const data = await OwnerModel.create({
    image: Image,
    Name: Name,
    Horses: Horses,
    Rating: Rating,
  });

  res.status(201).json({
    success: true,
    data,
  });
});
exports.UpdateOwnerDetail = Trackerror(async (req, res, next) => {});
exports.UpdateOwnerHorse = Trackerror(async (req, res, next) => {});
exports.ViewAllOwner = Trackerror(async (req, res, next) => {
  const resultPerPage = Number(req.query.limit);
  const ValuetobesearchedString = ["Name"];
  const ValuetobesearchedNumber = [];
  const dataCount = await OwnerModel.countDocuments();
  const Feature = new Features(
    OwnerModel.find(),
    req.query,
    ValuetobesearchedString,
    null
  )
    .searching()
    .filter();

  let data = await Feature.query;
  let filtereddataCount = data.length;
  Feature.pagination(resultPerPage);
  data = await Feature.query;
  for (let i = 0; i < data.length; i++) {
    data[i].image = await getObjectSignedUrl(`${Owner}/${data[i].image}`);
  }
  res.status(200).json({
    success: true,
    data,
    dataCount,
    resultPerPage,
    filtereddataCount,
  });
});
exports.ViewASingleOwner = Trackerror(async (req, res, next) => {
  const data = await OwnerModel.findById(req.params.id);
  if (!data) {
    return new next("horse is not available", 404);
  } else {
    for (let i = 0; i < data.length; i++) {
      data[i].image = await getObjectSignedUrl(`${Owner}/${data[i].image}`);
    }
    res.status(200).json({
      success: true,
      data,
    });
  }
});
