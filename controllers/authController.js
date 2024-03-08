const { promisify } = require("util");

const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

const admin = require("firebase-admin");

const serviceAccount = require("../el-kindy-auth-firebase-serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
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
  });

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

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "You're not logged in!",
    });
  }

  const decodedJwt = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decodedJwt.id).select("+password");

  if (!currentUser) {
    return res.status(401).json({
      status: "error",
      message: "User is no longer exist",
    });
  }

  if (currentUser.isPassChangedAfterJWT(decodedJwt.iat)) {
    return res.status(401).json({
      status: "error",
      message: "User recently changed password! log in again",
    });
  }

  req.loggedInUser = currentUser;
  next();
});

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
