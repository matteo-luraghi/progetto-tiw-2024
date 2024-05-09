/**
 * Sign Up management 
 */

 (function() {
	document.getElementById("signup-button").addEventListener('click', (e) => {
		var form = document.getElementById("signup-form");
		
		const errors = ["name", "surname", "username", "email", "password", "repeat-password"];
		
		for (const error_old of errors) {
			removeError(error_old + "-error-signup");
		}
		removeError("error-message-signup");

		if (form.checkValidity()) {
			
			let valid = true;
			
			const name = form.name.value;
			const surname = form.surname.value;
			const username = form.username.value;
			const email = form.email.value;
			const password = form.password.value;
			const repeatPassword = form.repeatPassword.value;
			
			if (!name || name.length > 50) {
				valid = false;
				createError("name-error-signup", "name-input-signup", "Nome non valido!");
			}
			
			if (!surname || surname.length > 50) {
				valid = false;
				createError("surname-error-signup","surname-input-signup", "Cognome non valido!");
			}
			
			if (!username || username.length > 50) {
				valid = false;
				createError("username-error-signup", "username-input-signup", "Username non valido!");
			}
			
			if (!email || email.length > 320 || !email.includes("@") || !email.includes(".")) {
				valid = false;
				createError("email-error-signup", "email-input-signup", "Email non valida!");
			}
			
			if (!password || password.length > 30) {
				valid = false;
				createError("password-error-signup", "password-input-signup", "Password non valida!");
			}
			
			if (password !== repeatPassword) {
				valid = false;
				createError("repeat-password-error-signup", "repeat-password-input-signup", "Password e ripeti password diverse!");
			} 
		
			if(valid) {
				makeCall("POST", 'CheckSignUp', new FormData(form), 
				function(x) {
					if (x.readyState == XMLHttpRequest.DONE) {
						var message = x.responseText;
						switch (x.status) {
							case 200: // success, redirect to homepage
								sessionStorage.setItem('username', message);
								window.location.href = "Home.html";
								break;
							case 400: // bad request
								createError("error-message-signup", "error-message-container-signup", message);
								break;
							case 401: // unauthorized
								createError("error-message-signup", "error-message-container-signup", message);
								break;
							case 500: // server error
								createError("error-message-signup", "error-message-container-signup", message);
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
 }());