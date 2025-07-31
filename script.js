/**
 * Authify - Lightweight Authentication System
 * Compiled JavaScript from TypeScript with strict typing and real-time validation
 */
/**
 * Authify Class - Main authentication system
 */
var Authify = /** @class */ (function () {
    function Authify() {
        this.users = [];
        this.elements = this.getFormElements();
        this.loadUsers();
        this.initializeEventListeners();
        this.showLoginForm();
    }
    /**
     * Get all required DOM elements with type safety
     */
    Authify.prototype.getFormElements = function () {
        var getElement = function (id) {
            var element = document.getElementById(id);
            if (!element) {
                throw new Error("Element with id '".concat(id, "' not found"));
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
    };
    /**
     * Initialize all event listeners
     */
    Authify.prototype.initializeEventListeners = function () {
        var _this = this;
        // Form navigation
        this.elements.showSignup.addEventListener('click', function (e) {
            e.preventDefault();
            _this.showSignupForm();
        });
        this.elements.showLogin.addEventListener('click', function (e) {
            e.preventDefault();
            _this.showLoginForm();
        });
        // Form submissions
        this.elements.loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            _this.handleLogin();
        });
        this.elements.signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            _this.handleSignup();
        });
        // Real-time validation for login
        this.elements.loginEmail.addEventListener('input', function () {
            _this.validateLoginEmail();
        });
        this.elements.loginPassword.addEventListener('input', function () {
            _this.validateLoginPassword();
        });
        // Real-time validation for signup
        this.elements.signupUsername.addEventListener('input', function () {
            _this.validateUsername();
        });
        this.elements.signupEmail.addEventListener('input', function () {
            _this.validateSignupEmail();
        });
        this.elements.signupPassword.addEventListener('input', function () {
            _this.validateSignupPassword();
            _this.checkPasswordStrength();
            _this.validatePasswordConfirmation();
        });
        this.elements.confirmPassword.addEventListener('input', function () {
            _this.validatePasswordConfirmation();
        });
        // Success message button
        this.elements.successButton.addEventListener('click', function () {
            _this.hideSuccessMessage();
            _this.showLoginForm();
        });
    };
    /**
     * Load users from localStorage
     */
    Authify.prototype.loadUsers = function () {
        try {
            var storedUsers = localStorage.getItem('authify_users');
            this.users = storedUsers ? JSON.parse(storedUsers) : [];
        }
        catch (error) {
            console.error('Error loading users from localStorage:', error);
            this.users = [];
        }
    };
    /**
     * Save users to localStorage
     */
    Authify.prototype.saveUsers = function () {
        try {
            localStorage.setItem('authify_users', JSON.stringify(this.users));
        }
        catch (error) {
            console.error('Error saving users to localStorage:', error);
        }
    };
    /**
     * Show login form
     */
    Authify.prototype.showLoginForm = function () {
        this.elements.loginForm.classList.add('active');
        this.elements.signupForm.classList.remove('active');
        this.clearAllErrors();
        this.clearAllInputs();
    };
    /**
     * Show signup form
     */
    Authify.prototype.showSignupForm = function () {
        this.elements.signupForm.classList.add('active');
        this.elements.loginForm.classList.remove('active');
        this.clearAllErrors();
        this.clearAllInputs();
    };
    /**
     * Email validation with regex
     */
    Authify.prototype.validateEmail = function (email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            return { isValid: false, message: 'Email is required' };
        }
        if (!emailRegex.test(email)) {
            return { isValid: false, message: 'Please enter a valid email address' };
        }
        return { isValid: true, message: '' };
    };
    /**
     * Password strength calculation
     */
    Authify.prototype.calculatePasswordStrength = function (password) {
        var score = 0;
        // Length check
        if (password.length >= 8)
            score += 1;
        if (password.length >= 12)
            score += 1;
        // Character variety checks
        if (/[a-z]/.test(password))
            score += 1;
        if (/[A-Z]/.test(password))
            score += 1;
        if (/[0-9]/.test(password))
            score += 1;
        if (/[^A-Za-z0-9]/.test(password))
            score += 1;
        // Determine level and feedback
        if (score < 2) {
            return { score: score, level: 'weak', feedback: 'Very weak - Add more characters and variety' };
        }
        else if (score < 4) {
            return { score: score, level: 'fair', feedback: 'Fair - Add uppercase, numbers, or symbols' };
        }
        else if (score < 5) {
            return { score: score, level: 'good', feedback: 'Good - Consider adding special characters' };
        }
        else {
            return { score: score, level: 'strong', feedback: 'Strong password!' };
        }
    };
    /**
     * Username validation
     */
    Authify.prototype.validateUsername = function () {
        var username = this.elements.signupUsername.value.trim();
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
        if (this.users.some(function (user) { return user.username.toLowerCase() === username.toLowerCase(); })) {
            this.showError(this.elements.signupUsernameError, 'Username already exists');
            this.setInputState(this.elements.signupUsername, 'error');
            return { isValid: false, message: 'Username already exists' };
        }
        this.hideError(this.elements.signupUsernameError);
        this.setInputState(this.elements.signupUsername, 'success');
        return { isValid: true, message: '' };
    };
    /**
     * Validate login email
     */
    Authify.prototype.validateLoginEmail = function () {
        var email = this.elements.loginEmail.value.trim();
        var validation = this.validateEmail(email);
        if (!validation.isValid) {
            this.showError(this.elements.loginEmailError, validation.message);
            this.setInputState(this.elements.loginEmail, 'error');
        }
        else {
            this.hideError(this.elements.loginEmailError);
            this.setInputState(this.elements.loginEmail, 'success');
        }
        return validation;
    };
    /**
     * Validate login password
     */
    Authify.prototype.validateLoginPassword = function () {
        var password = this.elements.loginPassword.value;
        if (!password) {
            this.showError(this.elements.loginPasswordError, 'Password is required');
            this.setInputState(this.elements.loginPassword, 'error');
            return { isValid: false, message: 'Password is required' };
        }
        this.hideError(this.elements.loginPasswordError);
        this.setInputState(this.elements.loginPassword, 'success');
        return { isValid: true, message: '' };
    };
    /**
     * Validate signup email
     */
    Authify.prototype.validateSignupEmail = function () {
        var email = this.elements.signupEmail.value.trim();
        var validation = this.validateEmail(email);
        if (!validation.isValid) {
            this.showError(this.elements.signupEmailError, validation.message);
            this.setInputState(this.elements.signupEmail, 'error');
            return validation;
        }
        // Check if email already exists
        if (this.users.some(function (user) { return user.email.toLowerCase() === email.toLowerCase(); })) {
            this.showError(this.elements.signupEmailError, 'Email already registered');
            this.setInputState(this.elements.signupEmail, 'error');
            return { isValid: false, message: 'Email already registered' };
        }
        this.hideError(this.elements.signupEmailError);
        this.setInputState(this.elements.signupEmail, 'success');
        return { isValid: true, message: '' };
    };
    /**
     * Validate signup password
     */
    Authify.prototype.validateSignupPassword = function () {
        var password = this.elements.signupPassword.value;
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
    };
    /**
     * Validate password confirmation
     */
    Authify.prototype.validatePasswordConfirmation = function () {
        var password = this.elements.signupPassword.value;
        var confirmPassword = this.elements.confirmPassword.value;
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
    };
    /**
     * Check and display password strength
     */
    Authify.prototype.checkPasswordStrength = function () {
        var password = this.elements.signupPassword.value;
        if (!password) {
            this.elements.strengthFill.className = 'strength-fill';
            this.elements.strengthText.textContent = 'Password strength';
            return;
        }
        var strength = this.calculatePasswordStrength(password);
        // Update strength bar
        this.elements.strengthFill.className = "strength-fill ".concat(strength.level);
        this.elements.strengthText.textContent = strength.feedback;
    };
    /**
     * Handle user login
     */
    Authify.prototype.handleLogin = function () {
        var emailValidation = this.validateLoginEmail();
        var passwordValidation = this.validateLoginPassword();
        if (!emailValidation.isValid || !passwordValidation.isValid) {
            return;
        }
        var credentials = {
            email: this.elements.loginEmail.value.trim().toLowerCase(),
            password: this.elements.loginPassword.value
        };
        // Find user with matching email and password
        var user = this.users.find(function (u) {
            return u.email.toLowerCase() === credentials.email &&
                u.password === credentials.password;
        });
        if (!user) {
            this.showError(this.elements.loginPasswordError, 'Invalid email or password');
            this.setInputState(this.elements.loginEmail, 'error');
            this.setInputState(this.elements.loginPassword, 'error');
            return;
        }
        // Successful login
        this.showSuccessMessage('Login Successful!', "Welcome back, ".concat(user.username, "! You have been successfully logged in."), 'Continue to Dashboard');
        // Store current user session
        try {
            localStorage.setItem('authify_current_user', JSON.stringify({
                username: user.username,
                email: user.email,
                loginTime: new Date().toISOString()
            }));
        }
        catch (error) {
            console.error('Error storing user session:', error);
        }
    };
    /**
     * Handle user signup
     */
    Authify.prototype.handleSignup = function () {
        var usernameValidation = this.validateUsername();
        var emailValidation = this.validateSignupEmail();
        var passwordValidation = this.validateSignupPassword();
        var confirmPasswordValidation = this.validatePasswordConfirmation();
        if (!usernameValidation.isValid || !emailValidation.isValid ||
            !passwordValidation.isValid || !confirmPasswordValidation.isValid) {
            return;
        }
        // Create new user
        var newUser = {
            username: this.elements.signupUsername.value.trim(),
            email: this.elements.signupEmail.value.trim().toLowerCase(),
            password: this.elements.signupPassword.value,
            createdAt: new Date().toISOString()
        };
        // Add user to storage
        this.users.push(newUser);
        this.saveUsers();
        // Show success message
        this.showSuccessMessage('Account Created!', "Welcome to Authify, ".concat(newUser.username, "! Your account has been successfully created."), 'Sign In Now');
    };
    /**
     * Show error message with animation
     */
    Authify.prototype.showError = function (errorElement, message) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    };
    /**
     * Hide error message with animation
     */
    Authify.prototype.hideError = function (errorElement) {
        errorElement.classList.remove('show');
        // Clear text after animation completes
        setTimeout(function () {
            if (!errorElement.classList.contains('show')) {
                errorElement.textContent = '';
            }
        }, 300);
    };
    /**
     * Set input field visual state
     */
    Authify.prototype.setInputState = function (input, state) {
        input.classList.remove('error', 'success');
        if (state !== 'normal') {
            input.classList.add(state);
        }
    };
    /**
     * Clear all form inputs
     */
    Authify.prototype.clearAllInputs = function () {
        var _this = this;
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
            this.elements.signupPassword, this.elements.confirmPassword].forEach(function (input) {
            _this.setInputState(input, 'normal');
        });
        // Reset password strength
        this.elements.strengthFill.className = 'strength-fill';
        this.elements.strengthText.textContent = 'Password strength';
    };
    /**
     * Clear all error messages
     */
    Authify.prototype.clearAllErrors = function () {
        var _this = this;
        [this.elements.loginEmailError, this.elements.loginPasswordError,
            this.elements.signupUsernameError, this.elements.signupEmailError,
            this.elements.signupPasswordError, this.elements.confirmPasswordError].forEach(function (errorElement) {
            _this.hideError(errorElement);
        });
    };
    /**
     * Show success message
     */
    Authify.prototype.showSuccessMessage = function (title, text, buttonText) {
        this.elements.successTitle.textContent = title;
        this.elements.successText.textContent = text;
        this.elements.successButton.textContent = buttonText;
        // Hide forms and show success message
        this.elements.loginForm.classList.remove('active');
        this.elements.signupForm.classList.remove('active');
        this.elements.successMessage.classList.remove('hidden');
    };
    /**
     * Hide success message
     */
    Authify.prototype.hideSuccessMessage = function () {
        this.elements.successMessage.classList.add('hidden');
    };
    /**
     * Get current user session (utility method)
     */
    Authify.prototype.getCurrentUser = function () {
        try {
            var currentUser = localStorage.getItem('authify_current_user');
            return currentUser ? JSON.parse(currentUser) : null;
        }
        catch (error) {
            console.error('Error retrieving current user:', error);
            return null;
        }
    };
    /**
     * Logout current user (utility method)
     */
    Authify.prototype.logout = function () {
        try {
            localStorage.removeItem('authify_current_user');
            this.showLoginForm();
        }
        catch (error) {
            console.error('Error during logout:', error);
        }
    };
    /**
     * Get all registered users (admin utility - remove in production)
     */
    Authify.prototype.getAllUsers = function () {
        return this.users.map(function (user) { return ({
            username: user.username,
            email: user.email,
            password: '***', // Hide passwords
            createdAt: user.createdAt
        }); });
    };
    return Authify;
}());
/**
 * Utility Functions
 */
/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    var timeout;
    return function executedFunction() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var later = function () {
            clearTimeout(timeout);
            func.apply(void 0, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput(input) {
    var div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}
/**
 * Generate secure password suggestion
 */
function generateSecurePassword(length) {
    if (length === void 0) { length = 12; }
    var lowercase = 'abcdefghijklmnopqrstuvwxyz';
    var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var numbers = '0123456789';
    var symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    var allChars = lowercase + uppercase + numbers + symbols;
    var password = '';
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    // Fill the rest randomly
    for (var i = 4; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    // Shuffle the password
    return password.split('').sort(function () { return Math.random() - 0.5; }).join('');
}
/**
 * Initialize Authify when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    try {
        // Initialize the authentication system
        var authify = new Authify();
        // Make authify globally available for debugging/testing
        window.authify = authify;
        console.log('Authify authentication system initialized successfully');
        // Check if user is already logged in
        var currentUser = authify.getCurrentUser();
        if (currentUser) {
            console.log('User already logged in:', currentUser.username);
        }
    }
    catch (error) {
        console.error('Error initializing Authify:', error);
        alert('Error initializing authentication system. Please refresh the page.');
    }
});
/**
 * Export for module systems (if needed)
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Authify: Authify, debounce: debounce, sanitizeInput: sanitizeInput, generateSecurePassword: generateSecurePassword };
}
