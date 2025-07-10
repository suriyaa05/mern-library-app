const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  read: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Book', bookSchema);
