const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [40, " max 40 character"],
  },
  email: {
    type: String,
    required: [true, "Please enter the email address"],
    unique: true,

  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minlength: [6, "Please enter password greater than or equal to 6 char"],
    select: false,
  },
  mobile: {
    type: Number,
    required: true,
    min: 0000000000, max: 9999999999
  },

  role: {
    type: String,
    default:"User"
  },
  refreshToken: {
    type: String,
    
  },
  
  // more fields will be added when required
});


//encrypt password before save -- mongoose Hook
userSchema.pre("save", async function (next) {
  //to prevent over-encryption of password
  if (!this.isModified("password")) {
    return next();
  }
  //encrypt
  this.password = await bcrypt.hash(this.password, 10);
});
// Mongoose Methods
//user password validate method
userSchema.methods.isPasswordValid = async function (senderPassword) {
  return await bcrypt.compare(senderPassword, this.password);
};

// jwt Access Token  creation
userSchema.methods.jwtAccessTokenCreation = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_ACCESS_KEY, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });
};
// jwt Refresh Token  creation
userSchema.methods.jwtRefreshTokenGeneration = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_REFRESH_KEY, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
};

module.exports = mongoose.model("User", userSchema);
