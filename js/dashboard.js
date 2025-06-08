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
                // Shows the dashboard content directly as it's assumed to be present.
                showContent(target);
            } else if (target === 'analytics') {
                // Redirects to a separate analytics.html page.
                window.location.href = 'analytics.html';
            } else if (target === 'messages') {
                // Redirects to a separate messages.html page.
                window.location.href = 'messages.html';
            } else if (target === 'logout') {
                // Redirects to a separate log-in.html page.
                window.location.href = 'login.html';
            } else if (target === 'settings') {
                // Redirects to a separate settings.html page.
                window.location.href = 'settings.html';
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

    // TOGGLE SIDEBAR functionality.
    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');
    menuBar.addEventListener('click', function() {
        sidebar.classList.toggle('hide'); // Toggles the 'hide' class on the sidebar to collapse/expand it.
    });
});

// Selects all elements with the ID 'switch-mode' (assuming there might be multiple, though ID should be unique).
const switchModeElements = document.querySelectorAll('#switch-mode');
switchModeElements.forEach(switchMode => {
    // Retrieves the dark mode preference from local storage.
    const darkMode = localStorage.getItem('darkMode');

    // Applies dark mode if previously enabled in local storage.
    if (darkMode === 'enabled') {
        document.body.classList.add('dark'); // Adds 'dark' class to the body.
        switchMode.checked = true; // Checks the switch.
    }

    // Adds an event listener for changes on the dark mode switch.
    switchMode.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark'); // Enables dark mode.
            localStorage.setItem('darkMode', 'enabled'); // Stores preference in local storage.
        } else {
            document.body.classList.remove('dark'); // Disables dark mode.
            localStorage.setItem('darkMode', 'disabled'); // Stores preference in local storage.
        }
    });
});