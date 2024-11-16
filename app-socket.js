const WebSocket = require('ws');
const messageSocket = require('./sockets/message');
require('dotenv').config();

function initializeWebSockets(server) {
    const wss = new WebSocket.Server({ server });
    const gameConnections = new Map();

    wss.on('connection', (ws, req) => {

        const gameId = new URL(req.url, process.env.SOCKET_URL).searchParams.get('gameId');
        
        if (!gameId) {
            console.log('No gameId found in WebSocket request');
            ws.close();
            return;
        }

        if (!gameConnections.has(gameId)) {
            gameConnections.set(gameId, new Set());
        }
        gameConnections.get(gameId).add(ws);

        ws.send(JSON.stringify({ type: 'init', payload: [] }));

        ws.on('message', (message) => messageSocket.sendMessage(ws, message, gameId, gameConnections));

        ws.on('close', () => {
            console.log('WebSocket client disconnected');
            const clients = gameConnections.get(gameId);
            if (clients) {
                clients.delete(ws);
                if (clients.size === 0) {
                    gameConnections.delete(gameId);
                }
            }
        });

        ws.on('error', (error) => {
            console.error(`WebSocket error: ${error.message}`);
        });
    });

    return wss;
}

module.exports = initializeWebSockets;
