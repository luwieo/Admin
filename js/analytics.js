document.addEventListener('DOMContentLoaded', function() {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
    const sidebarLinks = document.querySelectorAll('#sidebar .side-menu a');
    const contentAreas = {
        'dashboard': document.getElementById('dashboard-content'),
        'analytics': document.getElementById('analytics-content'),
        'messages': document.getElementById('messages-content'),
        'settings' : document.getElementById('settings'),
        'logout' : document.getElementById('log-out')
    };
    const mainContent = document.querySelector('main');

    async function loadContent(targetId, url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            if (contentAreas[targetId]) {
                contentAreas[targetId].innerHTML = html;
                if (targetId === 'messages') {
                    const scriptTags = contentAreas[targetId].querySelectorAll('script');
                    scriptTags.forEach(script => {
                        eval(script.textContent);
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load content:', error);
            if (contentAreas[targetId]) {
                contentAreas[targetId].innerHTML = '<p>Failed to load content.</p>';
            }
        }
    }

    function showContent(targetId) {
        for (const id in contentAreas) {
            contentAreas[id].style.display = (id === targetId) ? 'block' : 'none';
        }

        sidebarLinks.forEach(link => {
            if (link.dataset.target === targetId) {
                link.parentNode.classList.add('active');
            } else {
                link.parentNode.classList.remove('active');
            }
        });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = this.dataset.target;

            if (target === 'dashboard') {
                window.location.href = 'dashboard.html';
            } else if (target === 'analytics') {
                showContent(target);
            } else if (target === 'messages') {
                window.location.href = 'messages.html';
            } else if (target === 'logout') {
                window.location.href = 'login.html';
            } else if (target === 'settings') {
                window.location.href = 'settings.html';
            }
        });
    });

    allSideMenu.forEach(item => {
        const li = item.parentElement;
        item.addEventListener('click', function() {
            allSideMenu.forEach(i => i.parentElement.classList.remove('active'));
            li.classList.add('active');
        });
    });

    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');
    menuBar.addEventListener('click', function() {
        sidebar.classList.toggle('hide');
    });
});

const switchModeElements = document.querySelectorAll('#switch-mode');
switchModeElements.forEach(switchMode => {
    const darkMode = localStorage.getItem('darkMode');

    if (darkMode === 'enabled') {
        document.body.classList.add('dark');
        switchMode.checked = true;
    }

    switchMode.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});