
function ajax(url, options, callback) {
	var xhr = new XMLHttpRequest();
  
	xhr.open(options.method || 'GET', url, true);
  
	if (options.headers) {
	  for (var header in options.headers) {
		xhr.setRequestHeader(header, options.headers[header]);
	  }
	}
  
	xhr.onload = function () {
	  if (xhr.status >= 200 && xhr.status < 300) {
		callback(null, xhr.response);
	  } else {
		callback(new Error('Request failed with status ' + xhr.status));
	  }
	};
  
	xhr.onerror = function () {
	  callback(new Error('Request failed'));
	};
  
	xhr.send(options.body);
}