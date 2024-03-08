const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let query = {};

  // Check if excludeUserId parameter exists in the request query
  if (req.query.excludeUserId) {
    // Exclude the specified user ID from the query
    query = { _id: { $ne: req.query.excludeUserId } };
  }

  // Find users based on the query
  const users = await User.find(query);

  // const users = await User.find();

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

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

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

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

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
    { state: req.body.state },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

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
