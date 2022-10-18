const JockeyModel = require("../Models/JockeyModel");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Jockey } = require("../Utils/Path");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const Features = require("../Utils/Features");
exports.CreateJockey = Trackerror(async (req, res, next) => {
  const { Name, Age, Rating } = req.body;
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Jockey}/${Image}`, file.mimetype);

  const data = await JockeyModel.create({
    image: Image,
    Name: Name,
    Age: Age,
    Rating: Rating,
  });

  res.status(201).json({
    success: true,
    data,
  });
});
exports.SingleJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findById(req.params.id);
  if (!data) {
    return new next("horse is not available", 404);
  } else {
    for (let i = 0; i < data.length; i++) {
      data[i].image = await getObjectSignedUrl(`${Jockey}/${data[i].image}`);
    }
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.GetJockey = Trackerror(async (req, res, next) => {
  const resultPerPage = Number(req.query.limit);
  const ValuetobesearchedString = ["Name"];
  const ValuetobesearchedNumber = ["Rating", "Age"];
  const dataCount = await JockeyModel.countDocuments();
  const Feature = new Features(
    JockeyModel.find(),
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
    data[i].image = await getObjectSignedUrl(`${Jockey}/${data[i].image}`);
  }
  res.status(200).json({
    success: true,
    data,
    dataCount,
    resultPerPage,
    filtereddataCount,
  });
});
exports.EditJockey = Trackerror(async (req, res, next) => {
  const file = req.files.image;
  const { Name, Age, Rating } = req.body;
  let data = await JockeyModel.findById(req.params.id);
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    data = await JockeyModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    await deleteFile(`${Jockey}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Jockey}/${Image}`, file.mimetype);

    const updateddata = {
      image: Image,
      Name: Name || data.Name,
      Age: Age || data.Age,
      Rating: Rating || data.Rating,
    };
    data = await JockeyModel.findByIdAndUpdate(req.params.id, updateddata, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      data,
    });
  }
});
exports.DeleteJockey = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findById(req.params.id);

  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  await deleteFile(`${Jockey}/${data.image}`);

  await data.remove();

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
