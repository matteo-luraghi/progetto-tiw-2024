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
		removeError(id);
	}, time);
}

/**
 * error message remover
 */
function removeError(id) {
	const error_old = document.getElementById(id);
	if (error_old) {
		error_old.remove();
	}
}

/**
 * remove all rows from a table
 */
function clearTable(table_id) {
	const body = document.getElementById(table_id);
	const table = body.parentNode;
	body.remove();
	const new_body = document.createElement("tbody");
	new_body.setAttribute("id", table_id);
	table.appendChild(new_body);
}

/**
 * format the date in the format yyyy-MM-dd 
 */
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}