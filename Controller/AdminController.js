const AdminModel = require("../Models/TrainerModel");
const Trackerror = require("../Middleware/TrackError");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const TokenCreation = require("../Utils/TokenCreation");
exports.CreateAdmin = Trackerror(async (req, res, next) => {
  const data = await AdminModel.create(req.body);
  res.status(200).json({
    success: true,
    data,
  });
});
exports.GetAdmin = Trackerror(async (req, res, next) => {
  const data = AdminModel.find({ SoftDelete: 0 }).select("+SoftDelete");
  res.status(200).json({
    success: true,
    data,
  });
});
exports.UpdateAdmin = Trackerror(async (req, res, next) => {
  let data = await AdminModel.findById(req.params.id);
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  data = await AdminModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.DeleteAdmin = Trackerror(async (req, res, next) => {
  const data = await AdminModel.findById(req.params.id);
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  await data.remove();
  res.status(200).json({
    success: true,
    message: "Admin Delete Successfully",
  });
});
exports.LoginAdmin = Trackerror(async (req, res, next) => {
  const { Name, password } = req.body;

  if (!Name || !password) {
    return next(new HandlerCallBack("Please enter password and Name", 400));
  }

  const user = await AdminModel.findOne({ Name }).select("+password");
  console.log(user);

  if (!user) {
    return next(new HandlerCallBack("Invalid Name or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new HandlerCallBack("Name or password is incorrect", 401));
  }

  TokenCreation(user, 200, res);
});

exports.logOut = Trackerror(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
