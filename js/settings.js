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

    // Existing JavaScript code for sidebar active class management.
    allSideMenu.forEach(item => {
        const li = item.parentElement;
        item.addEventListener('click', function() {
            allSideMenu.forEach(i => i.parentElement.classList.remove('active')); // Removes 'active' from all other sidebar items.
            li.classList.add('active'); // Adds 'active' class to the clicked item's parent list item.
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Sidebar toggle functionality
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.querySelector('#content nav .bx.bx-menu');

    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('hide');
    });

    // Dark mode toggle functionality
    const switchMode = document.getElementById('switch-mode');
    switchMode.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    });

    // Settings page section switching
    const settingsSidebarItems = document.querySelectorAll('.settings-sidebar li');
    const settingsSections = document.querySelectorAll('.settings-section');

    settingsSidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all sidebar items
            settingsSidebarItems.forEach(i => i.classList.remove('active'));
            // Add active class to the clicked item
            item.classList.add('active');

            // Get the data-section attribute
            const targetSection = item.dataset.section;

            // Hide all setting sections
            settingsSections.forEach(section => section.classList.remove('active'));

            // Show the target section
            document.getElementById(targetSection).classList.add('active');
        });
    });

    // Example of saving settings (client-side only for this example)
    const saveButtons = document.querySelectorAll('.save-button');
    saveButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Settings saved! (This is a demo, no actual data is stored.)');
        });
    });

    // Handle theme radio buttons
    const lightThemeRadio = document.getElementById('lightTheme');
    const darkThemeRadio = document.getElementById('darkTheme');

    if (document.body.classList.contains('dark')) {
        darkThemeRadio.checked = true;
    } else {
        lightThemeRadio.checked = true;
    }

    lightThemeRadio.addEventListener('change', () => {
        document.body.classList.remove('dark');
        switchMode.checked = false; // Sync the main switch
    });

    darkThemeRadio.addEventListener('change', () => {
        document.body.classList.add('dark');
        switchMode.checked = true; // Sync the main switch
    });

    // Font Scale functionality
    const fontScaleInput = document.getElementById('fontScale');
    const fontScaleDisplay = fontScaleInput.nextElementSibling; // The span next to the input

    fontScaleInput.addEventListener('input', () => {
        const scale = fontScaleInput.value;
        document.body.style.fontSize = `${scale * 100}%`;
        fontScaleDisplay.textContent = `${Math.round(scale * 100)}%`;
    });
});