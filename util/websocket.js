class WebSocket{
	constructor(id) {
		this.id = id;
		this.io = io;
		this.io.on('connection', socket => {
			console.log('Neuer Client verbunden');
		  
			/*socket.on('join room', room => {
			  chatController.joinRoom(io, socket, room);
			});
		  
			socket.on('leave room', room => {
			  chatController.leaveRoom(io, socket, room);
			});
		  
			socket.on('chat message', (room, message) => {
			  chatController.sendMessage(io, socket, room, message);
			});*/
		  
			socket.on('clicked_socket', () => {
				console.log('KLICK!');
			});
		  
			socket.on('disconnect', () => {
				console.log('Ein Client hat die Verbindung getrennt');
			});
		});
	}
}
