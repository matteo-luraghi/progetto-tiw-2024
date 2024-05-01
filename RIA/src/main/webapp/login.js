/**
 * Login management
 */

 (function() {
	 document.getElementById("loginbutton").addEventListener('click', (e) => {
		var form = document.getElementById("loginform");
		document.getElementById("errormessageLogin").textContent = "";
		if (form.checkValidity()) {
			
			let valid = true;
			let error = "";
			
			const username = form.username.value;
			const password = form.password.value;
			
			if (!username || username.length > 50) {
				valid = false;
				error += "invalid username!"
			}
			
			if (!password || password.length > 30) {
				valid = false;
				error += "invalid password!";
			}
			
			if (valid) {
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
						} 
					}
				);
			} else {
				document.getElementById("errormessageLogin").textContent = error;
			}
			
			
		} else {
			form.reportValidity();
		}
	 });
 })();