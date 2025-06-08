document.addEventListener('DOMContentLoaded', function() {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
    const sidebarLinks = document.querySelectorAll('#sidebar .side-menu a');
    const mainContent = document.querySelector('main');
    const dashboardLink = document.querySelector('#sidebar .side-menu.top li.active a');

    async function loadContent(url, targetId) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            mainContent.innerHTML = html;
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

    function handleNavigation(targetId, linkElement) {
        sidebarLinks.forEach(link => {
            if (link === linkElement) {
                link.parentNode.classList.add('active');
            } else {
                link.parentNode.classList.remove('active');
            }
        });

        if (targetId === 'dashboard') {
            window.location.href = 'dashboard.html';
        } else if (targetId === 'analytics') {
            loadContent('analytics.html', targetId);
        } else if (targetId === 'messages') {
            loadContent('messages.html', targetId);
        }
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const target = this.dataset.target;
            handleNavigation(target, this);
        });
    });

    function initializeTableFeatures() {
        const filterButton = document.querySelector('#dashboard-content .order .head .bx-filter');
        const tableBody = document.querySelector('#dashboard-content table tbody');
        const tableRows = tableBody ? tableBody.querySelectorAll('tr') : [];
        const applicationTypeColumnIndex = 2;
        let filterVisible = false;
        let applicationTypeSelect;
        let filterDropdownContainer = null;
        const searchInput = document.querySelector('#dashboard-content .order .head input[type="search"]');

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                tableRows.forEach(row => {
                    let rowMatch = false;
                    const cells = row.querySelectorAll('td');
                    cells.forEach(cell => {
                        if (cell.textContent.toLowerCase().includes(searchTerm)) {
                            rowMatch = true;
                            return;
                        }
                    });
                    row.style.display = rowMatch ? '' : 'none';
                });
            });
        }

        function createFilterDropdown() {
            applicationTypeSelect = document.createElement('select');
            applicationTypeSelect.classList.add('filter-select');
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Filter by Application Type';
            applicationTypeSelect.appendChild(defaultOption);

            const applicationTypes = [...new Set(Array.from(tableRows).map(row => row.querySelectorAll('td')[applicationTypeColumnIndex].textContent))];
            applicationTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.toLowerCase();
                option.textContent = type;
                applicationTypeSelect.appendChild(option);
            });

            applicationTypeSelect.addEventListener('change', function() {
                const selectedType = this.value.toLowerCase();
                tableRows.forEach(row => {
                    const applicationTypeCell = row.querySelectorAll('td')[applicationTypeColumnIndex];
                    if (applicationTypeCell) {
                        const typeText = applicationTypeCell.textContent.toLowerCase();
                        row.style.display = selectedType === '' || typeText.includes(selectedType) ? '' : 'none';
                    }
                });
            });

            const filterContainer = document.createElement('div');
            filterContainer.classList.add('filter-container');
            filterContainer.style.position = 'absolute';
            filterContainer.style.top = 'calc(100% + 5px)';
            filterContainer.style.right = '0';
            filterContainer.style.backgroundColor = '#fff';
            filterContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            filterContainer.style.borderRadius = '5px';
            filterContainer.style.padding = '10px';
            filterContainer.style.zIndex = '10';
            filterContainer.style.display = 'none';
            filterContainer.appendChild(applicationTypeSelect);

            const tableHead = document.querySelector('#dashboard-content .order .head');
            if (tableHead) {
                tableHead.appendChild(filterContainer);
            }
            return filterContainer;
        }

        if (filterButton) {
            filterButton.addEventListener('click', function(event) {
                event.stopPropagation();

                if (!filterDropdownContainer) {
                    filterDropdownContainer = createFilterDropdown();
                }

                filterVisible = !filterVisible;
                if (filterDropdownContainer) {
                    filterDropdownContainer.style.display = filterVisible ? 'block' : 'none';
                }
            });
        }

        document.addEventListener('click', function(event) {
            if (filterVisible && filterDropdownContainer && !filterDropdownContainer.contains(event.target) && event.target !== filterButton) {
                filterVisible = false;
                if (filterDropdownContainer) {
                    filterDropdownContainer.style.display = 'none';
                }
            }
        });
    }

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

    if (window.innerWidth < 768) {
        document.addEventListener('click', function(e) {
            if (!e.target.closest('#sidebar') && !e.target.closest('#content nav .bx.bx-menu') && sidebar.classList.contains('hide') === false) {
                sidebar.classList.add('hide');
            }
        });
    }

    const switchMode = document.getElementById('switch-mode');
    if (switchMode) {
        switchMode.addEventListener('change', function() {
            document.body.classList.toggle('dark');
            if (document.body.classList.contains('dark')) {
                localStorage.setItem('mode', 'dark');
            } else {
                localStorage.setItem('mode', 'light');
            }
        });

        if (localStorage.getItem('mode') === 'dark') {
            document.body.classList.add('dark');
            if (switchMode) {
                switchMode.checked = true;
            }
        }
    }
});