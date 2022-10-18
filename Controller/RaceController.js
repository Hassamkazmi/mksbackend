const RaceModel = require("../Models/RaceModel");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const RaceCourseModel = require("../Models/RaceCourseModel");
const TrainerModel = require("../Models/TrainerModel");
const JockeyModel = require("../Models/JockeyModel");
const OwnerModel = require("../Models/OwnerModel");
const HorseModel = require("../Models/HorseModel");
const { getObjectSignedUrl } = require("../Utils/s3");
const { Trainer, Jockey, Owner, Horse, RaceCourse } = require("../Utils/Path");

const Features = require("../Utils/Features");
exports.GetRace = Trackerror(async (req, res, next) => {
  let data = await RaceModel.find({ SoftDelete: 0 }).select("+SoftDelete");
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
  let RaceCourseData = [];
  console.log(data.length);

  for (let a = 0; a < data.length; a++) {
    for (let i = 0; i < data[a].Horses.length; i++) {
      let RaceCourseData = await RaceCourseModel.findById(data[a].RaceCourse);

      let HorseData = await HorseModel.find(data[a].Horses[i]);
      console.log(HorseData);

      HorseData[0].HorseImage = await getObjectSignedUrl(
        `${Horse}/${HorseData[0].HorseImage}`
      );
      // ActiveTrainerData = await TrainerModel.findById(
      //   HorseData[0].ActiveTrainer
      // );
      if (!ActiveTrainerData) {
        ActiveTrainerData.image = await getObjectSignedUrl(
          `${Trainer}/${ActiveTrainerData.image}`
        );
      }

      ActiveJockeyData = await JockeyModel.findById(HorseData[0].ActiveJockey);
      if (!ActiveJockeyData) {
        ActiveJockeyData.image = await getObjectSignedUrl(
          `${Jockey}/${ActiveJockeyData.image}`
        );
      }

      ActiveOwnerData = await OwnerModel.findById(HorseData[0].ActiveOwner);
      if (!ActiveOwnerData) {
        ActiveOwnerData.image = await getObjectSignedUrl(
          `${Owner}/${ActiveOwnerData.image}`
        );
      }

      TrainerData = await TrainerModel.find()
        .find()
        .where("_id")
        .in(HorseData[0].Trainer)
        .exec();
      JockeyData = await JockeyModel.find()
        .find()
        .where("_id")
        .in(HorseData[0].Jockey)
        .exec();
      OwnerData = await OwnerModel.find()
        .find()
        .where("_id")
        .in(HorseData[0].Owner)
        .exec();
      for (let j = 0; j < TrainerData.length; j++) {
        TrainerData[j].image = await getObjectSignedUrl(
          `${Trainer}/${TrainerData[j].image}`
        );
      }
      // for (let j = 0; j < RaceCourseData.length; j++) {
      //   RaceCourseData[j].image = await getObjectSignedUrl(
      //     `${RaceCourse}/${RaceCourseData[j].image}`
      //   );
      // }
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

      if (!HorseData[0].Sire) {
        SireData = "N/A";
      } else {
        SireData = await HorseModel.findbyId(HorseData[0].Sire);
      }
      if (!HorseData[0].GSire) {
        GSireData = "N/A";
      } else {
        GSireData = await HorseModel.findbyId(HorseData[0].GSire);
      }
      if (!HorseData[0].Dam) {
        DamData = "N/A";
      } else {
        DamData = await HorseModel.findbyId(HorseData[0].Dam);
      }
      RenderData.push({
        _id: data[a]._id,
        RaceStatus: data[a].RaceStatus,
        RaceKind: data[a].RaceKind,
        raceName: data[a].raceName,
        Description: data[a].Description,
        Weather: data[a].Weather,
        RaceCourseData: RaceCourseData,
        Horses: [
          {
            _id: HorseData[0]._id,
            HorseImage: HorseData[0].HorseImage,
            NameEn: HorseData[0].NameEn,
            Age: HorseData[0].Age,
            NameAr: HorseData[0].NameAr,
            Breeder: HorseData[0].Breeder,
            Remarks: HorseData[0].Remarks,
            HorseRating: HorseData[0].HorseRating,
            Sex: HorseData[0].Sex,
            Color: HorseData[0].Color,
            KindOfHorse: HorseData[0].KindOfHorse,
            OverAllRating: HorseData[0].OverAllRating,
            ActiveOwnerData: HorseData[0].ActiveOwnerData,
            ActiveJockeyData: HorseData[0].ActiveJockeyData,
            JockeyData: JockeyData,
            Owner: OwnerData,
            ActiveTrainer: HorseData[0].ActiveTrainerData,
            Trainer: TrainerData,
            ActiveTrainer: ActiveTrainerData,
            Sire: SireData,
            GSire: GSireData,
            Dam: DamData
          }
        ],

        DayNTime: data[a].DayNTime,
        created_at: data[a].created_at,
        updated_at: data[a].updated_at
      });
      console.log(RenderData);
    }
  }

  res.status(200).json({
    success: true,
    RenderData
  });
});

exports.SingleRace = Trackerror(async (req, res, next) => {
  let data = await RaceModel.findById(req.params.id);

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
  let RaceCourseData = [];
  console.log(data.length);

  for (let i = 0; i < data.Horses.length; i++) {
    let RaceCourseData = await RaceCourseModel.findById(data.RaceCourse);
    let HorseData = await HorseModel.find(data.Horses[i]);
    console.log(HorseData);

    HorseData[0].HorseImage = await getObjectSignedUrl(
      `${Horse}/${HorseData[0].HorseImage}`
    );

    ActiveTrainerData = await TrainerModel.findById(HorseData[0].ActiveTrainer);
    if (!ActiveTrainerData) {
      continue;
    } else {
      ActiveTrainerData.image = await getObjectSignedUrl(
        `${Trainer}/${ActiveTrainerData.image}`
      );
    }

    ActiveJockeyData = await JockeyModel.findById(HorseData[0].ActiveJockey);
    ActiveJockeyData.image = await getObjectSignedUrl(
      `${Jockey}/${ActiveJockeyData.image}`
    );
    ActiveOwnerData = await OwnerModel.findById(HorseData[0].ActiveOwner);
    ActiveOwnerData.image = await getObjectSignedUrl(
      `${Owner}/${ActiveOwnerData.image}`
    );
    TrainerData = await TrainerModel.find()
      .find()
      .where("_id")
      .in(HorseData[0].Trainer)
      .exec();
    JockeyData = await JockeyModel.find()
      .find()
      .where("_id")
      .in(HorseData[0].Jockey)
      .exec();
    OwnerData = await OwnerModel.find()
      .find()
      .where("_id")
      .in(HorseData[0].Owner)
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

    if (!HorseData[0].Sire) {
      SireData = "N/A";
    } else {
      SireData = await HorseModel.findbyId(HorseData[0].Sire);
    }
    if (!HorseData[0].GSire) {
      GSireData = "N/A";
    } else {
      GSireData = await HorseModel.findbyId(HorseData[0].GSire);
    }
    if (!HorseData[0].Dam) {
      DamData = "N/A";
    } else {
      DamData = await HorseModel.findbyId(HorseData[0].Dam);
    }
    RenderData.push({
      _id: data._id,
      RaceStatus: data.RaceStatus,
      RaceKind: data.RaceKind,
      raceName: data.raceName,
      Description: data.Description,
      Weather: data.Weather,
      RaceCourseData: RaceCourseData,
      Horses: [
        {
          _id: HorseData[0]._id,
          HorseImage: HorseData[0].HorseImage,
          NameEn: HorseData[0].NameEn,
          Age: HorseData[0].Age,
          NameAr: HorseData[0].NameAr,
          Breeder: HorseData[0].Breeder,
          Remarks: HorseData[0].Remarks,
          HorseRating: HorseData[0].HorseRating,
          Sex: HorseData[0].Sex,
          Color: HorseData[0].Color,
          KindOfHorse: HorseData[0].KindOfHorse,
          OverAllRating: HorseData[0].OverAllRating,
          ActiveOwnerData: HorseData[0].ActiveOwnerData,
          ActiveJockeyData: HorseData[0].ActiveJockeyData,
          JockeyData: JockeyData,
          Owner: OwnerData,
          ActiveTrainer: HorseData[0].ActiveTrainerData,
          Trainer: TrainerData,
          ActiveTrainer: ActiveTrainerData,
          Sire: SireData,
          GSire: GSireData,
          Dam: DamData
        }
      ],

      DayNTime: data.DayNTime,
      created_at: data.created_at,
      updated_at: data.updated_at
    });
    console.log(RenderData);
  }

  res.status(200).json({
    success: true,
    RenderData
  });
});
exports.CreateRace = Trackerror(async (req, res, next) => {
  const {
    RaceKind,
    raceName,
    Description,
    RaceCourse,
    Weather,
    Horses,
    Prizes,
    RaceStatus,
    DayNTime
  } = req.body;
  const HorsesData = await HorseModel.find()
    .find()
    .where("_id")
    .in(Horses)
    .exec();

  const RaceCourseData = await RaceCourseModel.findById(RaceCourse);
  if (!RaceCourseData) {
    return next(new HandlerCallBack("Race Course Data not found ", 404));
  }

  const data = await RaceModel.create({
    RaceKind: RaceKind,
    raceName: raceName,
    Description: Description,
    RaceCourse: RaceCourseData,
    Weather: Weather,
    Horses: HorsesData,
    Prizes: Prizes,
    RaceStatus: RaceStatus,
    DayNTime: DayNTime
  });

  res.status(200).json({
    success: true,
    data
  });
});
exports.EditRace = Trackerror(async (req, res, next) => {});
exports.DeleteRace = Trackerror(async (req, res, next) => {
  const data = await RaceModel.findById(req.params.id);

  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  await data.remove();
  res.status(200).json({
    success: true,
    message: "data Delete Successfully"
  });
});
