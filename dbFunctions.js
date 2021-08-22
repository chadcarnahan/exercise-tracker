var createAndSavePerson = (done, model, _id, description, duration, date) => {
  new model({
    _id: _id,
    description: description,
    duration: duration,
    date: date,
  }).save((err, data) => {
    if (err) return console.error(err);
    console.log("sent");
    done(null, data);
  });
};

module.exports = createAndSavePerson;
