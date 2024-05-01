/**
 * new group manager
 */

 (function() {
	 document.getElementById("newgroupbutton").addEventListener('click', (e) => {
		var form = document.getElementById("newgroupform");

		const errors = ["title", "duration", "min_participants", "max_participants"];
		
		for (error_old of errors) {
			removeError(error_old + "-error-newgroup");
		}
		removeError("error-newgroup");
		removeError("error-min-max");
		
		if (form.checkValidity()) {
			
			let valid = true;
			
			const title = form.title.value;
			const duration = form.duration.value;
			const min_participants = form.min_participants.value;
			const max_participants = form.max_participants.value;
			console.log(title);
			console.log(duration);
			console.log(min_participants);
			console.log(max_participants);
			
			if (!title || title.length > 100) {
				valid = false;
				createError("title-error-newgroup", "title-input-newgroup", "Titolo non valido!");
			}
			
			if (!duration || typeof(duration) !== "number" || duration < 1) {
				valid = false;
				createError("duration-error-newgroup", "duration-input-newgroup", "Durata non valida!");
			}
			
			if (!min_participants || typeof(min_participants) !== "number" || min_participants < 1) {
				valid = false;
				createError("min_participants-error-newgroup", "min_participants-input-newgroup", "Numero minimo di partecipanti non valido!");
			}
			
			if (!max_participants || typeof(max_participants) !== "number" || max_participants < 1) {
				valid = false;
				createError("max_participants-error-newgroup", "max_participants-input-newgroup", "Numero massimo di partecipanti non valido!");
			}
			
			if (!!min_participants && !!max_participants && typeof(min_participants) === "number" && typeof(max_participants) === "number" && max_participants < min_participants) {
				valid = false;
				createError("error-min-max", "min_participants-input-newgroup", "Numero minimo di partecipanti maggiore del numero massimo!");
			}
			
			// TODO: before creating the new group call for the GetRegisteredUsers servlet and check if selected is correct 
			if (valid) {
				makeCall("POST", 'CreateGroup', form, 
				function(x) {
					if (x.readyState == XMLHttpRequest.DONE) {
						var message = x.responseText;
						
						switch (x.status) {
							case 200: // success, show homepage back
							// TODO: handle hidden stuff
								break;
							case 400: // bad request
								createError("error-newgroup", "error-newgroup-container", message);
								break;
							case 401: // unauthorized
								createError("error-newgroup", "error-newgroup-container", message);
								break;
							case 500: // server error
								createError("error-newgroup", "error-newgroup-container", message);
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