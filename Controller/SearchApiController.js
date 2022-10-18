const TrainerModel = require("../Models/TrainerModel");
const JockeyModel = require("../Models/JockeyModel");
const HorseModel = require("../Models/AdvertismentModel");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const Features = require("../Utils/Features");
exports.SearchApi = Trackerror(async (req, res, next) => {
  const resultPerPage = Number(req.query.limit);
  const ValuetobesearchedStringTrainer = ["Name"];
  const FeatureTrainer = new Features(
    TrainerModel.find({ SoftDelete: 0 }).select("+SoftDelete"),
    req.query,
    ValuetobesearchedStringTrainer,
    null
  )
    .searching()
    .filter();

  let dataTrainer = await FeatureTrainer.query;
  FeatureTrainer.pagination(resultPerPage);
  dataTrainer = await FeatureTrainer.query;
  const ValuetobesearchedStringJockey = ["Name"];
  const FeatureJockey = new Features(
    JockeyModel.find({ SoftDelete: 0 }).select("+SoftDelete"),
    req.query,
    ValuetobesearchedStringJockey,
    null
  )
    .searching()
    .filter();

  let dataJockey = await FeatureJockey.query;
  FeatureJockey.pagination(resultPerPage);
  dataJockey = await FeatureJockey.query;
  const ValuetobesearchedStringHorse = ["Name"];
  const FeatureHorse = new Features(
    HorseModel.find({ SoftDelete: 0 }).select("+SoftDelete"),
    req.query,
    ValuetobesearchedStringHorse,
    null
  )
    .searching()
    .filter();

  let dataHorse = await FeatureHorse.query;
  FeatureHorse.pagination(resultPerPage);
  dataHorse = await FeatureHorse.query;
  res.status(200).json({
    success: true,
    dataHorse,
    dataTrainer,
    dataJockey,
  });
});
