/**
 * homepage button function
 */
(function() {
	document.getElementById("homepage-button").addEventListener("click", () => {
		event.preventDefault();
		// set the homepage container as visible
		document.getElementById("homepage-container").classList.remove("hidden");
		// set the homepage button as hidden
		document.getElementById("homepage-button-container").classList.add("hidden");
		// set the group container as hidden
		document.getElementById("group-details-container").classList.add("hidden");
	});
})();

// prevent page from reloading
(function() {
	const form = document.getElementById("new-group-form");
	form.addEventListener('submit', function(event) {event.preventDefault();});
})();

/**
 * new group manager
 */
(function() {
	document.getElementById("new-group-button").addEventListener('click', (e) => {
		var form = document.getElementById("new-group-form");

		const errors = ["title", "duration", "min_participants", "max_participants"];
		
		for (error_old of errors) {
			removeError(error_old + "-error-newgroup");
		}
		removeError("error-newgroup");
		removeError("error-min-max");
		
		if (form.checkValidity()) {
			
			let valid = true;
			
			const title = form.title.value;
			const duration = parseInt(form.duration.value);
			const min_participants = parseInt(form.min_participants.value);
			const max_participants = parseInt(form.max_participants.value);
			
			if (!title || title.length > 100) {
				valid = false;
				createError("title-error-newgroup", "title-input-newgroup", "Titolo non valido!");
			}
			
			if (!duration || isNaN(duration) || duration < 1) {
				valid = false;
				createError("duration-error-newgroup", "duration-input-newgroup", "Durata non valida!");
			}
			
			if (!min_participants || isNaN(min_participants) || min_participants < 1) {
				valid = false;
				createError("min_participants-error-newgroup", "min_participants-input-newgroup", "Numero minimo di partecipanti non valido!");
			}
			
			if (!max_participants || isNaN(max_participants) || max_participants < 1) {
				valid = false;
				createError("max_participants-error-newgroup", "max_participants-input-newgroup", "Numero massimo di partecipanti non valido!");
			}
			
			if (!!min_participants && !!max_participants && !isNaN(min_participants) && !isNaN(max_participants) && max_participants < min_participants) {
				valid = false;
				createError("error-min-max", "min_participants-input-newgroup", "Numero minimo di partecipanti maggiore del numero massimo!");
			}
			
			// TODO: before creating the new group call for the GetRegisteredUsers servlet and check if selected is correct 
			if (valid) {

				sessionStorage.setItem('title', title);
				sessionStorage.setItem('duration', duration);
				sessionStorage.setItem('min_participants', min_participants);
				sessionStorage.setItem('max_participants', max_participants);
				sessionStorage.setItem('creation_date', getCurrentDate(new Date().toDateString()));
			} 			
		} else {
			form.reportValidity();
		}
	 });
 })();