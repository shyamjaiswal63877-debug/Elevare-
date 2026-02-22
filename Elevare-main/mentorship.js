// Mentorship Session Booking Logic
(function() {
    const modal = document.getElementById('bookingModal');
    const bookingForm = document.getElementById('bookingForm');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelBooking');
    const bookButtons = document.querySelectorAll('.book-session-btn');

    // Open booking modal
    bookButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const mentorCard = this.closest('.mentor-card');
            const mentorId = mentorCard.dataset.mentorId;
            const mentorName = mentorCard.dataset.mentorName;
            const mentorRole = mentorCard.dataset.mentorRole;
            const mentorExpertise = mentorCard.dataset.mentorExpertise;

            // Check if user is logged in
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('Please sign in to book a mentorship session.');
                window.location.href = 'signin.html';
                return;
            }

            // Set mentor details in form
            document.getElementById('sessionId').value = mentorId + '-' + Date.now();
            document.getElementById('mentorName').value = mentorName;
            
            // Set minimum datetime to current time
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            document.getElementById('scheduledDate').min = now.toISOString().slice(0,16);

            modal.style.display = 'block';
        });
    });

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
        bookingForm.reset();
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Close when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('Please sign in to book a session.');
                window.location.href = 'signin.html';
                return;
            }

            const formData = {
                sessionId: document.getElementById('sessionId').value,
                mentorName: document.getElementById('mentorName').value,
                topic: document.getElementById('topic').value,
                scheduledDate: document.getElementById('scheduledDate').value,
                duration: parseInt(document.getElementById('duration').value),
                notes: document.getElementById('notes').value || '',
                status: 'Upcoming'
            };

            console.log('Booking session:', formData);

            fetch('/api/users/' + userId + '/book-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(function(res) {
                return res.json().then(function(data) {
                    if (!res.ok) {
                        throw new Error(data.message || 'Booking failed');
                    }
                    return data;
                });
            })
            .then(function(response) {
                if (response.success) {
                    alert('Session booked successfully! Check your profile to view booking details.');
                    closeModal();
                } else {
                    throw new Error(response.message || 'Booking failed');
                }
            })
            .catch(function(err) {
                console.error('Error booking session:', err);
                alert('Failed to book session: ' + err.message);
            });
        });
    }
})();
