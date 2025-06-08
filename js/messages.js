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
                // Redirects to a separate messages.html page.
                window.location.href = 'analytics.html';
            } else if (target === 'messages') {
                // Shows the messages content directly as it's assumed to be present.
                showContent(target);
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

// Get references to DOM elements
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const contactList = document.getElementById('contact-list');
    const newChatButton = document.getElementById('new-chat-button');
    const currentChatNameDisplay = document.getElementById('current-chat-name');
    const currentChatAvatarDisplay = document.getElementById('current-chat-avatar');

        // --- Chat Data Management ---
        let chats = []; // Array to store all chat objects
        let currentChatId = null; // ID of the currently active chat

        // Function to format current time for message timestamps
        function getCurrentTime() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }

        // Function to add a message to the currently active chat's messages array
        function addMessageToChat(text, sender) {
            const chat = chats.find(c => c.id === currentChatId);
            if (chat) {
                chat.messages.push({ text, sender, timestamp: getCurrentTime() });
                renderChatMessages(currentChatId); // Re-render messages after adding
            }
        }

        // Function to render the messages for a given chat ID
        function renderChatMessages(chatId) {
            const chat = chats.find(c => c.id === chatId);
            chatMessages.innerHTML = ''; // Clear previous messages
            if (chat && chat.messages) {
                chat.messages.forEach(msg => {
                    const messageWrapper = document.createElement('div');
                    messageWrapper.classList.add('message-wrapper', msg.sender);

                    const avatar = document.createElement('div');
                    avatar.classList.add('message-avatar');
                    avatar.textContent = msg.sender.charAt(0).toUpperCase(); // Simple avatar

                    const content = document.createElement('div');
                    content.classList.add('message-content', msg.sender);
                    content.innerHTML = `<p>${msg.text}</p><div class="message-info">${msg.timestamp}</div>`;

                    if (msg.sender === 'user') {
                        messageWrapper.appendChild(content);
                        messageWrapper.appendChild(avatar);
                    } else {
                        messageWrapper.appendChild(avatar);
                        messageWrapper.appendChild(content);
                    }

                    chatMessages.appendChild(messageWrapper);
                });
                chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the latest message
            }
        }

        // Function to render the list of contacts/chats in the sidebar
        function renderContactList() {
            contactList.innerHTML = '';
            chats.forEach(chat => {
                const contactItem = document.createElement('div');
                contactItem.classList.add('contact-item');
                if (chat.id === currentChatId) {
                    contactItem.classList.add('active');
                }
                contactItem.dataset.chatId = chat.id;
                const avatar = document.createElement('div');
                avatar.classList.add('contact-avatar');
                avatar.textContent = chat.name.charAt(0).toUpperCase();
                const nameSpan = document.createElement('span');
                nameSpan.classList.add('contact-name');
                nameSpan.textContent = chat.name;

                contactItem.appendChild(avatar);
                contactItem.appendChild(nameSpan);
                contactList.appendChild(contactItem);

                contactItem.addEventListener('click', () => {
                    currentChatId = chat.id;
                    renderContactList(); // Update active class
                    renderChatMessages(currentChatId);
                    currentChatNameDisplay.textContent = chat.name;
                    currentChatAvatarDisplay.textContent = chat.name.charAt(0).toUpperCase();
                });
            });
        }

        // --- Event Listeners ---
        sendButton.addEventListener('click', () => {
            const messageText = userInput.value.trim();
            if (messageText && currentChatId !== null) {
                addMessageToChat(messageText, 'user');
                userInput.value = '';
            } else if (currentChatId === null) {
                alert('Please select a chat or start a new one.');
            }
        });

        userInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault(); // Prevent newline in textarea
                sendButton.click();
            }
        });

        newChatButton.addEventListener('click', () => {
            const newChatName = prompt('Enter the name for the new chat:');
            if (newChatName) {
                const newChat = {
                    id: Date.now().toString(), // Simple unique ID
                    name: newChatName,
                    messages: []
                };
                chats.push(newChat);
                currentChatId = newChat.id;
                renderContactList();
                renderChatMessages(currentChatId);
                currentChatNameDisplay.textContent = newChat.name;
                currentChatAvatarDisplay.textContent = newChat.name.charAt(0).toUpperCase();
            }
        });

        // --- Initial Data (for testing) ---
        chats = [
            { id: '1', name: 'Citizen 1', messages: [{ text: 'Hello! Can I ask you something?', sender: 'citizen', timestamp: getCurrentTime() }] },
            { id: '2', name: 'Citizen 2', messages: [{ text: 'Good morning!', sender: 'user', timestamp: getCurrentTime() }, { text: 'Morning!', sender: 'citizen', timestamp: getCurrentTime() }] }
        ];

        // Set initial active chat and render
        if (chats.length > 0) {
            currentChatId = chats[0].id;
            currentChatNameDisplay.textContent = chats[0].name;
            currentChatAvatarDisplay.textContent = chats[0].name.charAt(0).toUpperCase();
        }
        renderContactList();
        renderChatMessages(currentChatId);