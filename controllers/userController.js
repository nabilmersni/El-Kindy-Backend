const jwt = require("jsonwebtoken");
const fs = require("fs");

const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const { sendEmail } = require("../utils/sendMail");

const emailTemplateBody = fs.readFileSync(
  "./public/emailTemplate.html",
  "utf-8"
);
const activationLink = "http://localhost:5173/verifyEmail";

const signToken = (id, expiresIn = process.env.JWT_EXPIRE_IN) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  let query = {};

  if (req.query.excludeUserId) {
    const excludeUserIdArray = req.query.excludeUserId.split(",");

    query = { _id: { $nin: excludeUserIdArray } };
  }

  const users = await User.find(query);

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

  await sendEmail(
    user.email,
    "Your EL Kindy account has been suspended.",
    emailTemplateBody
      .replace("${activationLink}", `http://localhost:5173/login`)
      .replace(
        "${headerTitle}",
        "Your EL Kindy account has been suspended. Reasons for suspension: " +
          req.body.blockReasons
      )
      .replace("${BtnLabel}", "Contact the administration")
  );

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

exports.addser = catchAsync(async (req, res, next) => {
  if (req.body.role === "admin") {
    return res.status(401).json({
      status: "error",
      message: "This route not for add user of type admin",
    });
  }

  const newUser = await User.create({
    fullname: req.body.fullname,
    dateOfBirth: req.body.dateOfBirth,
    email: req.body.email,
    phone: req.body.phone,
    phone2: req.body.phone2,
    profession: req.body.profession,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role,
    photo_url: req.body.photo_url,
  });

  const token = signToken(newUser._id, process.env.JWT_EXPIRE_IN_EMAIL);

  await sendEmail(
    newUser.email,
    "Confirm Email",
    emailTemplateBody
      .replace("${activationLink}", `${activationLink}/${token}`)
      .replace("${headerTitle}", "Welcome to EL Kindy family.")
      .replace("${BtnLabel}", "Activate My Account")
  );

  return res.status(201).json({
    status: "success",
    message: "User created successfully!",
    data: {
      user: newUser,
    },
  });
});

exports.getUserCounts = catchAsync(async (req, res, next) => {
  const totalUserCount = await User.countDocuments();

  const roleCounts = await User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const roleCountMap = {};
  roleCounts.forEach((roleCount) => {
    roleCountMap[roleCount._id] = roleCount.count;
  });

  res.status(200).json({
    status: "success",
    data: {
      totalUserCount,
      roleCounts: roleCountMap,
    },
  });
});

exports.acceptCV = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isCvAccepted: true },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  await sendEmail(
    user.email,
    "Teacher Position",
    emailTemplateBody
      .replace("${activationLink}", `http://localhost:5173/login`)
      .replace(
        "${headerTitle}",
        "Welcome to the EL Kindy family! Your CV has been reviewed and approved."
      )
      .replace("${BtnLabel}", "Start your journey")
  );

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
