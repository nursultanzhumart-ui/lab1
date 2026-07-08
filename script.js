/**
 * Zhumart Nursultan — Lab 7 Interactive JavaScript File
 * Designed to demonstrate DOM manipulation, event listeners, array methods, and debugging.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('script.js loaded successfully via defer');

    // ==================== 1. Linking & Selecting Elements ====================
    const themeBtn = document.querySelector('#theme-toggle');
    const msgInput = document.querySelector('#message');
    const counter = document.querySelector('#char-counter');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Form Elements
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const formSuccess = document.getElementById('form-success');

    // Theme state (let is required here as the state variable is reassigned)
    let isDark = false;

    // Load theme preference from localStorage if available
    if (localStorage.getItem('dark-theme') === 'true') {
        isDark = true;
        document.body.classList.add('dark-mode');
        themeBtn.innerHTML = '☀️ Light Theme';
        console.log('Initial theme: dark (loaded from localStorage)');
    }

    // ==================== 2. Theme Toggle Feature ====================
    function toggleTheme() {
        isDark = !isDark;
        document.body.classList.toggle('dark-mode', isDark);
        
        // Update button visual label
        themeBtn.innerHTML = isDark ? '☀️ Light Theme' : '🌙 Dark Theme';
        
        // Save preference
        localStorage.setItem('dark-theme', isDark);
        console.log('Theme toggled. Dark mode status:', isDark);
    }

    themeBtn.addEventListener('click', () => {
        toggleTheme();
    });

    // ==================== 3. Live Character Counter ====================
    msgInput.addEventListener('input', () => {
        const len = msgInput.value.length;
        counter.textContent = `${len}/1000`;
        
        // Add visual cues when getting close to limits
        if (len > 900) {
            counter.classList.replace('text-muted', 'text-danger');
        } else if (len > 750) {
            counter.classList.replace('text-muted', 'text-warning');
        } else {
            // Restore default
            counter.className = 'text-muted small';
        }
        
        console.log('Message character count updated:', len);
    });

    // ==================== 4. Project Filter Feature ====================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            
            // ==========================================
            // [DEBUGGER CHECKPOINT]
            // Uncomment the line below to pause execution in DevTools Sources panel.
            // ==========================================
            // debugger;

            const selectedCategory = e.currentTarget.dataset.category;
            console.log(`Filter button clicked. Category selected: "${selectedCategory}"`);

            // Update active status on filter buttons
            filterBtns.forEach(b => {
                b.classList.remove('btn-primary', 'active');
                b.classList.add('btn-outline-primary');
                b.setAttribute('aria-pressed', 'false');
            });
            e.currentTarget.classList.remove('btn-outline-primary');
            e.currentTarget.classList.add('btn-primary', 'active');
            e.currentTarget.setAttribute('aria-pressed', 'true');

            // Array to store filter results for console.table() debugging
            const debugProjectList = [];

            // Filter project cards using classList
            projectCards.forEach(card => {
                const cardCategory = card.dataset.category;
                const cardTitle = card.querySelector('.card-title').textContent;
                
                // Show if 'all' is selected or if the categories match
                const show = selectedCategory === 'all' || cardCategory === selectedCategory;
                
                card.classList.toggle('d-none', !show);

                // Collect data for debugging
                debugProjectList.push({
                    'Project Title': cardTitle,
                    'Category': cardCategory,
                    'Visible': show ? '✅ Visible' : '❌ Hidden'
                });
            });

            // Using console.table() to inspect array/object data (Satisfies submission requirement)
            console.log('Current filtering result table:');
            console.table(debugProjectList);
        });
    });

    // ==================== 5. Contact Form Validation ====================
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors(form);
        formSuccess.setAttribute('hidden', '');

        if (form.checkValidity()) {
            submitSuccess();
        } else {
            showErrors(form);
        }
    });

    function showErrors(form) {
        const invalidFields = form.querySelectorAll(':invalid');
        console.log(`Form submission failed. Found ${invalidFields.length} invalid fields.`);

        invalidFields.forEach(function (el) {
            const errorId = el.id + '-error';
            const errorEl = document.getElementById(errorId);
            
            if (errorEl) {
                errorEl.removeAttribute('hidden');
                
                // Set descriptive custom error messages using Constraint Validation API
                if (el.validity.valueMissing) {
                    errorEl.textContent = 'This field is required.';
                } else if (el.validity.typeMismatch) {
                    errorEl.textContent = 'Please enter a valid email address.';
                } else if (el.validity.tooShort) {
                    errorEl.textContent = `Please enter at least ${el.minLength} characters. Current length: ${el.value.length}.`;
                } else if (el.validity.tooLong) {
                    errorEl.textContent = `Please enter no more than ${el.maxLength} characters.`;
                } else {
                    errorEl.textContent = 'Please fill out this field correctly.';
                }
            }
            el.setAttribute('aria-invalid', 'true');
        });

        // Focus the first invalid field for better accessibility & keyboard flow
        if (invalidFields.length > 0) {
            invalidFields[0].focus();
            console.log(`Focused on the first invalid field: #${invalidFields[0].id}`);
        }
    }

    function clearErrors(form) {
        form.querySelectorAll('[aria-invalid]').forEach(function (el) {
            el.setAttribute('aria-invalid', 'false');
            const errorEl = document.getElementById(el.id + '-error');
            if (errorEl) {
                errorEl.setAttribute('hidden', '');
            }
        });
    }

    function submitSuccess() {
        console.log('Form data is valid. Proceeding with simulated submit...');

        // Transition submit button state
        btnText.textContent = 'Sending...';
        btnSpinner.removeAttribute('hidden');
        submitBtn.disabled = true;

        // Simulate server POST delay (1.5 seconds)
        setTimeout(() => {
            const formData = new FormData(form);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            console.log('Form successfully sent! Form payload:');
            console.table(formObject);

            form.reset();
            btnText.textContent = 'Send Message';
            btnSpinner.setAttribute('hidden', '');
            submitBtn.disabled = false;
            
            // Show Success Notification
            formSuccess.removeAttribute('hidden');
            counter.textContent = '0/1000'; // Reset char counter visually

            // Reset accessibility indicators
            form.querySelectorAll('[aria-invalid]').forEach(el => {
                el.setAttribute('aria-invalid', 'false');
            });
        }, 1500);
    }

    // Real-time validation updates on blur
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(field => {
        field.addEventListener('blur', function () {
            if (this.value.trim() !== '' || this.hasAttribute('required')) {
                const errorEl = document.getElementById(this.id + '-error');
                
                if (!this.checkValidity()) {
                    this.setAttribute('aria-invalid', 'true');
                    if (errorEl) {
                        errorEl.removeAttribute('hidden');
                        if (this.validity.valueMissing) {
                            errorEl.textContent = 'This field is required.';
                        } else if (this.validity.typeMismatch) {
                            errorEl.textContent = 'Please enter a valid email address.';
                        } else if (this.validity.tooShort) {
                            errorEl.textContent = `Please enter at least ${this.minLength} characters.`;
                        }
                    }
                    console.log(`Real-time validation: Field #${this.id} is INVALID.`);
                } else {
                    this.setAttribute('aria-invalid', 'false');
                    if (errorEl) {
                        errorEl.setAttribute('hidden', '');
                    }
                    console.log(`Real-time validation: Field #${this.id} is VALID.`);
                }
            }
        });

        // Hide errors dynamically as soon as input becomes valid
        field.addEventListener('input', function () {
            if (this.checkValidity()) {
                this.setAttribute('aria-invalid', 'false');
                const errorEl = document.getElementById(this.id + '-error');
                if (errorEl) {
                    errorEl.setAttribute('hidden', '');
                }
            }
        });
    });
});
