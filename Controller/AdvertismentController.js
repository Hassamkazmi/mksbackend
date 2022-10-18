const AdvertismentModel = require("../Models/AdvertismentModel");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const { Ads } = require("../Utils/Path");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { ArRegex } = require("../Utils/ArabicLanguageRegex");
const Features = require("../Utils/Features");

exports.CreateAdvertisment = Trackerror(async (req, res, next) => {
  const { DescriptionEn, DescriptionAr, TitleEn, TitleAr } = req.body;
  if (
    ArRegex.test(DescriptionAr) &&
    ArRegex.test(TitleAr) &&
    ArRegex.test(DescriptionEn) == false &&
    ArRegex.test(TitleEn) == false
  ) {
    const file = req.files.image;
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Ads}/${Image}`, file.mimetype);

    const data = await AdvertismentModel.create({
      image: Image,
      DescriptionEn: DescriptionEn,
      DescriptionAr: DescriptionAr,
      TitleEn: TitleEn,
      TitleAr: TitleAr
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
exports.AdsGet = Trackerror(async (req, res, next) => {
  const resultPerPage = Number(req.query.limit);
  const ValuetobesearchedString = [
    "DescriptionEn",
    "DescriptionAr",
    "TitleEn",
    "TitleAr"
  ];
  const dataCount = await AdvertismentModel.countDocuments();
  const Feature = new Features(
    AdvertismentModel.find({ SoftDelete: 0 }).select("+SoftDelete"),
    req.query,
    ValuetobesearchedString,
    null
  )
    .searching()
    .filter();

  let data = await Feature.query;
  let filtereddataCount = data.length;
  Feature.pagination(Number(req.query.limit));
  data = await Feature.query;
  for (let i = 0; i < data.length; i++) {
    console.log(
      (data[i].image = await getObjectSignedUrl(`${Ads}/${data[i].image}`))
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
exports.GetAdsAdmin = Trackerror(async (req, res, next) => {});
exports.EditAds = Trackerror(async (req, res, next) => {
  const file = req.files.image;
  const { DescriptionEn, DescriptionAr, TitleEn, TitleAr } = req.body;
  let data = await AdvertismentModel.findById(req.params.id);
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  if (req.files == null) {
    if (
      ArRegex.test(DescriptionAr) &&
      ArRegex.test(TitleAr) &&
      ArRegex.test(DescriptionEn) == false &&
      ArRegex.test(TitleEn) == false
    ) {
      data = await AdvertismentModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false
        }
      );
    } else {
      return next(
        new HandlerCallBack("Please Fill Data To appropiate fields", 404)
      );
    }
  } else {
    await deleteFile(`${Ads}/${data.image}`);
    const Image = generateFileName();
    const fileBuffer = await resizeImageBuffer(req.files.image.data, 214, 212);
    await uploadFile(fileBuffer, `${Ads}/${Image}`, file.mimetype);

    const updateddata = {
      image: Image,
      DescriptionEn: DescriptionEn || data.DescriptionEn,
      DescriptionAr: DescriptionAr || data.DescriptionAr,
      TitleEn: TitleEn || data.TitleEn,
      TitleAr: TitleAr || data.TitleAr
    };
    if (
      ArRegex.test(updateddata.DescriptionAr) &&
      ArRegex.test(updateddata.TitleAr) &&
      ArRegex.test(updateddata.DescriptionEn) == false &&
      ArRegex.test(updateddata.TitleEn) == false
    ) {
      data = await AdvertismentModel.findByIdAndUpdate(
        req.params.id,
        updateddata,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false
        }
      );
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
exports.DeleteAds = Trackerror(async (req, res, next) => {
  const data = await AdvertismentModel.findById(req.params.id);

  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  await deleteFile(`${Ads}/${data.image}`);

  await data.remove();

  res.status(200).json({
    success: true,
    message: "data Delete Successfully"
  });
});
exports.SoftDelete = Trackerror(async (req, res, next) => {
  let data = await AdvertismentModel.findById(req.params.id, {
    SoftDelete: 0
  }).select("+SoftDelete");
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  data = await AdvertismentModel.findByIdAndUpdate(
    req.params.id,
    { SoftDelete: 1 },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false
    }
  ).select("+SoftDelete");
  res.status(200).json({
    success: true,
    message: "data soft Deleted Successfully"
  });
});
exports.AdsGetlive = Trackerror(async (req, res, next) => {
  const resultPerPage = Number(req.query.limit);
  const ValuetobesearchedString = [
    "DescriptionEn",
    "DescriptionAr",
    "TitleEn",
    "TitleAr"
  ];
  const dataCount = await AdvertismentModel.countDocuments();
  const Feature = new Features(
    AdvertismentModel.find({ SoftDelete: 0 }).select("+SoftDelete"),
    req.query,
    ValuetobesearchedString,
    null
  )
    .searching()
    .filter();

  let data = await Feature.query;
  let filtereddataCount = data.length;
  Feature.pagination(Number(req.query.limit));
  data = await Feature.query;
  for (let i = 0; i < data.length; i++) {
    console.log(
      (data[i].image = await getObjectSignedUrl(`${Ads}/${data[i].image}`))
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
