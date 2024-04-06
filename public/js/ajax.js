
function ajax(url, options, callback) {
	var xhr = new XMLHttpRequest();
  
	// Konfigurieren der Anfrage
	xhr.open(options.method || 'GET', url, true);
  
	// Setzen von Request-Headern, falls vorhanden
	if (options.headers) {
	  for (var header in options.headers) {
		xhr.setRequestHeader(header, options.headers[header]);
	  }
	}
  
	// Festlegen der Callback-Funktion für den Abschluss der Anfrage
	xhr.onload = function () {
	  if (xhr.status >= 200 && xhr.status < 300) {
		callback(null, xhr.response);
	  } else {
		callback(new Error('Request failed with status ' + xhr.status));
	  }
	};
  
	// Festlegen der Callback-Funktion für Fehler
	xhr.onerror = function () {
	  callback(new Error('Request failed'));
	};
  
	// Senden der Anfrage mit dem Daten-Body, wenn vorhanden
	xhr.send(options.body);
}