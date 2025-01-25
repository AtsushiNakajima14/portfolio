
const chatButton = document.getElementById('chatButton');
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
let userId = Math.random().toString(36).substring(2, 15);

chatButton.addEventListener('click', () => {
    chatContainer.style.display = chatContainer.style.display === 'none' ? 'flex' : 'none';
});

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        messageInput.value = '';
        botChat(message);
    }
}

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);

    const avatarSrc = sender === 'user' ? 'https://i.ibb.co/K5JMgyV/user-avatar.png' : 'https://i.ibb.co/52xnp50/bot-avatar-removebg-preview.png';

    messageElement.innerHTML = `
<div class="message-content">
    <img src="${avatarSrc}" alt="${sender} avatar" class="message-avatar">
    <div class="message-text">${text}</div>
    <button class="copy-button">Copy</button>
</div>
`;

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
        messageElement.classList.add('show');
    }, 10);

    const copyButton = messageElement.querySelector('.copy-button');
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Message copied to clipboard!');
        });
    });
}

async function botChat(userMessage) {
    try {
        const response = await fetch(`https://joshweb.click/ai/llama-3-8b?q=${encodeURIComponent(userMessage)}&uid=${userId}`);
        const data = await response.json();
        addMessage(data.result, 'bot');
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
}
const bgAnim = document.getElementById('background-animation');
for (let i = 0; i < 50; i++) {
    const span = document.createElement('span');
    span.style.left = Math.random() * window.innerWidth + 'px';
    span.style.top = Math.random() * window.innerHeight + 'px';
    span.style.animationDelay = Math.random() * 5 + 's';
    bgAnim.appendChild(span);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const progBars = document.querySelectorAll('.progress');
const progressAnim = () => {
    const triggerBottom = window.innerHeight / 5 * 4;
    progBars.forEach(progressBar => {
        const progressTop = progressBar.getBoundingClientRect().top;
        if (progressTop < triggerBottom) {
            progressBar.style.width = progressBar.getAttribute('data-width');
        }
    });
};

window.addEventListener('scroll', progressAnim);
progressAnim();

const scrollAnim = () => {
    const elements = document.querySelectorAll('.section');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        if (elementPosition < screenPosition) {
            element.classList.add('animate');
        }
    });
};

window.addEventListener('scroll', scrollAnim);
scrollAnim();
