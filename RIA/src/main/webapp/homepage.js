/**
 * homepage button function
 */
(function() {
	document.getElementById("homepage-button").addEventListener("click", (e) => {
		e.preventDefault();
		// set the homepage container as visible
		document.getElementById("homepage-container").classList.remove("hidden");
		// set the homepage button as hidden
		document.getElementById("homepage-button-container").classList.add("hidden");
		// set the group container as hidden
		document.getElementById("group-details-container").classList.add("hidden");
	});
})();

/**
 * created-groups getter
 */
function loadCreatedGroups() {
	makeCall("POST", 'GetCreatedGroups', null, function(x) {
		createGroups(x, "created-groups-table");
	});
}

/**
 * active-groups getter
 */
function loadActiveGroups() {
	makeCall("POST", 'GetActiveGroups', null, function(x) {
		createGroups(x, "active-groups-table");
	});
}

/**
 * groups loader at startup
 */
(function() {
	loadCreatedGroups();
	loadActiveGroups();
})();

/**
 * create the table rows with the group info
 */
function createGroups(req, tableName) {
		if(req.readyState == XMLHttpRequest.DONE) {
			switch (req.status) {
				case 200:
					var message = JSON.parse(req.responseText);
					const table = document.getElementById(tableName);

					for (group of message) {

						const row = document.createElement("tr");

						for (const [key, value] of Object.entries(group)) {

							if (key === "creation_date") {
								const td = document.createElement("td");
								td.textContent = formatDate(value);
								row.appendChild(td);
					
							} else if(key !== "min_participants" && key !== "max_participants" && key !== "id") {
								const td = document.createElement("td");
								td.textContent = value;
								row.appendChild(td);
							}

						}
						
						row.appendChild(createDetailsAnchor(group.id));
						table.appendChild(row);
					}
					break;
				case 400: // bad request
					console.error(req.responseText);
					break;
				case 500: // server error
					console.error(req.responseText);
					break;
		}
	}
};

/**
 * create the button that loads the group's details
 */
function createDetailsAnchor(group_id) {
	const anchor = document.createElement("a");
	anchor.textContent = "Dettagli";
	anchor.href = "";
	
	anchor.addEventListener('click', () => {
		event.preventDefault();
		const params = new FormData();
		params.append("groupId", group_id);
		// get the group details
		makeCall("POST", "GetGroup", params, function(x) {
			if (x.readyState == XMLHttpRequest.DONE) {
		
				switch (x.status) {
					case 200:
						var details = JSON.parse(x.responseText);
						// get the group participants
						makeCall("POST", "GetGroupParticipants", params, function(x) {
							if (x.readyState == XMLHttpRequest.DONE) {
								
								switch (x.status) {
									case 200:
										var participants = JSON.parse(x.responseText);
										viewGroup(details, participants);
										break;
									case 400:
										console.error(x.responseText);
										break;
									case 500:
										console.error(x.responseText);
										break;
								}
							}
						});
						break;
					case 400:
						console.error(x.responseText);
						break;
					case 500:
						console.error(x.responseText);
						break;
				}
			}
		});
		
	});
	
	return anchor;
}

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
				
				// show the modal window
				document.getElementById("modal-panel").classList.remove("hidden");
				document.getElementById("modal-overlay").classList.remove("hidden");
				
				// show users in the modal panel
				showUsers();
				
				sessionStorage.setItem('title', title);
				sessionStorage.setItem('duration', duration);
				sessionStorage.setItem('min_participants', min_participants);
				sessionStorage.setItem('max_participants', max_participants);
			} 			
		} else {
			form.reportValidity();
		}
	 });
 })();
 
 