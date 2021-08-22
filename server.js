const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { uuid } = require("uuidv4");
require("dotenv").config({ path: "sample.env" });
var { Exercise, User } = require("./model");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  let { username } = req.body;
  let id = uuid();
  user = new User({
    id: id,
    username: username,
  });
  user.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  res.send({ username: username, _id: id });
});

app.get("/api/users", (req, res) => {
  const users = async () => {
    const items = await User.find({});
    const usersArray = await items.map((item) => {
      return { username: item.username, _id: item.id };
    });
    return usersArray;
  };
  users().then((result) => {
    res.json(result);
  });
});

app.post("/api/users/:_id/exercises", (req, res) => {
  let userId = req.body[":_id"];
  let { description, duration } = req.body;
  let date = req.body.date === true ? req.body.date : new Date();

  const checkID = async () => {
    const temp = await User.find({ id: userId });
    return temp;
  };

  checkID().then((result) => {
    console.log(result);
    if (result.length >= 1) {
      exercise = new Exercise({
        userId: userId,
        description: description,
        duration: duration, //here I insert the objectId field
        date: new Date(date),
      });

      exercise.save(function (err) {
        if (!err) {
          return console.log("created");
        } else {
          return console.log(err);
        }
      });
      res.json({
        username: result[0].username,
        _id: userId,
        description: description,
        duration: duration,
        date: date,
      });
    } else {
      res.json({ error: "ID not valid" });
    }
  });
});

app.get("/api/users/:_id/logs", (req, res) => {
  const { id } = req.params;
  const { from, to, limit } = req.query;
  console.log(from);
  const userLogs = async () => {
    let user = await User.find({ id: id });
    const logs = limit
      ? await Exercise.find({ userId: id }).limit(Number(limit))
      : await Exercise.find({ userId: id });
    Exercise.find({ userId: id });

    let count = await logs.length;
    let logArray = await logs.map((log) => {
      let { description, duration, date } = log;
      return {
        description: description,
        duration: duration,
        date: new Date(date),
      };
    });

    let { username } = user[0];
    return { id: id, username: username, count: count, log: logArray };
  };
  userLogs().then((result) => {
    let { id, username, count } = result;
    if (from && to) {
      let start = new Date(from).getFullYear();
      let end = new Date(to).getFullYear();
      let filteredLog = result.log.filter((item) => {
        return (
          item.date.getFullYear() >= start + 1 &&
          item.date.getFullYear() <= end + 1
        );
      });

      res.json({ id, username, count, log: filteredLog });
    } else {
      res.json(result);
    }
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

console.log(process.env.PORT);
