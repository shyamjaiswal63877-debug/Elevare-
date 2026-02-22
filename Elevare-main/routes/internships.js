const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');

// GET all active internships
router.get('/', async (req, res) => {
    try {
        const internships = await Internship.find({ isActive: true }).sort({ postedDate: -1 });
        res.json({
            success: true,
            data: internships,
            count: internships.length
        });
    } catch (error) {
        console.error('Error fetching internships:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch internships',
            error: error.message
        });
    }
});

// GET internship by ID
router.get('/:id', async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);
        
        if (!internship) {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }
        
        res.json({
            success: true,
            data: internship
        });
    } catch (error) {
        console.error('Error fetching internship:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch internship',
            error: error.message
        });
    }
});

// POST create new internship (admin only - add auth middleware later)
router.post('/', async (req, res) => {
    try {
        const internship = new Internship(req.body);
        await internship.save();
        
        res.status(201).json({
            success: true,
            message: 'Internship created successfully',
            data: internship
        });
    } catch (error) {
        console.error('Error creating internship:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to create internship',
            error: error.message
        });
    }
});

// PUT update internship (admin only - add auth middleware later)
router.put('/:id', async (req, res) => {
    try {
        const internship = await Internship.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!internship) {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Internship updated successfully',
            data: internship
        });
    } catch (error) {
        console.error('Error updating internship:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to update internship',
            error: error.message
        });
    }
});

// DELETE internship (admin only - add auth middleware later)
router.delete('/:id', async (req, res) => {
    try {
        const internship = await Internship.findByIdAndDelete(req.params.id);
        
        if (!internship) {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Internship deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting internship:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete internship',
            error: error.message
        });
    }
});

module.exports = router;
