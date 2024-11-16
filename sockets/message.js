const messageController = require('../controllers/message');
const WebSocket = require('ws');

async function sendMessage(ws, message, gameId, gameConnections) {
    console.log(`Message received: ${message}`);

    try {
        const data = JSON.parse(message);

        if (data.type === 'message') {
            const req = {
                body: {
                    content: data.payload.message,
                    gameId: gameId,
                    username: data.payload.user,
                },
            };

            let savedMessage;
            const res = {
                status: () => res,
                json: (responseData) => {
                    if (responseData && responseData.data) {
                        savedMessage = responseData.data.message;
                    }
                },
            };

            await messageController.postMessage(req, res, (error) => {
                if (error) throw error;
            });

            console.log('postMessage');
            const broadcastData = {
                type: 'message',
                payload: {
                    message: data.payload.message,
                    user: data.payload.user,
                    time: data.payload.time,
                    _id: savedMessage ? savedMessage._id : undefined,
                },
            };

            const clients = gameConnections.get(gameId);
            if (clients) {
                clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(broadcastData));
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error processing message:', error);
        ws.send(
            JSON.stringify({
                type: 'error',
                payload: {
                    message: 'Failed to process message',
                },
            })
        );
    }
}

module.exports = {
    sendMessage,
};
