/**
 * Login management
 */

 (function() {
	document.getElementById("login-button").addEventListener('click', (e) => {
		var form = document.getElementById("login-form");

		const errors = ["username", "password"];
		
		for (error_old of errors) {
			removeError(error_old + "-error-login");
		}
		removeError("error-message-login");
		
		if (form.checkValidity()) {
			
			let valid = true;
			
			const username = form.username.value;
			const password = form.password.value;
			
			if (!username || username.length > 50) {
				valid = false;
				createError("username-error-login", "username-input-login", "Username non valido!");
			}
			
			if (!password || password.length > 30) {
				valid = false;
				createError("password-error-login", "password-input-login", "Password non valida!");
			}
			
			if (valid) {
				makeCall("POST", 'CheckLogin', new FormData(form), 
				function(x) {
					if (x.readyState == XMLHttpRequest.DONE) {
						var message = x.responseText;
						
						switch (x.status) {
							case 200: // success, redirect to homepage
								sessionStorage.setItem('username', message);
								window.location.href = "Home.html";
								break;
							case 400: // bad request
								createError("error-message-login", "error-message-container-login", message);
								break;
							case 401: // unauthorized
								createError("error-message-login", "error-message-container-login", message);
								break;
							case 500: // server error
								createError("error-message-login", "error-message-container-login", message);
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