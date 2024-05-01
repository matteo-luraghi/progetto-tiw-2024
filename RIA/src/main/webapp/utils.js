/**
 * AJAX call manager 
 */

 function makeCall(method, url, formElement, cback, reset = true) {
	var req = new XMLHttpRequest(); // closure
	req.onreadystatechange = function() {
		cback(req);
	}; // closure
	req.open(method, url);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	 if (formElement == null) {
		req.send();
	 } else {
		const fD = new FormData(formElement);
		// prepare the parameters from the form
		const params = new URLSearchParams();
		for (const pair of fD.entries()) {
			params.append(pair[0], pair[1]);	
		}
		req.send(params.toString());
	 }
	 
	 if (formElement !== null && reset === true) {
		formElement.reset();
	 }
 }
 
 /**
  * error creator
  */
 
 function createError(field, type, error_message) {
	const error = document.createElement("p");
	const container = document.getElementById(`${field}-input-${type}`);
	error.setAttribute("id", `${field}-error-${type}`);
	error.classList.add("error-message");
	error.textContent = error_message;
	container.parentNode.insertBefore(error, container);
}

/**
 * error remover
 */

function removeError(field, type) {
	const error_old = document.getElementById(`${field}-error-${type}`);
	if (error_old) {
		error_old.remove();
	}
}
