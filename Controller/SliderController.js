const SliderModel = require("../Models/SliderModel");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Slider } = require("../Utils/Path");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const Features = require("../Utils/Features");
exports.CreateSlider = Trackerror(async (req, res, next) => {
  const { TitleEn, TitleAr } = req.body;

  if (ArRegex.test(TitleAr) && ArRegex.test(TitleEn) == false) {
    const file = req.files.image;
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 1000, 400);
    await uploadFile(fileBuffer, `${Slider}/${Image}`, file.mimetype);
    const data = await SliderModel.create({
      image: Image,
      TitleEn: TitleEn,
      TitleAr: TitleAr,
    });
    res.status(201).json({
      success: true,
      data,
    });
  } else {
    return next(
      new HandlerCallBack("Please Fill Data To appropiate fields", 404)
    );
  }
  res.status(201).json({
    success: true,
    data,
  });
});
exports.SliderGet = Trackerror(async (req, res, next) => {
  const resultPerPage = Number(req.query.limit);
  const ValuetobesearchedString = ["TitleEn", "TitleAr"];
  const dataCount = await SliderModel.countDocuments();
  const Feature = new Features(
    SliderModel.find({ SoftDelete: 0 }).select("+SoftDelete"),
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
    console.log(
      (data[i].image = await getObjectSignedUrl(`${Slider}/${data[i].image}`))
    );
  }
  res.status(200).json({
    success: true,
    data,
    dataCount,
    resultPerPage,
    filtereddataCount,
  });
});
exports.GetSliderAdmin = Trackerror(async (req, res, next) => {});
exports.EditSlider = Trackerror(async (req, res, next) => {
  const file = req.files.image;
  const { TitleEn, TitleAr } = req.body;
  let data = await SliderModel.findById(req.params.id);
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    data = await SliderModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      data,
    });
  } else {
    await deleteFile(`${Slider}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 1000, 400);
    await uploadFile(fileBuffer, `${Slider}/${Image}`, file.mimetype);

    const updateddata = {
      image: Image,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr,
    };
    data = await SliderModel.findByIdAndUpdate(req.params.id, updateddata, {
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
exports.DeleteSlider = Trackerror(async (req, res, next) => {
  const data = await SliderModel.findById(req.params.id);

  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  await deleteFile(`${Slider}/${data.image}`);

  await data.remove();

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
