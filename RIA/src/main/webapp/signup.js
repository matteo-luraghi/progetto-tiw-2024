/**
 * Sign Up management 
 */

 (function() {
	 document.getElementById("signupbutton").addEventListener('click', (e) => {
		var form = e.target.closest("form");
		if (form.checkValidity()) {
			makeCall("POST", 'CheckSignUp', e.target.closest("form"), 
				function(x) {
					if (x.readyState == XMLHttpRequest.DONE) {
						var message = x.responseText;
						switch (x.status) {
							case 200: // success, redirect to homepage
								sessionStorage.setItem('username', message);
								window.location.href = "Home.html";
								break;
							case 400: // bad request
								document.getElementById("errormessage").textContent = message;
								break;
							case 401: // unauthorized
								document.getElementById("errormessage").textContent = message;
								break;
							case 500: // server error
								document.getElementById("errormessage").textContent = message;
								break;
						}
					}
				}
			)
		} else {
			form.reportValidity();
		}
	 });
 }());