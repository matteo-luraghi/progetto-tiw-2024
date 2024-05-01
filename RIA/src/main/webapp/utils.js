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