const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false // Don't return password by default in queries
  },
  
  // User Details
  userType: {
    type: String,
    enum: ['Student', 'Graduate', 'Professional'],
    default: 'Student'
  },
  year: {
    type: String,
    enum: ['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Graduate', 'Not Applicable'],
    default: 'First Year'
  },
  location: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  
  // Enrolled Courses
  enrolledCourses: [{
    courseId: {
      type: String,
      required: true
    },
    courseTitle: {
      type: String,
      required: true
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Paused'],
      default: 'In Progress'
    }
  }],
  
  // Applied Internships
  appliedInternships: [{
    internshipId: {
      type: String,
      required: true
    },
    internshipTitle: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Interview Scheduled', 'Accepted', 'Rejected'],
      default: 'Pending'
    },
    resumeDetails: {
      applicantName: String,
      applicantEmail: String,
      applicantPhone: String,
      coverLetter: String,
      skills: [String],
      experience: String,
      education: String
    }
  }],
  
  // Mentorship Sessions
  mentorshipSessions: [{
    sessionId: {
      type: String,
      required: true
    },
    mentorName: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      required: true
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    duration: {
      type: Number, // in minutes
      default: 60
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Upcoming'
    },
    bookedAt: {
      type: Date,
      default: Date.now
    },
    meetingLink: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    }
  }],
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to get user without sensitive data
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
