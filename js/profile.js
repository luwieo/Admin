document.addEventListener('DOMContentLoaded', function() {
    // Selects all top-level sidebar menu links.
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
    // Selects all sidebar links.
    const sidebarLinks = document.querySelectorAll('#sidebar .side-menu a');
    // Defines an object mapping content IDs to their respective HTML elements.
    const contentAreas = {
        'dashboard': document.getElementById('dashboard-content'),
        'analytics': document.getElementById('analytics-content'),
        'messages': document.getElementById('messages-content'),
        'settings' : document.getElementById('settings'),
        'logout' : document.getElementById('log-out')
    };
    // Selects the main content area of the page.
    const mainContent = document.querySelector('main');

    // Function to load content dynamically via fetch API.
    async function loadContent(targetId, url) {
        try {
            // Fetches content from the specified URL.
            const response = await fetch(url);
            // Throws an error if the HTTP response is not OK.
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Parses the response as plain text (HTML).
            const html = await response.text();
            // If the target content area exists, update its inner HTML.
            if (contentAreas[targetId]) {
                contentAreas[targetId].innerHTML = html;
                // Specifically for 'messages' content, execute any inline scripts.
                if (targetId === 'messages') {
                    const scriptTags = contentAreas[targetId].querySelectorAll('script');
                    scriptTags.forEach(script => {
                        // Executes the script's content. Caution: eval can be a security risk.
                        eval(script.textContent);
                    });
                }
            }
        } catch (error) {
            // Logs an error if content loading fails.
            console.error('Failed to load content:', error);
            // Displays a fallback message in the content area if loading fails.
            if (contentAreas[targetId]) {
                contentAreas[targetId].innerHTML = '<p>Failed to load content.</p>';
            }
        }
    }

    // Function to show a specific content area and hide all others.
    function showContent(targetId) {
        // Iterates through all content areas and sets their display style.
        for (const id in contentAreas) {
            contentAreas[id].style.display = (id === targetId) ? 'block' : 'none';
        }

        // Updates the 'active' class on sidebar links to highlight the current section.
        sidebarLinks.forEach(link => {
            if (link.dataset.target === targetId) {
                link.parentNode.classList.add('active');
            } else {
                link.parentNode.classList.remove('active');
            }
        });
    }

    // Event listener for sidebar links to handle content switching.
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevents the default link behavior (page reload).
            const target = this.dataset.target; // Gets the target content ID from data-target attribute.

            if (target === 'dashboard') {
                // Redirects to a separate dashboard.html page.
                window.location.href = 'dashboard.html';
            } else if (target === 'analytics') {
                // Redirects to a separate analytics.html page.
                window.location.href = 'analytics.html';
            } else if (target === 'messages') {
                // Redirects to a separate messages.html page.
                window.location.href = 'messages.html';
            } else if (target === 'logout') {
                // Redirects to a separate log-in.html page.
                window.location.href = 'login.html';
            }
            // You can add 'else if' for other sidebar links and their content handling here.
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Re-initialize sidebar and dark mode if this script is loaded on every page
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.querySelector('#content nav .bx.bx-menu');

    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('hide');
        });
    }

    const switchMode = document.getElementById('switch-mode');
    if (switchMode) {
        switchMode.addEventListener('change', function () {
            if (this.checked) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        });

        // Initialize dark mode based on body class (for consistent state)
        if (document.body.classList.contains('dark')) {
            switchMode.checked = true;
        }
    }


    // Profile Page Specifics
    const profileContainer = document.querySelector('.profile-container');
    const toggleEditModeBtn = document.getElementById('toggleEditMode');
    const saveProfileChangesBtn = document.getElementById('saveProfileChanges');
    const cancelProfileEditBtn = document.getElementById('cancelProfileEdit');
    const logoutButton = document.querySelector('.logout-button');
    const uploadProfilePicInput = document.getElementById('uploadProfilePic');
    const userProfilePic = document.getElementById('userProfilePic');

    if (profileContainer) { // Ensure elements exist before adding listeners
        let originalValues = {}; // To store values before editing

        toggleEditModeBtn.addEventListener('click', () => {
            profileContainer.classList.add('edit-active');
            toggleEditModeBtn.style.display = 'none';
            saveProfileChangesBtn.style.display = 'inline-block';
            cancelProfileEditBtn.style.display = 'inline-block';

            // Store current display values as original values
            document.querySelectorAll('.info-item .display-mode').forEach(span => {
                const id = span.id.replace('profile', 'edit'); // e.g., 'profileName' -> 'editName'
                originalValues[id] = span.textContent;
            });
            // Populate edit fields with current display values
            document.querySelectorAll('.info-item input.edit-mode').forEach(input => {
                input.value = originalValues[input.id] || input.value; // Use stored, or current if not stored
            });
        });

        saveProfileChangesBtn.addEventListener('click', () => {
            // In a real application, you'd send this data to a server via AJAX/Fetch
            const newName = document.getElementById('editName').value;
            const newEmail = document.getElementById('editEmail').value;
            const newAddress = document.getElementById('editAddress').value;
            // const newPosition = document.getElementById('editPosition').value; // if editable

            // Update display spans
            document.getElementById('profileName').textContent = newName;
            document.getElementById('profileEmail').textContent = newEmail;
            document.getElementById('profileAddress').textContent = newAddress;
            // document.getElementById('profilePosition').textContent = newPosition; // if editable

            alert('Profile changes saved! (This is a demo, no actual data is stored.)');
            exitEditMode();
        });

        cancelProfileEditBtn.addEventListener('click', () => {
            // Revert input values to original
            document.querySelectorAll('.info-item input.edit-mode').forEach(input => {
                input.value = originalValues[input.id] || '';
            });
            exitEditMode();
        });

        function exitEditMode() {
            profileContainer.classList.remove('edit-active');
            toggleEditModeBtn.style.display = 'inline-block';
            saveProfileChangesBtn.style.display = 'none';
            cancelProfileEditBtn.style.display = 'none';
        }

        // Handle profile picture upload
        uploadProfilePicInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    userProfilePic.src = e.target.result;
                    // In a real application, you'd upload this file to the server
                    alert('Profile picture updated! (Demo only)');
                };
                reader.readAsDataURL(file);
            }
        });

        // Handle Logout Button
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link behavior if it's an <a>
                const confirmLogout = confirm('Are you sure you want to log out?');
                if (confirmLogout) {
                    window.location.href = 'login.html'; // Redirect to login page
                }
            });
        }
    }
});