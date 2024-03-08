const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const filtredBody = filterObj(
    req.body,
    "fullname",
    "dateOfBirth",
    "phone",
    "phone2",
    "profession",
    "photo_url"
  );

  const user = await User.findByIdAndUpdate(req.params.id, filtredBody, {
    new: true,
    runValidators: true,
  });
  if (!user) next(new AppError("User not found", 404));

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.blockUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { state: false },
    { new: true }
  );
  if (!user) next(new AppError("User not found", 404));

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const filtredBody = filterObj(
    req.body,
    "fullname",
    "dateOfBirth",
    "phone",
    "phone2",
    "profession",
    "photo_url"
  );

  // if (!filtredBody.photo_url) {
  //   filtredBody.photo_url = req.loggedInUser.photo_url;
  // }

  const user = await User.findByIdAndUpdate(req.loggedInUser._id, filtredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
