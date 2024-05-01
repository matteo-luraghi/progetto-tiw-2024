/**
 * Sign Up management 
 */

 (function() {
	 document.getElementById("signupbutton").addEventListener('click', (e) => {
		var form = document.getElementById("signupform");
		document.getElementById("errormessageSignup").textContent = "";
		if (form.checkValidity()) {
			
			let valid = true;
			let error = "";
			
			const name = form.name.value;
			const surname = form.surname.value;
			const username = form.username.value;
			const email = form.email.value;
			const password = form.password.value;
			const repeatPassword = form.repeatPassword.value;
			
			if (!name || name.length > 50) {
				valid = false;
				error += "invalid name!";
			}
			
			if (!surname || surname.length > 50) {
				valid = false;
				error += "invalid surname!";
			}
			
			if (!username || username.length > 50) {
				valid = false;
				error += "invalid username!";
			}
			
			if (!email || email.length > 320 || !email.includes("@") || !email.includes(".")) {
				valid = false;
				error += "invalid email!"
			}
			
			if (!password || password.length > 30) {
				valid = false;
				error += "password is too long!";
			}
			
			if (password !== repeatPassword) {
				valid = false;
				error += "password and repeat password must be equal!";
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
								document.getElementById("errormessageSignup").textContent = message;
								break;
							case 401: // unauthorized
								document.getElementById("errormessageSignup").textContent = message;
								break;
							case 500: // server error
								document.getElementById("errormessageSignup").textContent = message;
								break;
							}
						} 	
					}
				);
			} else {
				document.getElementById("errormessageSignup").textContent = error;
			}
			
			
			
		} else {
			form.reportValidity();
		}
	 });
 }());