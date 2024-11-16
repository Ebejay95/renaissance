document.addEventListener('DOMContentLoaded', () => {
    const gameIdElement = document.getElementById('gameId');
    const gameId = gameIdElement?.value;
    const gameStatus = document.getElementById('gameStatus');

    if (!gameId) {
        console.error('No gameId found');
        return;
    }

    const chatMessages = document.getElementById('chat');
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const userName = document.getElementById('userInput').value;
    let ws;

    // Funktion zum Aktualisieren des Status
    function updateStatus(message, type = 'info') {
        if (gameStatus) {
            gameStatus.textContent = message;
            // Entferne alte Klassen
            gameStatus.classList.remove('text-gray-500', 'text-green-500', 'text-red-500', 'text-yellow-500');
            
            // Füge neue Klasse basierend auf dem Typ hinzu
            switch(type) {
                case 'success':
                    gameStatus.classList.add('text-green-500');
                    break;
                case 'error':
                    gameStatus.classList.add('text-red-500');
                    break;
                case 'warning':
                    gameStatus.classList.add('text-yellow-500');
                    break;
                default:
                    gameStatus.classList.add('text-gray-500');
            }
        }
    }

    function connectWebSocket() {
        updateStatus('Connecting...', 'warning');
        
        const wsUrl = `ws://${window.location.host}?gameId=${gameId}`;
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('Chat connected');
            updateStatus('Connected', 'success');
        };

        ws.onmessage = (event) => {
            console.log('Received websocket message:', event.data);
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'init') {
                    data.payload.forEach(appendMessage);
                    updateStatus('Connected', 'success');
                } else if (data.type === 'message') {
                    appendMessage(data.payload);
                }
            } catch (error) {
                console.error('Error processing message:', error);
                updateStatus('Error processing message', 'error');
            }
        };

        ws.onclose = () => {
            console.log('Chat disconnected, retrying...');
            updateStatus('Disconnected - Reconnecting...', 'warning');
            setTimeout(connectWebSocket, 3000);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            updateStatus('Connection error', 'error');
        };
    }

    chatForm.onsubmit = (e) => {
        e.preventDefault();
        const payload = {
            message: messageInput.value.trim(),
            user: userName,
            time: new Date().toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        if (payload.message && ws.readyState === WebSocket.OPEN) {
            const message = {
                type: 'message',
                payload: payload
            };
            ws.send(JSON.stringify(message));
            messageInput.value = '';
        } else {
            console.log('Cannot send: socket closed or empty message');
            if (ws.readyState !== WebSocket.OPEN) {
                updateStatus('Cannot send - Reconnecting...', 'warning');
                console.log('Attempting reconnection...');
                connectWebSocket();
            }
        }
    };

    function appendMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        if (message.user === userName) {
            messageDiv.classList.add('own');
        }

        messageDiv.innerHTML = `
            <div class="sender">${message.user}</div>
            <div class="message-content">${message.message}</div>
            <div class="timestamp">${message.time}</div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Initialer Status
    updateStatus('Initializing...', 'info');
    connectWebSocket();
});