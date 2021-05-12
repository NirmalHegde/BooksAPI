//library declaration (get schema from mongoose)
const mongoose = require('mongoose');
const { Schema } = mongoose;

//Constructor function for new schema (contains model for book)
const bookModel = new Schema(
  {
    title: { type: String },
    author: { type: String },
    genre: { type: String },
    read: { type: Boolean, default: false },
  }
);

//export
module.exports = mongoose.model('Book', bookModel);
