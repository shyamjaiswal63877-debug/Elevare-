require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/database');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import route modules
const coursesRoutes = require('./routes/courses');
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const internshipsRoutes = require('./routes/internships');

// Use route modules
app.use('/api/courses', coursesRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/internships', internshipsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Elevare API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve EJS pages (before static middleware so routes take priority)
app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/courses', (req, res) => {
  res.render('pages/courses');
});

app.get('/internships', (req, res) => {
  res.render('pages/internships');
});

app.get('/mentorship', (req, res) => {
  res.render('pages/mentorship');
});

app.get('/profile', (req, res) => {
  res.render('pages/profile');
});

app.get('/signin', (req, res) => {
  res.render('pages/signin');
});

app.get('/signup', (req, res) => {
  res.render('pages/signup');
});

// Serve static files (CSS, JS, images) - after routes so EJS takes priority
app.use(express.static(path.join(__dirname)));

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// 404 handler for all other routes
app.use('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Elevare server is running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/`);
  console.log(`📚 Courses API: http://localhost:${PORT}/api/courses`);
  console.log(`📰 Blog API: http://localhost:${PORT}/api/blog`);
});