const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const TrainerModel = require("../Models/TrainerModel");
const HorseModel = require("../Models/HorseModel");
const OwnerModel = require("../Models/OwnerModel");
const Features = require("../Utils/Features");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const { Jockey, Horse, Trainer, Owner } = require("../Utils/Path");
const JockeyModel = require("../Models/JockeyModel");
exports.GetHorse = Trackerror(async (req, res, next) => {
  const resultPerPage = req.params.limit;
  const ValuetobesearchedString = ["DescriptionAr", "NameEn", "NameAr"];
  const ValuetobesearchedNumber = ["Age"];
  const dataCount = await HorseModel.countDocuments();
  const Feature = new Features(
    HorseModel.find(),
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

  let ActiveOwnerData = [{}];
  let ActiveJockeyData = [{}];
  let JockeyData = [{}];
  let TrainerData = [{}];
  let ActiveTrainerData = [];
  let SireData = [{}];
  let DamData = [{}];
  let GSireData = [{}];
  let OwnerData = [{}];
  let RenderData = [];
  for (let i = 0; i < data.length; i++) {
    data[i].HorseImage = await getObjectSignedUrl(
      `${Horse}/${data[i].HorseImage}`
    );

    ActiveTrainerData = await TrainerModel.findById(data[i].ActiveTrainer);
    ActiveTrainerData.image = await getObjectSignedUrl(
      `${Trainer}/${ActiveTrainerData.image}`
    );
    ActiveJockeyData = await JockeyModel.findById(data[i].ActiveJockey);
    ActiveJockeyData.image = await getObjectSignedUrl(
      `${Jockey}/${ActiveJockeyData.image}`
    );
    ActiveOwnerData = await OwnerModel.findById(data[i].ActiveOwner);
    ActiveOwnerData.image = await getObjectSignedUrl(
      `${Owner}/${ActiveOwnerData.image}`
    );
    TrainerData = await TrainerModel.find()
      .find()
      .where("_id")
      .in(data[i].Trainer)
      .exec();
    JockeyData = await JockeyModel.find()
      .find()
      .where("_id")
      .in(data[i].Jockey)
      .exec();
    OwnerData = await OwnerModel.find()
      .find()
      .where("_id")
      .in(data[i].Owner)
      .exec();
    for (let j = 0; j < TrainerData.length; j++) {
      TrainerData[j].image = await getObjectSignedUrl(
        `${Trainer}/${TrainerData[j].image}`
      );
    }
    for (let j = 0; j < OwnerData.length; j++) {
      OwnerData[j].image = await getObjectSignedUrl(
        `${Owner}/${OwnerData[j].image}`
      );
    }
    for (let j = 0; j < JockeyData.length; j++) {
      JockeyData[j].image = await getObjectSignedUrl(
        `${Jockey}/${JockeyData[j].image}`
      );
    }

    if (!data[i].Sire) {
      SireData = "N/A";
    } else {
      SireData = await HorseModel.findbyId(data[i].Sire);
    }
    if (!data[i].GSire) {
      GSireData = "N/A";
    } else {
      GSireData = await HorseModel.findbyId(data[i].GSire);
    }
    if (!data[i].Dam) {
      DamData = "N/A";
    } else {
      DamData = await HorseModel.findbyId(data[i].Dam);
    }
    RenderData.push({
      _id: data[i]._id,
      HorseImage: data[i].HorseImage,
      NameEn: data[i].NameEn,
      Age: data[i].Age,
      NameAr: data[i].NameAr,
      Breeder: data[i].Breeder,
      Remarks: data[i].Remarks,
      HorseRating: data[i].HorseRating,
      Sex: data[i].Sex,
      Color: data[i].Color,
      KindOfHorse: data[i].KindOfHorse,
      OverAllRating: data[i].OverAllRating,
      ActiveOwnerData: data[i].ActiveOwnerData,
      ActiveJockeyData: data[i].ActiveJockeyData,
      JockeyData: JockeyData,
      Owner: OwnerData,
      ActiveTrainer: data[i].ActiveTrainerData,
      Trainer: TrainerData,
      ActiveTrainer: ActiveTrainerData,
      Sire: SireData,
      GSire: GSireData,
      Dam: DamData,
    });
  }

  res.status(200).json({
    success: true,
    RenderData,
    dataCount,
    resultPerPage,
    filtereddataCount,
  });
});
exports.SingleHorse = Trackerror(async (req, res, next) => {
  const data = await HorseModel.findById(req.params.id);
  if (!data) {
    return new next("horse is not available", 404);
  } else {
    let ActiveOwnerData = [{}];
    let ActiveJockeyData = [{}];
    let JockeyData = [{}];
    let TrainerData = [{}];
    let ActiveTrainerData = [];
    let SireData = [{}];
    let DamData = [{}];
    let GSireData = [{}];
    let OwnerData = [{}];
    let RenderData = [];

    data.HorseImage = await getObjectSignedUrl(`${Horse}/${data.HorseImage}`);

    ActiveTrainerData = await TrainerModel.findById(data.ActiveTrainer);
    ActiveTrainerData.image = await getObjectSignedUrl(
      `${Trainer}/${ActiveTrainerData.image}`
    );
    ActiveJockeyData = await JockeyModel.findById(data.ActiveJockey);
    ActiveJockeyData.image = await getObjectSignedUrl(
      `${Jockey}/${ActiveJockeyData.image}`
    );
    ActiveOwnerData = await OwnerModel.findById(data.ActiveOwner);
    ActiveOwnerData.image = await getObjectSignedUrl(
      `${Owner}/${ActiveOwnerData.image}`
    );
    TrainerData = await TrainerModel.find()
      .find()
      .where("_id")
      .in(data.Trainer)
      .exec();
    JockeyData = await JockeyModel.find()
      .find()
      .where("_id")
      .in(data.Jockey)
      .exec();
    OwnerData = await OwnerModel.find()
      .find()
      .where("_id")
      .in(data.Owner)
      .exec();
    for (let j = 0; j < TrainerData.length; j++) {
      TrainerData[j].image = await getObjectSignedUrl(
        `${Trainer}/${TrainerData[j].image}`
      );
    }
    for (let j = 0; j < OwnerData.length; j++) {
      OwnerData[j].image = await getObjectSignedUrl(
        `${Owner}/${OwnerData[j].image}`
      );
    }
    for (let j = 0; j < JockeyData.length; j++) {
      JockeyData[j].image = await getObjectSignedUrl(
        `${Jockey}/${JockeyData[j].image}`
      );
    }

    if (!data.Sire) {
      SireData = "N/A";
    } else {
      SireData = await HorseModel.findbyId(data.Sire);
    }
    if (!data.GSire) {
      GSireData = "N/A";
    } else {
      GSireData = await HorseModel.findbyId(data.GSire);
    }
    if (!data.Dam) {
      DamData = "N/A";
    } else {
      DamData = await HorseModel.findbyId(data.Dam);
    }
    RenderData.push({
      _id: data._id,
      HorseImage: data.HorseImage,
      NameEn: data.NameEn,
      Age: data.Age,
      NameAr: data.NameAr,
      Breeder: data.Breeder,
      Remarks: data.Remarks,
      HorseRating: data.HorseRating,
      Sex: data.Sex,
      Color: data.Color,
      KindOfHorse: data.KindOfHorse,
      OverAllRating: data.OverAllRating,
      ActiveOwnerData: data.ActiveOwnerData,
      ActiveJockeyData: data.ActiveJockeyData,
      JockeyData: JockeyData,
      Owner: OwnerData,
      ActiveTrainer: data.ActiveTrainerData,
      Trainer: TrainerData,
      ActiveTrainer: ActiveTrainerData,
      Sire: SireData,
      GSire: GSireData,
      Dam: DamData,
    });

    res.status(200).json({
      success: true,
      RenderData,
    });
  }
});
exports.CreateHorse = Trackerror(async (req, res, next) => {
  const {
    Age,
    NameEn,
    NameAr,
    Owner,
    ActiveTrainer,
    Breeder,
    Trainer,
    Remarks,
    HorseRating,
    Sex,
    Color,
    KindOfHorse,
    Dam,
    Sire,
    GSire,
    Earning,
    History,
    OverAllRating,
    ActiveJockey,
    ActiveOwner,
    Jockey,
  } = req.body;

  let TrainerData = await TrainerModel.find()
    .find()
    .where("_id")
    .in(Trainer)
    .exec();
  let OwnerData = await OwnerModel.find().find().where("_id").in(Owner).exec();
  let JockeyData = await JockeyModel.find()
    .find()
    .where("_id")
    .in(Jockey)
    .exec();
  const ActiveTrainerData = await TrainerModel.findById(ActiveTrainer);
  if (!ActiveTrainerData) {
    return next(
      new HandlerCallBack("Current Trainer Is not in the Database", 404)
    );
  }
  const ActiveJockeyData = await JockeyModel.findById(ActiveJockey);
  if (!ActiveJockeyData) {
    return next(
      new HandlerCallBack("Current Jockey Is not in the Database", 404)
    );
  }
  const ActiveOwnerData = await OwnerModel.findById(ActiveOwner);
  if (!ActiveOwnerData) {
    return next(
      new HandlerCallBack("Current Owner Is not in the Database", 404)
    );
  }
  const SireData = await HorseModel.findById(Sire);
  const GSireData = await HorseModel.findById(GSire);
  const DameSireData = await HorseModel.findById(Dam);
  const file = req.files.HorseImage;
  const Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(
    req.files.HorseImage.data,
    214,
    212
  );
  await uploadFile(fileBuffer, `${Horse}/${Image}`, file.mimetype);

  const data = await HorseModel.create({
    HorseImage: Image,
    NameEn: NameEn,
    Age: Age,
    NameAr: NameAr,
    Owner: OwnerData,
    ActiveTrainer: ActiveTrainerData,
    Breeder: Breeder,
    Trainer: TrainerData,
    Remarks: Remarks,
    HorseRating: HorseRating,
    Sex: Sex,
    Color: Color,
    KindOfHorse: KindOfHorse,
    Dam: DameSireData,
    Sire: SireData,
    GSire: GSireData,
    Earning: Earning,
    History: History,
    OverAllRating: OverAllRating,
    ActiveJockey: ActiveJockeyData,
    Jockey: JockeyData,
    ActiveOwner: ActiveOwnerData,
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.UpdateHorse = Trackerror(async (req, res, next) => {});
exports.DeleteHorse = Trackerror(async (req, res, next) => {
  const data = await JockeyModel.findById(req.params.id);

  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }

  await data.remove();

  res.status(200).json({
    success: true,
    message: "data Delete Successfully",
  });
});
