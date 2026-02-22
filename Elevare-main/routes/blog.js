const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// Get all blog articles
router.get('/', async (req, res) => {
  try {
    const articles = await Blog.find().sort({ createdAt: -1 });
    res.json({ articles });
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    res.status(500).json({ error: 'Failed to load blog data' });
  }
});

// Get blog articles by category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category.toUpperCase();
    const articles = await Blog.find({ category });
    res.json({ articles });
  } catch (error) {
    console.error('Error fetching blog articles by category:', error);
    res.status(500).json({ error: 'Failed to load blog data' });
  }
});

// Search articles by title or content
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const articles = await Blog.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });
    res.json({ articles, query });
  } catch (error) {
    console.error('Error searching blog articles:', error);
    res.status(500).json({ error: 'Failed to search blog data' });
  }
});

// Get blog article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Blog.findById(req.params.id);
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  } catch (error) {
    console.error('Error fetching blog article:', error);
    res.status(500).json({ error: 'Failed to load blog data' });
  }
});

module.exports = router;