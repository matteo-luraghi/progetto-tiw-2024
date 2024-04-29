/**
 * Login management
 */

 (function() {
	 document.getElementById("loginbutton").addEventListener('click', (e) => {
		var form = e.target.closest("form");
		if (form.checkValidity()) {
			makeCall("POST", 'CheckLogin', form, 
				function(x) {
					if (x.readyState == XMLHttpRequest.DONE) {
						var message = x.responseText;
						switch (x.status) {
							case 200: // success, redirect to homepage
								sessionStorage.setItem('username', message);
								window.location.href = "Home.html";
								break;
							case 400: // bad request
								document.getElementById("errormessageLogin").textContent = message;
								break;
							case 401: // unauthorized
								document.getElementById("errormessageLogin").textContent = message;
								break;
							case 500: // server error
								document.getElementById("errormessageLogin").textContent = message;
								break;
						}
					} else {
						console.log("Form not valid!");
					}
				}
			)
		} else {
			form.reportValidity();
		}
	 });
 }());