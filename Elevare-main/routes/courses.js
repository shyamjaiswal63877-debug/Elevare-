const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to load courses data' });
  }
});

// Get courses by level
router.get('/level/:level', async (req, res) => {
  try {
    const level = req.params.level.charAt(0).toUpperCase() + req.params.level.slice(1).toLowerCase();
    const courses = await Course.find({ level });
    res.json({ courses });
  } catch (error) {
    console.error('Error fetching courses by level:', error);
    res.status(500).json({ error: 'Failed to load courses data' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ error: 'Course not found' });
    }
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to load course data' });
  }
});

module.exports = router;