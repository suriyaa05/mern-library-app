const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Book = require('./models/Book');

dotenv.config();
console.log("MONGO_URI from .env:", process.env.MONGO_URI);
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// GET all books
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// POST a new book (includes rating)
app.post('/books', async (req, res) => {
  const { title, author, rating } = req.body;

  if (!title || !author || rating === undefined) {
    return res.status(400).json({ error: "Title, author, and rating are required" });
  }

  const book = new Book({ title, author, rating });
  await book.save();
  res.json(book);
});

// DELETE a book by ID
app.delete('/books/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'Book deleted' });
});

// PUT update book by ID (includes rating)
app.put('/books/:id', async (req, res) => {
  const { title, author, rating } = req.body;

  if (!title || !author || rating === undefined) {
    return res.status(400).json({ error: "Title, author, and rating are required" });
  }

  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    { title, author, rating },
    { new: true }
  );
  res.json(updatedBook);
});

// PUT toggle read status
app.put('/books/:id/toggle-read', async (req, res) => {
  const book = await Book.findById(req.params.id);
  book.read = !book.read;
  await book.save();
  res.json(book);
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
