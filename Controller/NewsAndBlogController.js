const NewsModel = require("../Models/NewsModel");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { News } = require("../Utils/Path");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const Features = require("../Utils/Features");
exports.CreateNewsAndBlog = Trackerror(async (req, res, next) => {
  const {
    DescriptionEn,
    DescriptionAr,
    TitleEn,
    TitleAr,
    SecondTitleEn,
    SecondTitleAr
  } = req.body;
  if (
    ArRegex.test(DescriptionAr) &&
    ArRegex.test(TitleAr) &&
    ArRegex.test(SecondTitleAr) &&
    ArRegex.test(DescriptionEn) == false &&
    ArRegex.test(TitleEn) == false &&
    ArRegex.test(SecondTitleEn) == false
  ) {
    const file = req.files.image;
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${News}/${Image}`, file.mimetype);
    const data = await NewsModel.create({
      image: Image,
      DescriptionEn: DescriptionEn,
      DescriptionAr: DescriptionAr,
      TitleEn: TitleEn,
      TitleAr: TitleAr,
      SecondTitleEn: SecondTitleEn,
      SecondTitleAr: SecondTitleAr
    });
    res.status(201).json({
      success: true,
      data
    });
  } else {
    return next(
      new HandlerCallBack("Please Fill Data To appropiate fields", 404)
    );
  }
});
exports.SearchNews = Trackerror(async (req, res, next) => {
  const resultPerPage = Number(req.query.limit);
  const ValuetobesearchedString = [
    "DescriptionEn",
    "DescriptionAr",
    "TitleEn",
    "TitleAr",
    "SecondTitleEn",
    "SecondTitleAr"
  ];
  const dataCount = await NewsModel.countDocuments();
  const Feature = new Features(
    NewsModel.find(),
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
      (data[i].image = await getObjectSignedUrl(`${News}/${data[i].image}`))
    );
  }
  res.status(200).json({
    success: true,
    data,
    dataCount,
    resultPerPage,
    filtereddataCount
  });
});
exports.NewsGet = Trackerror(async (req, res, next) => {
  const resultPerPage = Number(req.query.limit);
  const ValuetobesearchedString = [
    "DescriptionEn",
    "DescriptionAr",
    "TitleEn",
    "TitleAr",
    "SecondTitleEn",
    "SecondTitleAr"
  ];
  const dataCount = await NewsModel.countDocuments();
  const Feature = new Features(
    NewsModel.find({ SoftDelete: 0 }).select("+SoftDelete"),
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
      (data[i].image = await getObjectSignedUrl(`${News}/${data[i].image}`))
    );
  }
  res.status(200).json({
    success: true,
    data,
    dataCount,
    resultPerPage,
    filtereddataCount
  });
});

exports.EditNews = Trackerror(async (req, res, next) => {
  const file = req.files.image;
  const {
    DescriptionEn,
    DescriptionAr,
    TitleEn,
    TitleAr,
    SecondTitleEn,
    SecondTitleAr
  } = req.body;
  let data = await NewsModel.findById(req.params.id);
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    if (
      ArRegex.test(DescriptionAr) &&
      ArRegex.test(TitleAr) &&
      ArRegex.test(SecondTitleAr) &&
      ArRegex.test(DescriptionEn) == false &&
      ArRegex.test(TitleEn) == false &&
      ArRegex.test(SecondTitleEn) == false
    ) {
      data = await NewsModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
      });
    } else {
      return next(
        new HandlerCallBack("Please Fill Data To appropiate fields", 404)
      );
    }
  } else {
    await deleteFile(`${News}/${data.image}`);
    let Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${News}/${Image}`, file.mimetype);
    Image = await getObjectSignedUrl(`${News}/${Image}`);
    const updateddata = {
      image: Image,
      DescriptionEn: DescriptionEn || data.DescriptionEn,
      DescriptionAr: DescriptionAr || data.DescriptionAr,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr,
      SecondTitleEn: SecondTitleEn || data.SecondTitleEn,
      SecondTitleAr: SecondTitleAr || data.SecondTitleAr
    };
    if (
      ArRegex.test(updateddata.DescriptionAr) &&
      ArRegex.test(updateddata.TitleAr) &&
      ArRegex.test(updateddata.SecondTitleAr) &&
      ArRegex.test(updateddata.DescriptionEn) == false &&
      ArRegex.test(updateddata.TitleEn) == false &&
      ArRegex.test(updateddata.SecondTitleEn) == false
    ) {
      data = await NewsModel.findByIdAndUpdate(req.params.id, updateddata, {
        new: true,
        runValidators: true,
        useFindAndModify: false
      });
    } else {
      return next(
        new HandlerCallBack("Please Fill Data To appropiate fields", 404)
      );
    }
    res.status(200).json({
      success: true,
      data
    });
  }
});
exports.DeleteNews = Trackerror(async (req, res, next) => {
  const data = await NewsModel.findById(req.params.id);

  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  await deleteFile(`${News}/${data.image}`);

  await data.remove();

  res.status(200).json({
    success: true,
    message: "data Delete Successfully"
  });
});
