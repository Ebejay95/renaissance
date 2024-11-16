
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
    let statusSpan = document.createElement('span');
    statusSpan.classList.add('input-message');
    if (state) {
        statusSpan.classList.add(state);
    }
    statusSpan.textContent = text;
    statusSpan.setAttribute('data-input-name', name);
    input.parentNode.insertBefore(statusSpan, input.nextSibling);
}

function removeFormMessage(input) {
    let name = input.getAttribute('name');
    let statusSpan = input.parentNode.querySelector('.input-message[data-input-name="' + name + '"]');
    if (statusSpan) {
        statusSpan.remove();
    }
}