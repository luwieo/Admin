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
                window.location.href = 'analytics.html';
            } else if (target === 'messages') {
                window.location.href = 'messages.html';
            } else if (target === 'logout') {
                window.location.href = 'login.html';
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
});

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.querySelector('#content nav .bx.bx-menu');

    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('hide');
    });

    const switchMode = document.getElementById('switch-mode');
    switchMode.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    });

    const settingsSidebarItems = document.querySelectorAll('.settings-sidebar li');
    const settingsSections = document.querySelectorAll('.settings-section');

    settingsSidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            settingsSidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const targetSection = item.dataset.section;

            settingsSections.forEach(section => section.classList.remove('active'));

            document.getElementById(targetSection).classList.add('active');
        });
    });

    const saveButtons = document.querySelectorAll('.save-button');
    saveButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Settings saved! (This is a demo, no actual data is stored.)');
        });
    });

    const lightThemeRadio = document.getElementById('lightTheme');
    const darkThemeRadio = document.getElementById('darkTheme');

    if (document.body.classList.contains('dark')) {
        darkThemeRadio.checked = true;
    } else {
        lightThemeRadio.checked = true;
    }

    lightThemeRadio.addEventListener('change', () => {
        document.body.classList.remove('dark');
        switchMode.checked = false;
    });

    darkThemeRadio.addEventListener('change', () => {
        document.body.classList.add('dark');
        switchMode.checked = true;
    });

    const fontScaleInput = document.getElementById('fontScale');
    const fontScaleDisplay = fontScaleInput.nextElementSibling;

    fontScaleInput.addEventListener('input', () => {
        const scale = fontScaleInput.value;
        document.body.style.fontSize = `${scale * 100}%`;
        fontScaleDisplay.textContent = `${Math.round(scale * 100)}%`;
    });
});