/**
 * AJAX call manager 
 */
 function makeCall(method, url, formData, cback) {
	var req = new XMLHttpRequest(); // closure
	req.onreadystatechange = function() {
		cback(req);
	}; // closure
	req.open(method, url);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	 if (formData == null) {
		req.send();
	 } else {
		// prepare the parameters from the form
		const params = new URLSearchParams();
		for (const pair of formData.entries()) {
			params.append(pair[0], pair[1]);	
		}
		req.send(params.toString());
	 }
 }
 
 /**
  * error message creator
  */
 function createError(id, container_id, error_message) {
	const error = document.createElement("p");
	const container = document.getElementById(container_id);
	error.setAttribute("id", id);
	error.classList.add("error-message");
	error.textContent = error_message;
	container.parentNode.insertBefore(error, container);
}

/**
 * create an error message that will disappear after some time
 */
function createErrorWithTimeout(id, container_id, error_message, time) {
	createError(id, container_id, error_message);
	setTimeout(function() {
		const error_old = document.getElementById(id);
		if (error_old) {
			error_old.remove();
		}
	}, time);
}