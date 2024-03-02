const { promisify } = require("util");

const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");

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
    secure: process.env.NODE_ENV === "dev" ? false : true, //mayeteb3ath ken 3al https
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
  if (req.body.role === "admin")
    return next(new AppError("This route not for sign up admin", 401));

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

  createSendToken(newUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 401));
  }

  const user = await User.findOne({ email: email }).select("+password"); //select('+password') bech nraj3ou el passworf ijina fil result mta3 el find 5ater fil model 7atin select false

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("Your email or password is incorrect", 401));
  }

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    next(new AppError("You're not logged in!", 401));
  }

  const decodedJwt = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decodedJwt.id).select("+password");

  if (!currentUser) {
    next(new AppError("User is no longer exist", 401));
  }

  if (currentUser.isPassChangedAfterJWT(decodedJwt.iat)) {
    next(new AppError("User recently changed password! log in again", 401));
  }

  req.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictedTo = (...roles) => {
  (req, res, next) => {
    const currentUser = req.user;

    // if (!roles.find(val => val === currentUser.role)) {
    if (!roles.includes(currentUser.role)) {
      next(
        new AppError(`You need to login as ${[...roles]}! log in again`, 401)
      );
    }
    next();
  };
};
