const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  enrollUrl: {
    type: String,
    default: '#'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
