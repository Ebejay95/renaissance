const socket = new WebSocket('ws://localhost:3000')

socket.addEventListener('open', function(){
	socket.send('Hello Server!')
})

document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('socketclick').addEventListener('click', function(){
		console.log('schon')
		socket.send('clicked_socket');
	})
})