
if (!Element.prototype.closest) {
	Element.prototype.closest = function(selector) {
	  var el = this;
	  while (el) {
		if (el.matches(selector)) {
		  return el;
		}
		el = el.parentElement;
	  }
	  return null;
	};
  }


function addKeyupListener(selector, cb, buffertime) {
    let timeoutId;

    document.querySelectorAll(selector).forEach(function(element) {
		cb(element);
        element.addEventListener('keyup', function(e) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                cb(e.target);
            }, buffertime);
        });
    });
}

function addFormMessage(input, text, state) {
    let name = input.getAttribute('name');
    let statusSpan = document.createElement('span'); // Erstelle ein neues Span-Element
    statusSpan.classList.add('input-message'); // Füge die Klasse 'input-message' hinzu
    if (state) {
        statusSpan.classList.add(state); // Füge den Wert von 'state' als zusätzliche Klasse hinzu, falls vorhanden
    }
    statusSpan.textContent = text; // Setze den Text des Spans
    statusSpan.setAttribute('data-input-name', name); // Setze das Attribut 'data-input-name' als Verweis auf den Input
    input.parentNode.insertBefore(statusSpan, input.nextSibling); // Füge das Span-Element direkt nach dem Eingabefeld ein
}

function removeFormMessage(input) {
    let name = input.getAttribute('name');
    let statusSpan = input.parentNode.querySelector('.input-message[data-input-name="' + name + '"]'); // Finde das Span-Element mit der Klasse 'input-message' und dem passenden Attribut 'data-input-name'
    if (statusSpan) {
        statusSpan.remove(); // Entferne das Span-Element, falls vorhanden
    }
}