/**
 * Sign Up management 
 */

 (function() {
	 document.getElementById("signupbutton").addEventListener('click', (e) => {
		var form = document.getElementById("signupform");
		
		const errors = ["name", "surname", "username", "email", "password", "repeat-password"];
		
		for (error_old of errors) {
			removeError(error_old, "signup");
		}

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
				createError("name", "signup", "Nome non valido!");
			}
			
			if (!surname || surname.length > 50) {
				valid = false;
				createError("surname","signup", "Cognome non valido!");
			}
			
			if (!username || username.length > 50) {
				valid = false;
				createError("username", "signup", "Username non valido!");
			}
			
			if (!email || email.length > 320 || !email.includes("@") || !email.includes(".")) {
				valid = false;
				createError("email", "signup", "Email non valida!");
			}
			
			if (!password || password.length > 30) {
				valid = false;
				createError("password", "signup", "Password non valida!");
			}
			
			if (password !== repeatPassword) {
				valid = false;
				createError("repeat-password", "signup", "Password e ripeti password diverse!");
			} 
		
			if(valid) {
				makeCall("POST", 'CheckSignUp', form, 
				function(x) {
					if (x.readyState == XMLHttpRequest.DONE) {
						var message = x.responseText;
						switch (x.status) {
							case 200: // success, redirect to homepage
								sessionStorage.setItem('username', message);
								window.location.href = "Home.html";
								break;
							case 400: // bad request
								document.getElementById("error-message-signup").textContent = message;
								break;
							case 401: // unauthorized
								document.getElementById("error-message-signup").textContent = message;
								break;
							case 500: // server error
								document.getElementById("error-message-signup").textContent = message;
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