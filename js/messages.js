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
                showContent(target);
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

const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const contactList = document.getElementById('contact-list');
const newChatButton = document.getElementById('new-chat-button');
const currentChatNameDisplay = document.getElementById('current-chat-name');
const currentChatAvatarDisplay = document.getElementById('current-chat-avatar');

let chats = [];
let currentChatId = null;

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function addMessageToChat(text, sender) {
    const chat = chats.find(c => c.id === currentChatId);
    if (chat) {
        chat.messages.push({ text, sender, timestamp: getCurrentTime() });
        renderChatMessages(currentChatId);
    }
}

function renderChatMessages(chatId) {
    const chat = chats.find(c => c.id === chatId);
    chatMessages.innerHTML = '';
    if (chat && chat.messages) {
        chat.messages.forEach(msg => {
            const messageWrapper = document.createElement('div');
            messageWrapper.classList.add('message-wrapper', msg.sender);

            const avatar = document.createElement('div');
            avatar.classList.add('message-avatar');
            avatar.textContent = msg.sender.charAt(0).toUpperCase();

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
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

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
            renderContactList();
            renderChatMessages(currentChatId);
            currentChatNameDisplay.textContent = chat.name;
            currentChatAvatarDisplay.textContent = chat.name.charAt(0).toUpperCase();
        });
    });
}

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
        event.preventDefault();
        sendButton.click();
    }
});

newChatButton.addEventListener('click', () => {
    const newChatName = prompt('Enter the name for the new chat:');
    if (newChatName) {
        const newChat = {
            id: Date.now().toString(),
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

chats = [
    { id: '1', name: 'Citizen 1', messages: [{ text: 'Hello! Can I ask you something?', sender: 'citizen', timestamp: getCurrentTime() }] },
    { id: '2', name: 'Citizen 2', messages: [{ text: 'Good morning!', sender: 'user', timestamp: getCurrentTime() }, { text: 'Morning!', sender: 'citizen', timestamp: getCurrentTime() }] }
];

if (chats.length > 0) {
    currentChatId = chats[0].id;
    currentChatNameDisplay.textContent = chats[0].name;
    currentChatAvatarDisplay.textContent = chats[0].name.charAt(0).toUpperCase();
}
renderContactList();
renderChatMessages(currentChatId);