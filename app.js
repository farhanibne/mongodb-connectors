const { ObjectId } = require("mongodb");
const express = require("express");
const { getDb, connectToDb } = require("./db");

// init app & middleware
const app = express();

// db connection
let db;

connectToDb((err) => {
  if (!err) {
    app.listen("3000", () => {
      console.log("app listening on port 3000");
    });
    db = getDb();
  }
});

// routes

app.get("/books", (req, res) => {
  let books = [];

  db.collection("books")
    .find()
    .sort({ author: 1 })
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
});

//search via iD 

app.get("/books/:id", (req, res) => {

    if(ObjectId.isValid(req.params.id)) {
  db.collection("books")
    .findOne({ _id: ObjectId(req.params.id) })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the document" });
    });
}
else {
    res.status(400).json({error: 'Invalid ID'})
}
});
