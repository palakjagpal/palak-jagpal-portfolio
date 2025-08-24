// Await for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Get the contact form container and the title element
    const contactFormContainer = document.getElementById('contact-form-container');
    const contactToggle = document.querySelector('.contact-toggle');
    const contactArrow = document.getElementById('contact-arrow');
    const contactForm = document.getElementById('contactForm');
    const formMessageBox = document.getElementById('form-message-box');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    // Only proceed if all required elements are found
    if (contactFormContainer && contactToggle && contactArrow && contactForm && formMessageBox && nameInput && emailInput && messageInput && nameError && emailError && messageError) {
        // Hide the form by default
        contactFormContainer.classList.remove('open');
        contactArrow.classList.remove('fa-circle-arrow-up');
        contactArrow.classList.add('fa-circle-arrow-down');

        // Add a click event listener to the contact title
        contactToggle.addEventListener('click', function() {
            // Toggle the 'open' class on the container for smooth animation
            contactFormContainer.classList.toggle('open');
            
            // Toggle the arrow icon
            if (contactFormContainer.classList.contains('open')) {
                contactArrow.classList.remove('fa-circle-arrow-down');
                contactArrow.classList.add('fa-circle-arrow-up');
            } else {
                contactArrow.classList.remove('fa-circle-arrow-up');
                contactArrow.classList.add('fa-circle-arrow-down');
            }
        });
    } else {
        console.error("Could not find all required elements for the collapsible contact form. Please check your HTML file.");
    }

    /**
     * Shows a message box with a given message and style, then hides it after a timeout.
     * @param {string} message The message to display.
     * @param {string} type The type of message ('success' or 'error').
     */
    function showMessage(message, type) {
        formMessageBox.textContent = message;
        formMessageBox.className = 'form-message-box'; // Reset classes
        formMessageBox.classList.add('fadeInOut');
        formMessageBox.classList.add(type);
        formMessageBox.style.display = 'block';

        setTimeout(() => {
            formMessageBox.style.display = 'none';
        }, 5000);
    }

    /**
     * Clears all validation errors and resets input field styling.
     */
    function clearErrors() {
        // Clear all error messages
        nameError.textContent = '';
        emailError.textContent = '';
        messageError.textContent = '';
        
        // Hide error message elements
        nameError.classList.remove('visible');
        emailError.classList.remove('visible');
        messageError.classList.remove('visible');

        // Remove invalid class from inputs
        nameInput.classList.remove('invalid');
        emailInput.classList.remove('invalid');
        messageInput.classList.remove('invalid');
    }

    /**
     * Displays a validation error message for a specific input field.
     * @param {HTMLElement} errorElement The span element to display the error.
     * @param {HTMLElement} inputElement The input element to style as invalid.
     * @param {string} message The error message to display.
     */
    function displayError(errorElement, inputElement, message) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
        inputElement.classList.add('invalid');
    }

    /**
     * Validates the contact form fields.
     * @returns {boolean} True if the form is valid, false otherwise.
     */
    function validateForm() {
        let isValid = true;
        clearErrors();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Regex for name validation (letters, spaces, hyphens)
        const nameRegex = /^[A-Za-z\s-]+$/;
        // Basic regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validate Name
        if (name === '') {
            displayError(nameError, nameInput, 'Name is required.');
            isValid = false;
        } else if (!nameRegex.test(name)) {
            displayError(nameError, nameInput, 'Name can only contain letters, spaces, and hyphens.');
            isValid = false;
        }

        // Validate Email
        if (email === '') {
            displayError(emailError, emailInput, 'Email is required.');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            displayError(emailError, emailInput, 'Please enter a valid email address.');
            isValid = false;
        }

        // Validate Message
        if (message === '') {
            displayError(messageError, messageInput, 'Message is required.');
            isValid = false;
        }

        return isValid;
    }

    // The existing form submission logic updated for validation
    contactForm.addEventListener('submit', function(event) {
        // Prevent the actual form submission
        event.preventDefault();
        
        // Validate the form
        if (validateForm()) {
            // If the form is valid, show the success message
            showMessage('Successfully contacted!', 'success');
            // Clear the form after a successful submission
            contactForm.reset();
        } else {
            // If the form is invalid, show a generic error message
            showMessage('Please enter correct information in the form.', 'error');
        }
    });
});

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top-btn');

// Show/hide button on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Scroll to top on click
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/**
 * Initializes Intersection Observer to animate elements on scroll.
 * Keeps Animate.css classes from HTML and re-triggers them each time.
 */
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate__animated');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add "in-view" for CSS fade/slide
                    entry.target.classList.add('in-view');

                    // Find Animate.css classes (all starting with "animate__")
                    const animateClasses = Array.from(entry.target.classList)
                        .filter(c => c.startsWith('animate__') && c !== 'animate__animated');

                    // Re-trigger Animate.css: remove + re-add
                    animateClasses.forEach(cls => {
                        entry.target.classList.remove(cls);
                        void entry.target.offsetWidth; // Force reflow
                        entry.target.classList.add(cls);
                    });

                } else {
                    // Remove in-view so CSS + Animate.css can replay
                    entry.target.classList.remove('in-view');
                }
            });
        }, { threshold: 0.2 });

        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for old browsers
        animatedElements.forEach(el => el.classList.add('in-view'));
    }
}

// Run animations setup
document.addEventListener('DOMContentLoaded', setupScrollAnimations);
