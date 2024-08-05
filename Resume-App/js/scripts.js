// Store credentials in local storage
const USERNAME = 'user';
const PASSWORD = 'password';
localStorage.setItem('username', USERNAME);
localStorage.setItem('password', PASSWORD);

let originalResumes = []; // Store original resumes data

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is on the resume page
    if (window.location.pathname.endsWith('resume.html')) {
        // Verify credentials
        if (!localStorage.getItem('username') || !localStorage.getItem('password')) {
            window.location.href = 'login.html'; // Redirect to login if not authenticated
        } else {
            // If authenticated, fetch resumes and display
            fetch('data/resumes.json')
                .then(response => response.json())
                .then(data => {
                    originalResumes = data.resume; // Store the original resumes
                    window.resumes = [...originalResumes]; // Clone the original data to window.resumes
                    displayResume(0);
                    document.getElementById('prev-btn').addEventListener('click', () => navigateResume(-1));
                    document.getElementById('next-btn').addEventListener('click', () => navigateResume(1));
                    document.getElementById('job-search').addEventListener('input', searchResumes);
                })
                .catch(error => console.error('Error fetching resumes:', error));
        }
    }

    // If on login page, set up login form validation
    if (window.location.pathname.endsWith('login.html')) {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', validateLogin);
    }
});


function validateLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (username === localStorage.getItem('username') && password === localStorage.getItem('password')) {
        history.replaceState(null, null, 'resume.html');
        window.location.href = 'resume.html';
    } else {
        errorMessage.textContent = 'Invalid username/password.';
    }
}

let currentIndex = 0;

function displayResume(index) {
    const resume = window.resumes[index];
    const detailsContainer = document.getElementById('resume-details');
    if (resume) {
        detailsContainer.innerHTML = `
            <div class="resume-header">
                <h3>${resume.basics.name}</h3>
                <p>Applied For: ${resume.basics.AppliedFor}</p>
            </div>
            <div class="resume-container">
                <div class="left-column">
                    <div class="section">
                        <h4>Personal Information</h4>
                        <p>Email: ${resume.basics.email}</p>
                        <p>Phone: ${resume.basics.phone}</p>
                        <p>Address: ${resume.basics.location.address}, ${resume.basics.location.city}, ${resume.basics.location.state} - ${resume.basics.location.postalCode}</p>
                        <p>LinkedIn: <a href="${resume.basics.profiles.url}" target="_blank">${resume.basics.profiles.network}</a></p>
                    </div>
                    <div class="section">
                        <h4>Skills</h4>
                        <p>${resume.skills.name} (${resume.skills.level})</p>
                        <p>${resume.skills.keywords.join(', ')}</p>
                    </div>
                    <div class="section">
                        <h4>Hobbies</h4>
                        <p>${resume.interests.hobbies.join(', ')}</p>
                    </div>
                </div>
                <div class="right-column">
                    <h4>Work Experience</h4>
                    <p>${resume.work['Company Name']}, ${resume.work.Position} (${resume.work['Start Date']} - ${resume.work['End Date']})</p>
                    <p>${resume.work.Summary}</p>
                    <h4>Internship</h4>
                    <p>${resume.Internship['Company Name']}, ${resume.Internship.Position} (${resume.Internship['Start Date']} - ${resume.Internship['End Date']})</p>
                    <p>${resume.Internship.Summary}</p>
                    <h4>Projects</h4>
                    <p>${resume.projects.name}</p>
                    <p>${resume.projects.description}</p>
                    <h4>Education</h4>
                    <p>UG: ${resume.education.UG.institute}, ${resume.education.UG.course} (${resume.education.UG['Start Date']} - ${resume.education.UG['End Date']})</p>
                    <p>CGPA: ${resume.education.UG.cgpa}</p>
                    <p>Senior Secondary: ${resume.education['Senior Secondary'].institute}, CGPA: ${resume.education['Senior Secondary'].cgpa}</p>
                    <p>High School: ${resume.education['High School'].institute}, CGPA: ${resume.education['High School'].cgpa}</p>
                    <h4>Achievements</h4>
                    <p>${resume.achievements.Summary.join(', ')}</p>
                </div>
            </div>
        `;
    }
    document.getElementById('prev-btn').style.display = index === 0 ? 'none' : 'inline-block';
    document.getElementById('next-btn').style.display = index === window.resumes.length - 1 ? 'none' : 'inline-block';
}

function navigateResume(direction) {
    currentIndex += direction;
    currentIndex = Math.max(0, Math.min(currentIndex, window.resumes.length - 1));
    displayResume(currentIndex);
}

function showToast(message, icon) {
    Toastify({
        text: `${icon} ${message}`,
        duration: 3000, // Duration in milliseconds
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        backgroundColor: "#ff6b6b", // Custom background color
        className: "custom-toast", // Add custom class for styling
        stopOnFocus: true, // Prevents dismissing of toast on hover
    }).showToast();
}

function searchResumes() {
    const job = document.getElementById('job-search').value.toLowerCase();

    // Filter original resumes data instead of modified window.resumes
    const filteredResumes = originalResumes.filter(resume => resume.basics.AppliedFor.toLowerCase() === job);

    if (filteredResumes.length > 0) {
        window.resumes = filteredResumes; // Update window.resumes with filtered results
        currentIndex = 0; // Reset index for new filtered resumes
        displayResume(currentIndex);
    } else {
        document.getElementById('resume-details').innerHTML = '<p>Invalid search or No applications for this job</p>';
        document.getElementById('prev-btn').style.display = 'none';
        document.getElementById('next-btn').style.display = 'none';

        showToast('No applications found for this job', '❌');
    }
}