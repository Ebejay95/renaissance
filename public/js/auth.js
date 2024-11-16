document.addEventListener('DOMContentLoaded', function(){

	
	function proofUsername(usernameInput) {
			var username = usernameInput.value;
			if (username.trim() === '') {
				return;
			}
	
			// Stringify the body object
			var requestBody = JSON.stringify({
				"name": username
			});
	
			ajax(window.location.origin + '/ajax-username', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: requestBody // Use the stringified JSON object here
			}, function(err, res) {
				if(res == 'false'){
					usernameInput.classList.add('error')
					addFormMessage(usernameInput, 'Der Name darf nur kleine Buchstaben, Zahlen und Unterstriche enthalten.', 'error')
				}
				if(res == 'not-unique'){
					usernameInput.classList.add('error')
					addFormMessage(usernameInput, 'Der Benutzername ist nicht mehr verfügbar.', 'error')
				}
				if(res == 'true'){
					usernameInput.classList.remove('error')
					removeFormMessage(usernameInput)
				}
			});
		}

    addKeyupListener('.username-input', function(username){proofUsername(username)}, 500);
})