const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const { sendEmail } = require("../utils/sendMail");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const emailTemplateBody = fs.readFileSync(
  "./public/emailTemplate.html",
  "utf-8"
);
const activationLink = "http://localhost:5173/verifyEmail";
const forgotPasswordLink = "http://localhost:5173/forgotPassword";

const serviceAccount = require("../el-kindy-auth-firebase-serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "el-kindy-auth.appspot.com",
});

const signToken = (id, expiresIn = process.env.JWT_EXPIRE_IN) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE_IN * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV !== "dev", //mayeteb3ath ken 3al https
    httpOnly: true, //cannot modified by the browser: just receive it store it and the resent it to the server on each request
  });

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  if (req.body.role === "admin") {
    return res.status(401).json({
      status: "error",
      message: "This route not for sign up admin",
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
    cv_url: req.body.cv_url,
  });

  const token = signToken(newUser._id, process.env.JWT_EXPIRE_IN_EMAIL);

  await sendEmail(
    // "justtrash010@gmail.com",
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
    user: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  const user = await User.findOne({ email: email }).select("+password"); //select('+password') bech nraj3ou el passworf ijina fil result mta3 el find 5ater fil model 7atin select false

  if (!user || !(await user.checkPassword(password, user.password))) {
    return res.status(401).json({
      status: "error",
      message: "Your email or password is incorrect",
    });
  }

  if (!user.state) {
    return res.status(401).json({
      status: "error",
      message: "Your account is locked. please contact the administration.",
    });
  }

  if (!user.isEmailVerified) {
    const token = signToken(user._id, process.env.JWT_EXPIRE_IN_EMAIL);

    await sendEmail(
      // "justtrash010@gmail.com",
      user.email,
      "Confirm Email",
      emailTemplateBody
        .replace("${activationLink}", `${activationLink}/${token}`)
        .replace("${headerTitle}", "Welcome to EL Kindy family.")
        .replace("${BtnLabel}", "Activate My Account")
    );

    return res.status(401).json({
      status: "error",
      message:
        "Please active your account, we resend a verification email to you.",
    });
  }

  createSendToken(user, 200, res);
});

exports.authGoogle = catchAsync(async (req, res, next) => {
  const { email, idToken } = req.body;

  if (!email || !idToken) {
    return res.status(400).json({
      status: "error",
      message: "Email and ID token are required",
    });
  }

  const decodedToken = await admin.auth().verifyIdToken(idToken);

  if (email !== decodedToken.email) {
    return res.status(401).json({
      status: "error",
      message: "Email in request does not match email in ID token",
    });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "No user with this email!",
    });
  }

  if (!user.isEmailVerified) {
    const token = signToken(user._id, process.env.JWT_EXPIRE_IN_EMAIL);

    await sendEmail(
      // "justtrash010@gmail.com",
      user.email,
      "Confirm Email",
      emailTemplateBody
        .replace("${activationLink}", `${activationLink}/${token}`)
        .replace("${headerTitle}", "Welcome to EL Kindy family.")
        .replace("${BtnLabel}", "Activate My Account")
    );

    return res.status(401).json({
      status: "error",
      message:
        "Please active your account, we resend a verification email to you.",
    });
  }

  createSendToken(user, 200, res);
});

exports.faceIDRegistration = catchAsync(async (req, res, next) => {
  if (req.loggedInUser.faceIDState) {
    return res.status(400).json({
      status: "error",
      message: "faceID already configured",
    });
  }
  console.log(req.body);
  const { faceID } = req.body;

  if (!faceID) {
    return res.status(400).json({
      status: "error",
      message: "faceID are required",
    });
  }

  if (req.params.id !== req.loggedInUser._id.toString()) {
    return res.status(401).json({
      status: "error",
      message: "What are you doing little hacker",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { faceID, faceIDState: true },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.authFaceID = catchAsync(async (req, res, next) => {
  const { email, faceID } = req.body;

  if (!email || !faceID) {
    return res.status(400).json({
      status: "error",
      message: "Email and faceID are required",
    });
  }

  const user = await User.findOne({ email, faceID });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "No user with this faceID!",
    });
  }

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ status: "success", message: "Signout successfully!" });
};

exports.getLoggedUser = async (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.status(200).json({
      status: "error",
      user: null,
    });
  }

  try {
    // 1) verify token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    // 2) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(404).json({
        status: "error",
        message: "User no longer exist!",
      });
    }

    return res.status(200).json({
      status: "success",
      user: currentUser,
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.status(401).json({
      status: "error",
      message: "You are not authenticated!",
    });
  }

  // 1) verify token
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  // 2) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(404).json({
      status: "error",
      message: "User no longer exist!",
    });
  }

  // THERE IS A LOGGED IN USER
  req.loggedInUser = currentUser;
  next();
});

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    const currentUser = req.loggedInUser;

    if (!roles.includes(currentUser.role)) {
      return res.status(401).json({
        status: "error",
        message: `You need to login as ${roles.join(" or ")}! Log in again.`,
      });
    }
    next();
  };
};

exports.verifyEmail = catchAsync(async (req, res, next) => {
  if (!req.body.token) {
    return res.status(401).json({
      status: "error",
      message: "token is required",
    });
  }

  try {
    const decoded = await promisify(jwt.verify)(
      req.body.token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        status: "error",
        message: "Email is already verified",
      });
    }

    await User.findByIdAndUpdate(
      decoded.id,
      { isEmailVerified: true },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (error) {
    if (error.message === "jwt expired") {
      // const expiredToken = jwt.decode(req.body.token);
      const expiredToken = jwt.verify(req.body.token, process.env.JWT_SECRET, {
        ignoreExpiration: true,
      });

      const user = await User.findById(expiredToken.id);

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User no longer exist",
        });
      }

      const token = signToken(user._id, process.env.JWT_EXPIRE_IN_EMAIL);

      await sendEmail(
        // "justtrash010@gmail.com",
        user.email,
        "Forgot Password Request",
        emailTemplateBody
          .replace("${activationLink}", `${activationLink}/${token}`)
          .replace("${headerTitle}", "Welcome to EL Kindy family.")
          .replace("${BtnLabel}", "Activate My Account")
      );

      return res.status(400).json({
        status: "error",
        message: "token expired, we resend a verification email to you.",
      });
    }
  }
});

exports.forgotPasswordRequest = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).json({
      status: "error",
      message: "email is required",
    });
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "No user linked to this Email!",
    });
  }

  const token = signToken(user._id, process.env.JWT_EXPIRE_IN_EMAIL);

  await sendEmail(
    // "justtrash010@gmail.com",
    user.email,
    "Forgot Password Request",
    emailTemplateBody
      .replace("${activationLink}", `${forgotPasswordLink}/${token}`)
      .replace(
        "${headerTitle}",
        "We recently received a request to reset your password"
      )
      .replace("${BtnLabel}", "Reset My Password")
  );

  return res.status(200).json({
    status: "success",
    message: "Password Reset Request was sent to your email",
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  let token;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword || password !== confirmPassword) {
    return res.status(400).json({
      status: "error",
      message: "password and confirmPassword are required and must match",
    });
  }

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "token is required",
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const cryptedPassword = await bcrypt.hash(password, 12);

  const user = await User.findByIdAndUpdate(
    decoded.id,
    { password: cryptedPassword },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, password, confirmPassword } = req.body;

  if (!oldPassword || !password || !confirmPassword) {
    return res.status(400).json({
      status: "error",
      message:
        "Current password, new password, and confirm new password are required",
    });
  }

  const user = await User.findById(req.loggedInUser.id).select("+password");

  if (!(await user.checkPassword(oldPassword, user.password))) {
    return res.status(401).json({
      status: "error",
      message: "Current password is incorrect",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: "error",
      message: "New password and confirm new password do not match",
    });
  }
  const cryptedPassword = await bcrypt.hash(password, 12);
  user.password = password;
  user.confirmPassword = confirmPassword;

  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});
