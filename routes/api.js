/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

module.exports = function (app, client) {
  const formatDoc = (doc) => {
    const res = doc._doc;
    res["commentcount"] = doc.comments.length;
    return res;
  };

  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      client.FindDoc({}, (err, docs) => {
        if (err) return next(err);
        docs = docs.map((doc) => formatDoc(doc));
        res.send(docs);
      });
    })

    .post(function (req, res) {
      let title = req.body.title;
      let params = { title, comments: [] };
      client.AddDoc(params, (err, doc) => {
        if (err) {
          res.status(200);
          res.send({ error: "required field(s) missing" });
          return;
        }
        res.send(formatDoc(doc));
      });
      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      client.DeleteDoc({}, (err, doc) => {
        if (err || doc.deletedCount == 0) {
          res.send({ error: "no book exists" });
          return;
        }
        res.send({
          result: "delete successful",
        });
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let _id = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      client.FindDoc({ _id }, (err, docs) => {
        if (err || docs.length == 0) {
          res.send("no book exists");
          return;
        }
        let doc = docs[0];
        res.send(formatDoc(doc));
      });
    })

    .post(function (req, res) {
      let _id = req.params.id;
      let comment = req.body.comment;
      if (comment == undefined) {
        res.send("missing required field comment");
        return;
      }

      //json res format same as .get
      client.UpdateDoc(_id, comment, (err, doc) => {
        if (err || !doc) {
          res.send("no book exists");
          return;
        }
        res.send(formatDoc(doc));
      });
    })

    .delete(function (req, res) {
      let _id = req.params.id;
      //if successful response will be 'delete successful'
      client.DeleteDoc({ _id }, (err, doc) => {
        console.log("delete book:", err, doc);
        if (err || doc.deletedCount == 0) {
          res.send({ error: "no book exists" });
          return;
        }
        res.send({
          result: "delete successful",
        });
      });
    });
};
