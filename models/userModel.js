const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "A user must have a name"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "A user must have a date of birth"],
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: [true, "The email is in use"],
    lowercase: true,
    validate: [validator.isEmail, "A valid email must be provided"],
  },
  phone: {
    type: String,
    required: [true, "A user must have a phone number"],
  },
  phone2: String,
  profession: {
    type: String,
    required: [true, "A user must have a proffesion"],
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  state: {
    type: Boolean,
    default: true,
  },
  isCvAccepted: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "teacher", "admin"],
      message: "role is either: user, teacher, admin",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  photo_url: {
    type: String,
    default: "default.png",
    // required: [true, 'A user must have a photo']
  },
  cv_url: {
    type: String,
  },
  description: String,
  fbLink: String,
  instagramLink: String,
  twitterLink: String,
  passwordResetToken: String,
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: [8, "A password must at least 8 characters"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is required"],
    validate: [
      //work only on save and create
      function (currConfirmPass) {
        return currConfirmPass === this.password;
      },
      "Passwords are not match",
    ],
  },
  changePasswordAt: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined; //bech mayetsabech fil Db
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.changePasswordAt = Date.now() - 1000; //juste no4emnou eli token tesna3mba3ed matbadel el password
  next();
});

// userSchema.pre(/^find/, function (next) {
//   this.find({ active: true });
//   next();
// });

userSchema.methods.checkPassword = async function (candidatePass, userPass) {
  //this.password najmouch 5ater select false
  return await bcrypt.compare(candidatePass, userPass);
};

userSchema.methods.isPassChangedAfterJWT = function (tokenIat) {
  if (this.changePasswordAt) {
    return tokenIat < this.changePasswordAt.getTime() / 1000;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
