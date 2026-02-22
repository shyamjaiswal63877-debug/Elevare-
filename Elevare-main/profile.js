// Profile page JavaScript - Fetch and display user data from MongoDB

// Check if user is logged in - redirect immediately
const userId = localStorage.getItem('userId');

// Redirect to signin if not logged in (before page renders)
if (!userId) {
    window.location.replace('/signin');
    throw new Error('Not authenticated'); // Stop execution
}

// Load user profile data
async function loadProfileData() {
  try {
    // Fetch user data from API
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const result = await response.json();
    
    if (result.success && result.data && result.data.user) {
      displayUserData(result.data.user);
    } else {
      throw new Error('Invalid response format');
    }
    
  } catch (error) {
    console.error('Error loading profile:', error);
    alert('Failed to load profile data. Please try again.');
    window.location.href = 'signin.html';
  }
}

// Display user data on the page
function displayUserData(user) {
  // Store user data for edit modal
  window.setCurrentUserData && window.setCurrentUserData(user);
  
  // Update profile header
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userType').textContent = `${user.userType} - ${user.year}`;
  
  // Update stats
  document.getElementById('coursesCount').textContent = user.enrolledCourses?.length || 0;
  document.getElementById('internshipsCount').textContent = user.appliedInternships?.length || 0;
  document.getElementById('sessionsCount').textContent = user.mentorshipSessions?.length || 0;
  
  // Update user info
  document.getElementById('fullName').textContent = user.name;
  document.getElementById('userStatus').textContent = user.userType;
  document.getElementById('userYear').textContent = user.year;
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('userPhone').textContent = user.phone || 'Not provided';
  document.getElementById('userLocation').textContent = user.location || 'Not provided';
  
  // Display enrolled courses
  displayEnrolledCourses(user.enrolledCourses || []);
  
  // Display applied internships
  displayAppliedInternships(user.appliedInternships || []);
  
  // Display mentorship sessions
  displayMentorshipSessions(user.mentorshipSessions || []);
}

// Display enrolled courses
function displayEnrolledCourses(courses) {
  const container = document.querySelector('.profile-courses-grid');
  
  if (courses.length === 0) {
    container.innerHTML = '<p class="empty-message">No enrolled courses yet. <a href="courses.html">Browse courses</a></p>';
    return;
  }
  
  container.innerHTML = courses.map(course => `
    <div class="profile-course-card">
      <div class="course-card-header">
        <div class="course-icon">📚</div>
        <span class="course-badge ${course.status === 'Completed' ? 'completed' : ''}">${course.status}</span>
      </div>
      <h3 class="course-card-title">${course.courseTitle}</h3>
      <div class="course-progress">
        <div class="progress-bar">
          <div class="progress-fill ${course.progress === 100 ? 'completed' : ''}" style="width: ${course.progress}%;"></div>
        </div>
        <span class="progress-text">${course.progress}% Complete</span>
      </div>
      <button class="btn-continue ${course.status === 'Completed' ? 'completed' : ''}">
        ${course.status === 'Completed' ? 'View Certificate' : 'Continue Learning'}
      </button>
    </div>
  `).join('');
}

// Display applied internships
function displayAppliedInternships(internships) {
  const container = document.querySelector('.profile-internships-list');
  
  if (internships.length === 0) {
    container.innerHTML = '<p class="empty-message">No internship applications yet. <a href="internships.html">Find internships</a></p>';
    return;
  }
  
  container.innerHTML = internships.map(internship => {
    const statusClass = internship.status.toLowerCase().replace(' ', '-');
    const appliedDate = new Date(internship.appliedAt || Date.now()).toLocaleDateString();
    
    return `
      <div class="internship-item">
        <div class="internship-icon">💼</div>
        <div class="internship-info">
          <h3 class="internship-title">${internship.internshipTitle || 'Internship'}</h3>
          <p class="internship-company">${internship.company}</p>
          <p class="internship-details">Remote • Applied ${appliedDate}</p>
        </div>
        <span class="status-badge ${statusClass}">${internship.status}</span>
      </div>
    `;
  }).join('');
}

// Display mentorship sessions
function displayMentorshipSessions(sessions) {
  const container = document.querySelector('.profile-sessions-list');
  
  if (sessions.length === 0) {
    container.innerHTML = '<p class="empty-message">No booked sessions yet. <a href="mentorship.html">Book a session</a></p>';
    return;
  }
  
  container.innerHTML = sessions.map(session => {
    const statusClass = session.status.toLowerCase().replace(' ', '-');
    const sessionDate = new Date(session.scheduledDate).toLocaleDateString();
    const sessionTime = new Date(session.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `
      <div class="session-card">
        <div class="session-header">
          <span class="session-icon">👨‍🏫</span>
          <span class="session-status ${statusClass}">${session.status}</span>
        </div>
        <h3 class="session-mentor">${session.mentorName}</h3>
        <p class="session-topic">${session.topic}</p>
        <div class="session-time">
          <span class="session-date">📅 ${sessionDate}</span>
          <span class="session-time-slot">🕐 ${sessionTime}</span>
        </div>
        <button class="btn-session-action">
          ${session.status === 'Completed' ? 'View Summary' : 'Join Session'}
        </button>
      </div>
    `;
  }).join('');
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadProfileData();
  
  // Edit Profile Modal functionality
  const editModal = document.getElementById('editModal');
  const editBtn = document.querySelector('.btn-edit-profile');
  const editBtnSmall = document.querySelector('.btn-edit-small');
  const closeModal = document.getElementById('closeModal');
  const cancelEdit = document.getElementById('cancelEdit');
  const editForm = document.getElementById('editProfileForm');
  
  // Store current user data
  let currentUserData = null;
  
  // Open modal
  const openEditModal = () => {
    if (!userId) {
      alert('Please sign in to edit your profile.');
      window.location.href = 'signin.html';
      return;
    }
    
    if (!currentUserData) {
      alert('Please wait for profile data to load.');
      return;
    }
    
    // Pre-fill form with current data
    document.getElementById('editName').value = currentUserData.name;
    document.getElementById('editUserType').value = currentUserData.userType;
    document.getElementById('editYear').value = currentUserData.year || 'N/A';
    document.getElementById('editPhone').value = currentUserData.phone || '';
    document.getElementById('editLocation').value = currentUserData.location || '';
    
    editModal.style.display = 'flex';
  };
  
  // Close modal
  const closeEditModal = () => {
    editModal.style.display = 'none';
  };
  
  // Event listeners for opening/closing modal
  if (editBtn) editBtn.addEventListener('click', openEditModal);
  if (editBtnSmall) editBtnSmall.addEventListener('click', openEditModal);
  if (closeModal) closeModal.addEventListener('click', closeEditModal);
  if (cancelEdit) cancelEdit.addEventListener('click', closeEditModal);
  
  // Close modal when clicking outside
  editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
  });
  
  // Handle form submission
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('editName').value,
      userType: document.getElementById('editUserType').value,
      year: document.getElementById('editYear').value,
      phone: document.getElementById('editPhone').value,
      location: document.getElementById('editLocation').value
    };
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Update localStorage with new name
        localStorage.setItem('userName', formData.name);
        alert('Profile updated successfully!');
        closeEditModal();
        // Reload profile data and navigation to reflect changes
        loadProfileData();
        location.reload(); // Reload to update nav bar with new name
      } else {
        alert(result.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('An error occurred while updating profile.');
    }
  });
  
  // Store user data globally for edit modal
  window.setCurrentUserData = (userData) => {
    currentUserData = userData;
  };
});
