const socket = new WebSocket('ws://localhost:3000')

socket.addEventListener('open', function(){
	socket.send('Hello Server!')
})