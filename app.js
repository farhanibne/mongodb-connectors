const { ObjectId } = require("mongodb");
const express = require("express");
const { getDb, connectToDb } = require("./db");

// init app & middleware
const app = express();
app.use(express.json());

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

app.post('/books', (req, res) => {

  const book = req.body;

  db.collection('books')
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: 'Could not create a document ' });
    })
})

app.delete('/books/:id', (req, res) => {
  if(ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne ({ _id: ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch(() => {
        res.status(500).json({ error: "Could not delete  the document" });
      });
  }
  else {
      res.status(400).json({error: 'Invalid ID'})
  }

})

app.patch('/books/:id', (req, res) => {

  const update = req.body;

  if(ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: ObjectId(req.params.id)}, {$set: update })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch(() => {
        res.status(500).json({ error: "Could not update  the document" });
      });
  }
  else {
      res.status(400).json({error: 'Invalid ID'})
  }

})
