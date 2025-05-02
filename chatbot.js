class Chatbot {
    constructor() {
        this.initialize();
        this.messages = [];
        this.isOpen = false;
        this.isMinimized = false;
    }

    initialize() {
        // Create chat widget HTML
        const chatHTML = `
            <button class="chat-toggle" id="chatToggle">
                <i data-feather="message-circle"></i>
            </button>
            <div class="chat-widget" id="chatWidget">
                <div class="chat-header" id="chatHeader">
                    <h3>
                        <i data-feather="help-circle"></i>
                        Support Chat
                    </h3>
                    <div class="chat-controls">
                        <button id="minimizeChat">
                            <i data-feather="minus"></i>
                        </button>
                        <button id="closeChat">
                            <i data-feather="x"></i>
                        </button>
                    </div>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <!-- Messages will be added here -->
                </div>
                <div class="chat-input">
                    <input type="text" id="messageInput" placeholder="Type your message...">
                    <button id="sendMessage">
                        <i data-feather="send"></i>
                        Send
                    </button>
                </div>
            </div>
        `;

        // Add chat widget to body
        document.body.insertAdjacentHTML('beforeend', chatHTML);

        // Initialize Feather icons
        feather.replace();

        // Add event listeners
        this.addEventListeners();

        // Show welcome message
        this.addMessage('bot', 'Hello! How can I help you today?');
    }

    addEventListeners() {
        const chatToggle = document.getElementById('chatToggle');
        const chatWidget = document.getElementById('chatWidget');
        const minimizeChat = document.getElementById('minimizeChat');
        const closeChat = document.getElementById('closeChat');
        const sendMessage = document.getElementById('sendMessage');
        const messageInput = document.getElementById('messageInput');
        const chatHeader = document.getElementById('chatHeader');

        chatToggle.addEventListener('click', () => this.toggleChat());
        minimizeChat.addEventListener('click', () => this.minimizeChat());
        closeChat.addEventListener('click', () => this.closeChat());
        sendMessage.addEventListener('click', () => this.handleSendMessage());
        chatHeader.addEventListener('click', (e) => {
            if (e.target === chatHeader) this.minimizeChat();
        });

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });
    }

    toggleChat() {
        const chatWidget = document.getElementById('chatWidget');
        const chatToggle = document.getElementById('chatToggle');
        
        this.isOpen = !this.isOpen;
        chatWidget.classList.toggle('active');
        chatToggle.style.display = this.isOpen ? 'none' : 'flex';
        
        if (this.isOpen) {
            this.isMinimized = false;
            chatWidget.classList.remove('minimized');
        }
    }

    minimizeChat() {
        const chatWidget = document.getElementById('chatWidget');
        this.isMinimized = !this.isMinimized;
        chatWidget.classList.toggle('minimized');
    }

    closeChat() {
        const chatWidget = document.getElementById('chatWidget');
        const chatToggle = document.getElementById('chatToggle');
        
        this.isOpen = false;
        chatWidget.classList.remove('active');
        chatToggle.style.display = 'flex';
    }

    addMessage(sender, text) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        messageDiv.innerHTML = `
            <div class="avatar">
                ${sender === 'user' ? '<i data-feather="user"></i>' : '<i data-feather="help-circle"></i>'}
            </div>
            <div class="message-content">
                ${text}
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        feather.replace();
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Store message
        this.messages.push({ sender, text });
    }

    async handleSendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage('user', message);
        messageInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Get bot response
        const response = await this.getBotResponse(message);
        
        // Remove typing indicator and add bot response
        this.hideTypingIndicator();
        this.addMessage('bot', response);
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing-indicator-container';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="avatar">
                <i data-feather="help-circle"></i>
            </div>
            <div class="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        feather.replace();
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async getBotResponse(message) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simple response logic
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return 'Hello! How can I assist you today?';
        } else if (lowerMessage.includes('inventory')) {
            return 'You can manage your inventory in the Inventory section. Would you like me to explain how to add or update items?';
        } else if (lowerMessage.includes('order')) {
            return 'Orders can be managed in the Orders section. You can create new orders, track existing ones, and view order history.';
        } else if (lowerMessage.includes('report')) {
            return 'The Reports section provides detailed analytics about your sales, inventory, and business performance. What specific information are you looking for?';
        } else if (lowerMessage.includes('help')) {
            return 'I can help you with inventory management, order processing, and generating reports. What would you like to know more about?';
        } else {
            return 'I understand you need assistance. Could you please be more specific about what you\'re looking for?';
        }
    }
}

// Initialize chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new Chatbot();
}); 