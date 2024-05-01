/**
 * Login management
 */

 (function() {
	 document.getElementById("loginbutton").addEventListener('click', (e) => {
		var form = document.getElementById("loginform");

		const errors = ["username", "password"];
		
		for (error_old of errors) {
			removeError(error_old, "login");
		}
		if (form.checkValidity()) {
			
			let valid = true;
			
			const username = form.username.value;
			const password = form.password.value;
			
			if (!username || username.length > 50) {
				valid = false;
				createError("username", "login", "Username non valido!");
			}
			
			if (!password || password.length > 30) {
				valid = false;
				createError("password", "login", "Password non valida!");
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
								document.getElementById("error-message-login").textContent = message;
								break;
							case 401: // unauthorized
								document.getElementById("error-message-login").textContent = message;
								break;
							case 500: // server error
								document.getElementById("error-message-login").textContent = message;
								break;
							}
						} 
					}
				);
			} 			
		} else {
			form.reportValidity();
		}
	 });
 })();