const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var exerciseSchema = new Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date },
});

var userSchema = new Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
});

var Exercise = mongoose.model("Exercise", exerciseSchema);
var User = mongoose.model("User", userSchema);

module.exports = { Exercise, User };
