const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var exerciseSchema = new Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date },
});

var userSchema = new Schema({
  username: { type: String, required: true },
  log: [],
});

var Exercise = mongoose.model("Exercise", exerciseSchema);
var User = mongoose.model("User", userSchema);

module.exports = { Exercise, User };
