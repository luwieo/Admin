document.addEventListener('DOMContentLoaded', function() {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
    const sidebarLinks = document.querySelectorAll('#sidebar .side-menu a');
    const contentAreas = {
        'dashboard': document.getElementById('dashboard-content'),
        'analytics': document.getElementById('analytics-content'),
        'messages': document.getElementById('messages-content'),
        'logout' : document.getElementById('log-out')
    };
    // Selects the main content area of the page.
    const mainContent = document.querySelector('main');

    // Function to load content from a URL into the main area
    async function loadContent(url, targetId) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            mainContent.innerHTML = html;
            // Execute the script within the loaded messages content
            if (targetId === 'messages') {
                const scriptTags = mainContent.querySelectorAll('script');
                scriptTags.forEach(script => {
                    eval(script.textContent);
                });
            }
        } catch (error) {
            console.error('Failed to load content:', error);
            mainContent.innerHTML = '<p>Failed to load content.</p>';
        }
    }

    // Function to handle showing content or navigating
    function handleNavigation(targetId, linkElement) {
        // Update active class on sidebar links
        sidebarLinks.forEach(link => {
            if (link === linkElement) {
                link.parentNode.classList.add('active');
            } else {
                link.parentNode.classList.remove('active');
            }
        });
    }

    // Event listener for sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            const target = this.dataset.target;
            handleNavigation(target, this);
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
            } else if (target === 'settings') {
                // Redirects to a separate settings.html page.
                window.location.href = 'settings.html';
            }
            // You can add 'else if' for other sidebar links and their content handling here.
        });
    });

    // Existing JavaScript code for sidebar active class
    allSideMenu.forEach(item => {
        const li = item.parentElement;
        item.addEventListener('click', function() {
            allSideMenu.forEach(i => i.parentElement.classList.remove('active'));
            li.classList.add('active');
        });
    });

    // TOGGLE SIDEBAR
    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');
    menuBar.addEventListener('click', function() {
        sidebar.classList.toggle('hide');
    });

    // TOGGLE SEARCH BAR (for smaller screens)
    const searchButton = document.querySelector('#content nav form .form-input button');
    const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
    const searchForm = document.querySelector('#content nav form');

    searchButton.addEventListener('click', function(e) {
        if (window.innerWidth < 576) {
            e.preventDefault();
            searchForm.classList.toggle('show');
            if (searchForm.classList.contains('show')) {
                searchButtonIcon.classList.replace('bx-search', 'bx-x');
            } else {
                searchButtonIcon.classList.replace('bx-x', 'bx-search');
            }
        }
    });

    // CLOSE SIDEBAR ON SMALL SCREENS IF CLICKING OUTSIDE
    if (window.innerWidth < 768) {
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#sidebar') && !e.target.closest('#content nav .bx.bx-menu') && sidebar.classList.contains('hide') === false) {
                sidebar.classList.add('hide');
            }
        });
    }
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