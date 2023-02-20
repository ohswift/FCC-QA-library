async function main(callback) {
  const mongoose = require("mongoose");
  console.log("[DB] begin connect db successfully.");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const Model = mongoose.model(
      "books",
      new mongoose.Schema({
        title: { type: String, required: true },
        comments: { type: Array },
      })
    );

    const FindDoc = (filters, done) => {
      Model.find(filters, (err, data) => {
        if (err) return done(err, null);
        done(null, data);
      });
    };

    console.log("[DB] connect db successfully.");

    const DeleteDoc = (filters, done) => {
      Model.deleteMany(filters, (err, data) => {
        if (err) return done(err, null);
        done(null, data);
      });
    };

    const AddDoc = (params, done) => {
      const d = new Model(params);
      d.save((err, doc) => {
        if (err) return done(err, null);
        done(null, doc);
      });
    };

    const UpdateDoc = (_id, comment, done) => {
      //   console.log(issue_id, params);
      Model.findOne({ _id }, (err, doc) => {
        console.log("findOne", err, doc);
        if (err || !doc) return done(err, null);
        doc.comments.push(comment);
        doc.save((err1, doc1) => {
          console.log("doc.save", err1, doc1);
          if (err1) return console.error(err1);
          done(null, doc1);
        });
      });
    };

    callback({
      FindDoc,
      DeleteDoc,
      UpdateDoc,
      AddDoc,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Unable to Connect to Database");
  }
}

module.exports = main;
