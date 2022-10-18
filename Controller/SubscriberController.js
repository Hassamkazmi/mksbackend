const SubscriberModel = require("../Models/SubscriberModel");
const Trackerror = require("../Middleware/TrackError");
const TokenCreation = require("../Utils/TokenCreation");
const HandlerCallBack = require("../Utils/HandlerCallBack");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const EmailDispatch = require("../Utils/EmailDispatch");
const { Subscriber } = require("../Utils/Path");
const { uploadFile, deleteFile, getObjectSignedUrl } = require("../Utils/s3");
const { generateFileName } = require("../Utils/FileNameGeneration");
const { resizeImageBuffer } = require("../Utils/ImageResizing");
const Features = require("../Utils/Features");
const HorseModel = require("../Models/HorseModel");
exports.RegisterSubscriber = Trackerror(async (req, res, next) => {
  const { FirstName, LastName, PassportNo, PhoneNumber, password, Email } =
    req.body;
  const file = req.files.PassportPicture;
  let Image = generateFileName();
  const fileBuffer = await resizeImageBuffer(
    req.files.PassportPicture.data,
    214,
    212
  );
  await uploadFile(fileBuffer, `${Subscriber}/${Image}`, file.mimetype);
  // Image = await getObjectSignedUrl(`${Subscriber}/${Image}`);
  const data = await SubscriberModel.create({
    FirstName: FirstName,
    LastName: LastName,
    PassportNo: PassportNo,
    PhoneNumber: PhoneNumber,
    password: password,
    Email: Email,
    PassportPicture: Image,
  });

  TokenCreation(data, 201, res);
});
exports.GetAllSubscriber = Trackerror(async (req, res, next) => {
  const data = await SubscriberModel.find();
  res.status(201).json({
    success: true,
    data,
  });
});
exports.GetonlyoneSusbcriber = Trackerror(async (req, res, next) => {
  const data = await SubscriberModel.findById(req.params.id);
  if (!data) {
    return next(new HandlerCallBack(`user not found `));
  }

  res.status(200).json({
    success: true,
    data: data,
  });
});
exports.DeleteSubscriber = Trackerror(async (req, res, next) => {
  const data = await SubscriberModel.findByIdAndDelete(req.params.id);
  if (!data) {
    return next(new HandlerCallBack(`user not found`));
  }
  res.status(200).json({
    success: true,
    message: "user deleted",
  });
});
exports.SubscriberApproval = Trackerror(async (req, res, next) => {
  let data = await SubscriberModel.findById(req.params.id, {
    SoftDelete: 0,
  }).select("+SoftDelete");
  if (!data) {
    return next(new HandlerCallBack(`user not found`));
  }
  data = await SubscriberModel.findByIdAndUpdate(
    req.params.id,
    { role: "approveduser" },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  ).select("+SoftDelete");
  res.status(200).json({
    success: true,
    message: "user status update successfull",
  });
});
exports.LoginSubscriber = Trackerror(async (req, res, next) => {
  const { Email, password } = req.body;

  if (!Email || !password) {
    return next(new HandlerCallBack("Please enter password and Email", 400));
  }

  const user = await SubscriberModel.findOne({ Email }).select("+password");
  console.log(user);

  if (!user) {
    return next(new HandlerCallBack("Invalid Email or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new HandlerCallBack("Email or password is incorrect", 401));
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
exports.TrackHorse = Trackerror(async (req, res, next) => {
  let Horse = await HorseModel.findById(req.params.id);
  const { token } = req.cookies;
  if (!token) {
    return next(
      new HandlerCallBack("Please login to access this resource", 401)
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await SubscriberModel.findById(decodedData.id).select("+role");

  let data = await SubscriberModel.findById(req.params.id, {
    SoftDelete: 0,
  }).select("+SoftDelete");
  if (!data) {
    return next(new HandlerCallBack(`user not found`));
  }
  data = await SubscriberModel.findByIdAndUpdate(
    req.user._id,
    { TrackHorse: `${Horse}` },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  ).select("+SoftDelete");
  res.status(200).json({
    success: true,
    message: "user status update successfull",
  });
});
exports.forgotPassword = Trackerror(async (req, res, next) => {
  const user = await SubscriberModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new HandlerCallBack("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have ot requested this email 
    then, ignore it`;

  try {
    await EmailDispatch({
      email: user.email,
      subject: "Mks  Racing password recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new HandlerCallBack(err.message, 500));
  }
});

exports.resetPassword = Trackerror(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new HandlerCallBack("Reset Password token is invalid or expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new HandlerCallBack("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  TokenCreation(user, 200, res);
});
