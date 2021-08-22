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
  user = new User({
    username: username,
  });
  user.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  res.send({ username: username, _id: user._id });
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
  const date = req.body.date
    ? req.body.date.toDateString()
    : new Date().toDateString();

  const checkID = async () => {
    const search = await User.findById({ _id: userId });
    return search;
  };

  checkID().then((result) => {
    if (result) {
      exercise = {
        description: description,
        duration: duration,
        date: date,
      };

      User.updateOne(
        { _id: userId },
        { $push: { log: exercise } },
        { new: true },
        (err) => {
          if (err) {
            return console.log(err);
          }
        }
      );
      res.json({
        _id: userId,
        username: result.username,
        date: date,
        duration: Number(duration),
        description: description,
      });
    } else {
      res.json({ error: "ID not valid" });
    }
  });
});

app.get("/api/users/:_id/logs", (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  const userLogs = async () => {
    const user = limit
      ? await User.find({ _id: _id }).limit(Number(limit))
      : await User.find({ _id: _id });

    let count = await user[0].log.length;
    let logArray = await user[0].log.map((item) => {
      let { description, duration, date } = item;
      return {
        description: description,
        duration: duration,
        date: date,
      };
    });

    let username = user[0].username;
    return { _id: _id, username: username, count: count, log: logArray };
  };
  userLogs().then((result) => {
    let { id, username, count } = result;
    if (from && to) {
      let start = new Date(from).getFullYear();
      let end = new Date(to).getFullYear();
      let filteredLog = result.log.filter((item) => {
        return (
          Number(item.date.split(" ")[3]) >= start + 1 &&
          Number(item.date.split(" ")[3]) <= end + 1
        );
      });
      count = filteredLog.length;
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
