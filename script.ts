/**
 * Authify - Lightweight Authentication System
 * Compiled JavaScript from TypeScript with strict typing and real-time validation
 */

/**
 * Authify Class - Main authentication system
 */
class Authify {
    constructor() {
        this.users = [];
        this.elements = this.getFormElements();
        this.loadUsers();
        this.initializeEventListeners();
        this.showLoginForm();
    }
    
    /**
     * Get all required DOM elements with type safety
     */
    getFormElements() {
        const getElement = (id) => {
            const element = document.getElementById(id);
            if (!element) {
                throw new Error(`Element with id '${id}' not found`);
            }
            return element;
        };
        
        return {
            // Login form elements
            loginForm: getElement('loginForm'),
            loginEmail: getElement('loginEmail'),
            loginPassword: getElement('loginPassword'),
            loginEmailError: getElement('loginEmailError'),
            loginPasswordError: getElement('loginPasswordError'),
            
            // Signup form elements
            signupForm: getElement('signupForm'),
            signupUsername: getElement('signupUsername'),
            signupEmail: getElement('signupEmail'),
            signupPassword: getElement('signupPassword'),
            confirmPassword: getElement('confirmPassword'),
            signupUsernameError: getElement('signupUsernameError'),
            signupEmailError: getElement('signupEmailError'),
            signupPasswordError: getElement('signupPasswordError'),
            confirmPasswordError: getElement('confirmPasswordError'),
            
            // Password strength elements
            passwordStrength: getElement('passwordStrength'),
            strengthFill: getElement('strengthFill'),
            strengthText: getElement('strengthText'),
            
            // Navigation elements
            showSignup: getElement('showSignup'),
            showLogin: getElement('showLogin'),
            
            // Success message elements
            successMessage: getElement('successMessage'),
            successTitle: getElement('successTitle'),
            successText: getElement('successText'),
            successButton: getElement('successButton')
        };
    }
    
    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Form navigation
        this.elements.showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSignupForm();
        });
        
        this.elements.showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });
        
        // Form submissions
        this.elements.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        this.elements.signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });
        
        // Real-time validation for login
        this.elements.loginEmail.addEventListener('input', () => {
            this.validateLoginEmail();
        });
        
        this.elements.loginPassword.addEventListener('input', () => {
            this.validateLoginPassword();
        });
        
        // Real-time validation for signup
        this.elements.signupUsername.addEventListener('input', () => {
            this.validateUsername();
        });
        
        this.elements.signupEmail.addEventListener('input', () => {
            this.validateSignupEmail();
        });
        
        this.elements.signupPassword.addEventListener('input', () => {
            this.validateSignupPassword();
            this.checkPasswordStrength();
            this.validatePasswordConfirmation();
        });
        
        this.elements.confirmPassword.addEventListener('input', () => {
            this.validatePasswordConfirmation();
        });
        
        // Success message button
        this.elements.successButton.addEventListener('click', () => {
            this.hideSuccessMessage();
            this.showLoginForm();
        });
    }
    
    /**
     * Load users from localStorage
     */
    loadUsers() {
        try {
            const storedUsers = localStorage.getItem('authify_users');
            this.users = storedUsers ? JSON.parse(storedUsers) : [];
        } catch (error) {
            console.error('Error loading users from localStorage:', error);
            this.users = [];
        }
    }
    
    /**
     * Save users to localStorage
     */
    saveUsers() {
        try {
            localStorage.setItem('authify_users', JSON.stringify(this.users));
        } catch (error) {
            console.error('Error saving users to localStorage:', error);
        }
    }
    
    /**
     * Show login form
     */
    showLoginForm() {
        this.elements.loginForm.classList.add('active');
        this.elements.signupForm.classList.remove('active');
        this.clearAllErrors();
        this.clearAllInputs();
    }
    
    /**
     * Show signup form
     */
    showSignupForm() {
        this.elements.signupForm.classList.add('active');
        this.elements.loginForm.classList.remove('active');
        this.clearAllErrors();
        this.clearAllInputs();
    }
    
    /**
     * Email validation with regex
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email.trim()) {
            return { isValid: false, message: 'Email is required' };
        }
        
        if (!emailRegex.test(email)) {
            return { isValid: false, message: 'Please enter a valid email address' };
        }
        
        return { isValid: true, message: '' };
    }
    
    /**
     * Password strength calculation
     */
    calculatePasswordStrength(password) {
        let score = 0;
        
        // Length check
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        
        // Character variety checks
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        // Determine level and feedback
        if (score < 2) {
            return { score, level: 'weak', feedback: 'Very weak - Add more characters and variety' };
        } else if (score < 4) {
            return { score, level: 'fair', feedback: 'Fair - Add uppercase, numbers, or symbols' };
        } else if (score < 5) {
            return { score, level: 'good', feedback: 'Good - Consider adding special characters' };
        } else {
            return { score, level: 'strong', feedback: 'Strong password!' };
        }
    }
    
    /**
     * Username validation
     */
    validateUsername() {
        const username = this.elements.signupUsername.value.trim();
        
        if (!username) {
            this.showError(this.elements.signupUsernameError, 'Username is required');
            this.setInputState(this.elements.signupUsername, 'error');
            return { isValid: false, message: 'Username is required' };
        }
        
        if (username.length < 3) {
            this.showError(this.elements.signupUsernameError, 'Username must be at least 3 characters');
            this.setInputState(this.elements.signupUsername, 'error');
            return { isValid: false, message: 'Username must be at least 3 characters' };
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            this.showError(this.elements.signupUsernameError, 'Username can only contain letters, numbers, and underscores');
            this.setInputState(this.elements.signupUsername, 'error');
            return { isValid: false, message: 'Invalid username format' };
        }
        
        // Check if username already exists
        if (this.users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
            this.showError(this.elements.signupUsernameError, 'Username already exists');
            this.setInputState(this.elements.signupUsername, 'error');
            return { isValid: false, message: 'Username already exists' };
        }
        
        this.hideError(this.elements.signupUsernameError);
        this.setInputState(this.elements.signupUsername, 'success');
        return { isValid: true, message: '' };
    }
    
    /**
     * Validate login email
     */
    validateLoginEmail() {
        const email = this.elements.loginEmail.value.trim();
        const validation = this.validateEmail(email);
        
        if (!validation.isValid) {
            this.showError(this.elements.loginEmailError, validation.message);
            this.setInputState(this.elements.loginEmail, 'error');
        } else {
            this.hideError(this.elements.loginEmailError);
            this.setInputState(this.elements.loginEmail, 'success');
        }
        
        return validation;
    }
    
    /**
     * Validate login password
     */
    validateLoginPassword() {
        const password = this.elements.loginPassword.value;
        
        if (!password) {
            this.showError(this.elements.loginPasswordError, 'Password is required');
            this.setInputState(this.elements.loginPassword, 'error');
            return { isValid: false, message: 'Password is required' };
        }
        
        this.hideError(this.elements.loginPasswordError);
        this.setInputState(this.elements.loginPassword, 'success');
        return { isValid: true, message: '' };
    }
    
    /**
     * Validate signup email
     */
    validateSignupEmail() {
        const email = this.elements.signupEmail.value.trim();
        const validation = this.validateEmail(email);
        
        if (!validation.isValid) {
            this.showError(this.elements.signupEmailError, validation.message);
            this.setInputState(this.elements.signupEmail, 'error');
            return validation;
        }
        
        // Check if email already exists
        if (this.users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
            this.showError(this.elements.signupEmailError, 'Email already registered');
            this.setInputState(this.elements.signupEmail, 'error');
            return { isValid: false, message: 'Email already registered' };
        }
        
        this.hideError(this.elements.signupEmailError);
        this.setInputState(this.elements.signupEmail, 'success');
        return { isValid: true, message: '' };
    }
    
    /**
     * Validate signup password
     */
    validateSignupPassword() {
        const password = this.elements.signupPassword.value;
        
        if (!password) {
            this.showError(this.elements.signupPasswordError, 'Password is required');
            this.setInputState(this.elements.signupPassword, 'error');
            return { isValid: false, message: 'Password is required' };
        }
        
        if (password.length < 6) {
            this.showError(this.elements.signupPasswordError, 'Password must be at least 6 characters');
            this.setInputState(this.elements.signupPassword, 'error');
            return { isValid: false, message: 'Password too short' };
        }
        
        this.hideError(this.elements.signupPasswordError);
        this.setInputState(this.elements.signupPassword, 'success');
        return { isValid: true, message: '' };
    }
    
    /**
     * Validate password confirmation
     */
    validatePasswordConfirmation() {
        const password = this.elements.signupPassword.value;
        const confirmPassword = this.elements.confirmPassword.value;
        
        if (!confirmPassword) {
            this.showError(this.elements.confirmPasswordError, 'Please confirm your password');
            this.setInputState(this.elements.confirmPassword, 'error');
            return { isValid: false, message: 'Password confirmation required' };
        }
        
        if (password !== confirmPassword) {
            this.showError(this.elements.confirmPasswordError, 'Passwords do not match');
            this.setInputState(this.elements.confirmPassword, 'error');
            return { isValid: false, message: 'Passwords do not match' };
        }
        
        this.hideError(this.elements.confirmPasswordError);
        this.setInputState(this.elements.confirmPassword, 'success');
        return { isValid: true, message: '' };
    }
    
    /**
     * Check and display password strength
     */
    checkPasswordStrength() {
        const password = this.elements.signupPassword.value;
        
        if (!password) {
            this.elements.strengthFill.className = 'strength-fill';
            this.elements.strengthText.textContent = 'Password strength';
            return;
        }
        
        const strength = this.calculatePasswordStrength(password);
        
        // Update strength bar
        this.elements.strengthFill.className = `strength-fill ${strength.level}`;
        this.elements.strengthText.textContent = strength.feedback;
    }
    
    /**
     * Handle user login
     */
    handleLogin() {
        const emailValidation = this.validateLoginEmail();
        const passwordValidation = this.validateLoginPassword();
        
        if (!emailValidation.isValid || !passwordValidation.isValid) {
            return;
        }
        
        const credentials = {
            email: this.elements.loginEmail.value.trim().toLowerCase(),
            password: this.elements.loginPassword.value
        };
        
        // Find user with matching email and password
        const user = this.users.find(u => 
            u.email.toLowerCase() === credentials.email && 
            u.password === credentials.password
        );
        
        if (!user) {
            this.showError(this.elements.loginPasswordError, 'Invalid email or password');
            this.setInputState(this.elements.loginEmail, 'error');
            this.setInputState(this.elements.loginPassword, 'error');
            return;
        }
        
        // Successful login
        this.showSuccessMessage(
            'Login Successful!',
            `Welcome back, ${user.username}! You have been successfully logged in.`,
            'Continue to Dashboard'
        );
        
        // Store current user session
        try {
            localStorage.setItem('authify_current_user', JSON.stringify({
                username: user.username,
                email: user.email,
                loginTime: new Date().toISOString()
            }));
        } catch (error) {
            console.error('Error storing user session:', error);
        }
    }
    
    /**
     * Handle user signup
     */
    handleSignup() {
        const usernameValidation = this.validateUsername();
        const emailValidation = this.validateSignupEmail();
        const passwordValidation = this.validateSignupPassword();
        const confirmPasswordValidation = this.validatePasswordConfirmation();
        
        if (!usernameValidation.isValid || !emailValidation.isValid || 
            !passwordValidation.isValid || !confirmPasswordValidation.isValid) {
            return;
        }
        
        // Create new user
        const newUser = {
            username: this.elements.signupUsername.value.trim(),
            email: this.elements.signupEmail.value.trim().toLowerCase(),
            password: this.elements.signupPassword.value,
            createdAt: new Date().toISOString()
        };
        
        // Add user to storage
        this.users.push(newUser);
        this.saveUsers();
        
        // Show success message
        this.showSuccessMessage(
            'Account Created!',
            `Welcome to Authify, ${newUser.username}! Your account has been successfully created.`,
            'Sign In Now'
        );
    }
    
    /**
     * Show error message with animation
     */
    showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    /**
     * Hide error message with animation
     */
    hideError(errorElement) {
        errorElement.classList.remove('show');
        // Clear text after animation completes
        setTimeout(() => {
            if (!errorElement.classList.contains('show')) {
                errorElement.textContent = '';
            }
        }, 300);
    }
    
    /**
     * Set input field visual state
     */
    setInputState(input, state) {
        input.classList.remove('error', 'success');
        
        if (state !== 'normal') {
            input.classList.add(state);
        }
    }
    
    /**
     * Clear all form inputs
     */
    clearAllInputs() {
        // Login form
        this.elements.loginEmail.value = '';
        this.elements.loginPassword.value = '';
        
        // Signup form
        this.elements.signupUsername.value = '';
        this.elements.signupEmail.value = '';
        this.elements.signupPassword.value = '';
        this.elements.confirmPassword.value = '';
        
        // Reset input states
        [this.elements.loginEmail, this.elements.loginPassword,
         this.elements.signupUsername, this.elements.signupEmail,
         this.elements.signupPassword, this.elements.confirmPassword].forEach(input => {
            this.setInputState(input, 'normal');
        });
        
        // Reset password strength
        this.elements.strengthFill.className = 'strength-fill';
        this.elements.strengthText.textContent = 'Password strength';
    }
    
    /**
     * Clear all error messages
     */
    clearAllErrors() {
        [this.elements.loginEmailError, this.elements.loginPasswordError,
         this.elements.signupUsernameError, this.elements.signupEmailError,
         this.elements.signupPasswordError, this.elements.confirmPasswordError].forEach(errorElement => {
            this.hideError(errorElement);
        });
    }
    
    /**
     * Show success message
     */
    showSuccessMessage(title, text, buttonText) {
        this.elements.successTitle.textContent = title;
        this.elements.successText.textContent = text;
        this.elements.successButton.textContent = buttonText;
        
        // Hide forms and show success message
        this.elements.loginForm.classList.remove('active');
        this.elements.signupForm.classList.remove('active');
        this.elements.successMessage.classList.remove('hidden');
    }
    
    /**
     * Hide success message
     */
    hideSuccessMessage() {
        this.elements.successMessage.classList.add('hidden');
    }
    
    /**
     * Get current user session (utility method)
     */
    getCurrentUser() {
        try {
            const currentUser = localStorage.getItem('authify_current_user');
            return currentUser ? JSON.parse(currentUser) : null;
        } catch (error) {
            console.error('Error retrieving current user:', error);
            return null;
        }
    }
    
    /**
     * Logout current user (utility method)
     */
    logout() {
        try {
            localStorage.removeItem('authify_current_user');
            this.showLoginForm();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
    
    /**
     * Get all registered users (admin utility - remove in production)
     */
    getAllUsers() {
        return this.users.map(user => ({
            username: user.username,
            email: user.email,
            password: '***', // Hide passwords
            createdAt: user.createdAt
        }));
    }
}

/**
 * Utility Functions
 */

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Generate secure password suggestion
 */
function generateSecurePassword(length = 12) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Initialize Authify when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize the authentication system
        const authify = new Authify();
        
        // Make authify globally available for debugging/testing
        window.authify = authify;
        
        console.log('Authify authentication system initialized successfully');
        
        // Check if user is already logged in
        const currentUser = authify.getCurrentUser();
        if (currentUser) {
            console.log('User already logged in:', currentUser.username);
        }
        
    } catch (error) {
        console.error('Error initializing Authify:', error);
        alert('Error initializing authentication system. Please refresh the page.');
    }
});

/**
 * Export for module systems (if needed)
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Authify, debounce, sanitizeInput, generateSecurePassword };
}