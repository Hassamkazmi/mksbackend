const RaceCourseModel = require("../Models/RaceCourseModel");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const Features = require("../Utils/Features");
const { RaceCourse } = require("../Utils/Path");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
exports.GetCourse = Trackerror(async (req, res, next) => {
  const resultPerPage = Number(req.query.limit);
  const ValuetobesearchedString = [
    "Country",
    "TrackName",
    "TrackLength",
    "TitleAr",
  ];
  const dataCount = await RaceCourseModel.countDocuments();
  const Feature = new Features(
    RaceCourseModel.find({ SoftDelete: 0 }).select("+SoftDelete"),
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
    data[i].image = await getObjectSignedUrl(`${RaceCourse}/${data[i].image}`);
  }
  res.status(200).json({
    success: true,
    data,
    dataCount,
    resultPerPage,
    filtereddataCount,
  });
});
exports.SingleRaceCourse = Trackerror(async (req, res, next) => {
  let data = await RaceCourseModel.findById(req.params.id);
  data.image = await getObjectSignedUrl(`${RaceCourse}/${data.image}`);
  res.status.json({
    success: true,
    data,
  });
});
exports.CreateRaceCourse = Trackerror(async (req, res, next) => {
  const { Country, TrackName, TrackLength } = req.body;

  const file = req.files.image;
  let Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${RaceCourse}/${Image}`, file.mimetype);

  const data = await RaceCourseModel.create({
    image: Image,
    Country: Country,
    TrackName: TrackName,
    TrackLength: TrackLength,
  });
  res.status(201).json({
    success: true,
    data,
  });
});
exports.UpdateCourse = Trackerror(async (req, res, next) => {
  let data = await RaceCourseModel.findById(req.params.id);
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  data = await RaceCourseModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.DeleteCourse = Trackerror(async (req, res, next) => {
  const data = await RaceCourseModel.findById(req.params.id);
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  await data.remove();
  res.status(200).json({
    success: true,
    message: "Course Delete Successfully",
  });
});
