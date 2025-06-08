const formBox = document.getElementById('form-box');
let isSignIn = true;

function renderForm() {
    formBox.innerHTML = isSignIn ? `
    <div class="header-group">
        <img src="Images/logo.png" class="logo" alt="Urbiztondo Logo" />
        <h2>Welcome!</h2>
        <p>Sign in to continue</p>
    </div>

    <div class="input-group">
        <label for="signin-email-phone">Email or phone number</label>
        <input type="text" id="signin-email-phone" placeholder="Enter your email or phone" />
    </div>

    <div class="input-group">
        <label for="signin-password">Enter password</label>
        <input type="password" id="signin-password" placeholder="Enter your password" />
    </div>

    <div class="checkbox-group">
        <input type="checkbox" id="remember" />
        <label for="remember">Remember me</label>
    </div>
        <a href="#" class="forgot-password-link">Forgot password?</a>
        <button class="btn" type="submit">Sign in</button>
        <div class="social-label">Or sign in with</div>
        <div class="social-btns">
            <a href="#" class="social-btn" role="button">
                <img src="Images/google_logo.jpg" alt="Google Logo" /> Google
            </a>
        </div>
        <div class="toggle-link">Don't have an account? <a href="#" onclick="toggleForm()">Sign up now</a></div>
        ` : `
        <div class="header-group">
            <img src="Images/logo.png" class="logo" alt="Urbiztondo Logo" />
            <h2>Create a new account</h2>
            <p>Join us and discover more!</p>
        </div>

        <div class="input-group">
            <label for="signup-first-name">First Name</label>
            <input type="text" id="signup-first-name" placeholder="Your First Name" />
        </div>

        <div class="input-group">
            <label for="signup-last-name">Last Name</label>
            <input type="text" id="signup-last-name" placeholder="Your Last Name" />
        </div>

        <div class="input-group">
            <label for="signup-gender">Gender</label>
            <select id="signup-gender">
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Prefer not to say</option>
            </select>
        </div>

        <div class="input-group">
            <label for="signup-birth-date">Birth Date (MM/DD/YYYY)</label>
            <input type="text" id="signup-birth-date" placeholder="MM/DD/YYYY" />
        </div>

        <div class="input-group">
            <label for="signup-email">Email address</label>
            <input type="email" id="signup-email" placeholder="your.email@example.com" />
        </div>

        <div class="input-group">
            <label for="signup-mobile">Mobile number</label>
            <input type="text" id="signup-mobile" placeholder="e.g., +639123456789" />
        </div>

        <div class="input-group">
            <label for="signup-password">Enter password</label>
            <input type="password" id="signup-password" placeholder="Create a strong password" />
        </div>

        <div class="input-group">
            <label for="signup-confirm-password">Confirm password</label>
            <input type="password" id="signup-confirm-password" placeholder="Re-enter your password" />
        </div>

        <div class="checkbox-group">
            <input type="checkbox" id="resident" />
            <label for="resident">Resident of URBIZTONDO</label>
        </div>

        <div class="checkbox-group">
            <input type="checkbox" id="terms" />
            <label for="terms">I've read and agree with <a href="terms.html" class="Terms-link">Terms of Service</a> and <a href="policy.html" class="Policy-link">Privacy Policy</a></label>
        </div>

        <button class="btn" type="submit">Create account</button>
        <div class="social-label">Or sign up with</div>
        <div class="social-btns">
            <a href="#" class="social-btn" role="button">
                <img src="Images/google_logo.jpg" alt="Google Logo" /> Google
            </a>
            <a href="#" class="social-btn" role="button">
                <img src="Images/fb_logo.jpg" alt="Facebook Logo" /> Facebook
            </a>
        </div>

        <div class="toggle-link">Already a member? <a href="#" onclick="toggleForm()">Sign in</a></div>
                `;
}

function toggleForm() {
    formBox.classList.add('fade-out');
    setTimeout(() => {
        isSignIn = !isSignIn;
        renderForm();
        formBox.classList.remove('fade-out');
        formBox.classList.add('fade-in');
        setTimeout(() => {
            formBox.classList.remove('fade-in');
        }, 300);
    }, 300);
}

renderForm();