const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minlength: 4,
    maxlength: 40,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    // Creates a validator that checks if the value matches
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    // Creates a unique index --> Not a validator though
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
});

// Mongoose middleware for hashing passwords
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Creates a JWT (web token) through this. method
// Grabbing a unique token for the user using JWT Package
// Has three things --> Payload, JWT Secret and expiration date
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRATION,
    }
  );
};

// Checks the hashed password using the Schema
// Looking for one argument
UserSchema.methods.comparePassword = async function (canditatePassword) {
  // We grab the password from the Schema above that is saved in the DB
  const isMatching = await bcrypt.compare(canditatePassword, this.password);
  return isMatching;
};

module.exports = mongoose.model("User", UserSchema);
