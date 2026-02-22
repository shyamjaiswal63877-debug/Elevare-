const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  excerpt: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  url: {
    type: String,
    default: '#'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
