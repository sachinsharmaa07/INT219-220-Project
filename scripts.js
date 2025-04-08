AOS.init({ duration: 1200, once: true });

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Chatbot Functionality
const chatToggle = document.getElementById('chat-toggle');
const chatBot = document.getElementById('chat-bot');
const promptInput = document.getElementById('prompt');
const submitBtn = document.getElementById('submit');
const chatContainer = document.querySelector('.chat-container');
const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBJvhPW1ZSldEsWcGoNwgN4LuarfBPtnXY";

chatToggle.addEventListener('click', () => {
    chatBot.style.display = chatBot.style.display === 'none' ? 'flex' : 'none';
});

async function generateResponse(userMessage) {
    const aiChatBox = document.createElement('div');
    aiChatBox.classList.add('chat-box');
    const aiBubble = document.createElement('div');
    aiBubble.classList.add('chat-bubble', 'ai-chat');
    aiBubble.textContent = 'Thinking...';
    aiChatBox.appendChild(aiBubble);
    chatContainer.appendChild(aiChatBox);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"contents": [{"parts": [{text: userMessage}]}]})
        });
        const data = await response.json();
        aiBubble.textContent = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1').trim();
    } catch (error) {
        aiBubble.textContent = 'Oops! Something went wrong.';
    }
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleUserMessage() {
    const userMessage = promptInput.value.trim();
    if (!userMessage) return;

    const userChatBox = document.createElement('div');
    userChatBox.classList.add('chat-box');
    const userBubble = document.createElement('div');
    userBubble.classList.add('chat-bubble', 'user-chat');
    userBubble.textContent = userMessage;
    userChatBox.appendChild(userBubble);
    chatContainer.appendChild(userChatBox);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    promptInput.value = '';
    generateResponse(userMessage);
}

promptInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUserMessage();
});
submitBtn?.addEventListener('click', handleUserMessage);

// Quiz Functionality
const quizForm = document.getElementById('quiz-form');
const scoreDisplay = document.getElementById('score-display');

if (quizForm) {
    const correctAnswers = {
        q1: 'a',  // 9%
        q2: 'b',  // 1.5 kg
        q3: 'c',  // Glass
        q4: 'a',  // Reduces landfill use
        q5: 'd',  // Photosynthesis
        q6: 'a',  // Reusing materials
        q7: 'a',  // Germany
        q8: 'c',  // Food waste
        q9: 'c',  // 500 years
        q10: 'c'  // Reducing consumption
    };

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let score = 0;
        const formData = new FormData(quizForm);

        for (let i = 1; i <= 10; i++) {
            const answer = formData.get(`q${i}`);
            if (answer === correctAnswers[`q${i}`]) score++;
        }

        scoreDisplay.style.display = 'block';
        scoreDisplay.innerHTML = `Your Score: ${score}/10<br>Great effort! Want to learn more? <a href="index.html">Go back</a>`;
        quizForm.style.display = 'none';
    });
}
