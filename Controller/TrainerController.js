const TrainerModel = require("../Models/TrainerModel");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Trainer } = require("../Utils/Path");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const Features = require("../Utils/Features");
exports.GetTrainer = Trackerror(async (req, res, next) => {
  const resultPerPage = Number(req.query.limit);
  const ValuetobesearchedString = ["Name", "Detail", "Remarks"];
  const ValuetobesearchedNumber = ["Age"];
  const dataCount = await TrainerModel.countDocuments();
  const Feature = new Features(
    TrainerModel.find({ SoftDelete: 0 }).select("+SoftDelete"),
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
    data[i].image = await getObjectSignedUrl(`${Trainer}/${data[i].image}`);
  }
  res.status(200).json({
    success: true,
    data,
    dataCount,
    resultPerPage,
    filtereddataCount,
  });
});
exports.CreateTrainer = Trackerror(async (req, res, next) => {
  const { Name, Age, Detail, Remarks } = req.body;
  const file = req.files.image;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
  await uploadFile(fileBuffer, `${Trainer}/${Image}`, file.mimetype);

  const data = await TrainerModel.create({
    image: Image,
    Name: Name,
    Age: Age,
    Detail: Detail,
    Remarks: Remarks,
  });

  res.status(201).json({
    success: true,
    data,
  });
});
exports.UpdateTrainer = Trackerror(async (req, res, next) => {
  const file = req.files.image;
  const { Name, Age, Detail, Remarks } = req.body;
  let data = await TrainerModel.findById(req.params.id);
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    data = await TrainerModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    await deleteFile(`${Trainer}/${data.image}`);
    let Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Trainer}/${Image}`, file.mimetype);

    const updateddata = {
      image: Image,
      Name: Name || data.Name,
      Age: Age || data.Age,
      Detail: Detail || data.Detail,
      Remarks: Remarks || data.Remarks,
    };
    data = await TrainerModel.findByIdAndUpdate(req.params.id, updateddata, {
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
exports.SingleTrainer = Trackerror(async (req, res, next) => {
  let data = await TrainerModel.findById(req.params.id);
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  data.image = await getObjectSignedUrl(`${Trainer}/${data.image}`);
  res.status(200).json({
    success: true,
    data,
  });
});
exports.DeleteTrainer = Trackerror(async (req, res, next) => {
  const data = await TrainerModel.findById(req.params.id);

  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  await deleteFile(`${Trainer}/${data.image}`);

  await data.remove();

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
// aws dax cluster on nodejs ?
