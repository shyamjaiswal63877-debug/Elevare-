const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/users/:id
// @desc    Get user profile data (READ operation)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          year: user.year,
          location: user.location,
          phone: user.phone,
          enrolledCourses: user.enrolledCourses,
          appliedInternships: user.appliedInternships,
          mentorshipSessions: user.mentorshipSessions,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user profile information (UPDATE operation)
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { name, userType, year, location, phone } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (userType) user.userType = userType;
    if (year) user.year = year;
    if (location !== undefined) user.location = location;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
          year: user.year,
          location: user.location,
          phone: user.phone
        }
      }
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route   POST /api/users/:id/enroll
// @desc    Enroll user in a course (CREATE/UPDATE operation)
// @access  Public
router.post('/:id/enroll', async (req, res) => {
  try {
    const { courseId, courseTitle } = req.body;

    if (!courseId || !courseTitle) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseId and courseTitle'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      course => course.courseId === courseId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add course to enrolled courses
    user.enrolledCourses.push({
      courseId,
      courseTitle,
      progress: 0,
      status: 'In Progress',
      enrolledAt: new Date()
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        enrolledCourse: user.enrolledCourses[user.enrolledCourses.length - 1]
      }
    });

  } catch (error) {
    console.error('Course Enrollment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while enrolling in course'
    });
  }
});

// @route   POST /api/users/:id/apply-internship
// @desc    Apply for an internship (CREATE/UPDATE operation)
// @access  Public
router.post('/:id/apply-internship', async (req, res) => {
  try {
    const { 
      internshipId, 
      internshipTitle, 
      internshipCompany,
      applicantName,
      applicantEmail,
      applicantPhone,
      coverLetter,
      appliedDate,
      status
    } = req.body;

    if (!internshipId || !internshipTitle || !internshipCompany) {
      return res.status(400).json({
        success: false,
        message: 'Please provide internshipId, internshipTitle, and internshipCompany'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already applied
    const alreadyApplied = user.appliedInternships.some(
      internship => internship.internshipId === internshipId
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'Already applied for this internship'
      });
    }

    // Add internship to applied internships
    user.appliedInternships.push({
      internshipId,
      internshipTitle,
      company: internshipCompany,
      status: status || 'Pending',
      appliedAt: appliedDate ? new Date(appliedDate) : new Date(),
      resumeDetails: {
        applicantName: applicantName || user.name,
        applicantEmail: applicantEmail || user.email,
        applicantPhone: applicantPhone || user.phone,
        coverLetter: coverLetter || ''
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Successfully applied for internship',
      data: {
        appliedInternship: user.appliedInternships[user.appliedInternships.length - 1]
      }
    });

  } catch (error) {
    console.error('Internship Application Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while applying for internship'
    });
  }
});

// @route   POST /api/users/:id/book-session
// @desc    Book a mentorship session (CREATE/UPDATE operation)
// @access  Public
router.post('/:id/book-session', async (req, res) => {
  try {
    const { sessionId, mentorName, topic, scheduledDate, duration, meetingLink } = req.body;

    if (!sessionId || !mentorName || !topic || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide sessionId, mentorName, topic, and scheduledDate'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if session already booked
    const alreadyBooked = user.mentorshipSessions.some(
      session => session.sessionId === sessionId
    );

    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: 'Session already booked'
      });
    }

    // Add session to mentorship sessions
    user.mentorshipSessions.push({
      sessionId,
      mentorName,
      topic,
      scheduledDate: new Date(scheduledDate),
      duration: duration || 60,
      status: 'Upcoming',
      bookedAt: new Date(),
      meetingLink: meetingLink || '',
      notes: ''
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Successfully booked mentorship session',
      data: {
        bookedSession: user.mentorshipSessions[user.mentorshipSessions.length - 1]
      }
    });

  } catch (error) {
    console.error('Session Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while booking session'
    });
  }
});

// @route   PUT /api/users/:id/courses/:courseId
// @desc    Update course progress
// @access  Public
router.put('/:id/courses/:courseId', async (req, res) => {
  try {
    const { progress, status } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const course = user.enrolledCourses.find(
      c => c.courseId === req.params.courseId
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found in enrolled courses'
      });
    }

    if (progress !== undefined) course.progress = progress;
    if (status) course.status = status;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Course progress updated',
      data: { course }
    });

  } catch (error) {
    console.error('Update Course Progress Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating course progress'
    });
  }
});

module.exports = router;
