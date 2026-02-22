const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '💼'
    },
    description: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }],
    category: {
        type: String,
        enum: ['ALL', 'TECH', 'DESIGN', 'BUSINESS', 'MARKETING'],
        default: 'ALL'
    },
    duration: {
        type: String,
        default: '3 months'
    },
    stipend: {
        type: String,
        default: 'Unpaid'
    },
    type: {
        type: String,
        enum: ['Remote', 'Hybrid', 'On-site'],
        default: 'Remote'
    },
    requirements: [{
        type: String
    }],
    responsibilities: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    applicationDeadline: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Internship', internshipSchema);
