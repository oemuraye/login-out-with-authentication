const mongoose = require('mongoose');
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    // required: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User