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
		// remove detail group id
		sessionStorage.removeItem("group_id");
	});
})();

/**
 * groups loader at startup
 */
(function() {
	loadCreatedGroups();
	loadActiveGroups();
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
		
		for (const error_old of errors) {
			removeError(error_old + "-error-newgroup");
		}
		removeError("error-newgroup");
		removeError("error-min-max");
		
		// remove all the previous errors in the select user panel
		const user_errors_container_old = document.getElementById("errors-user-selection-container");
		const user_errors_old = user_errors_container_old.getElementsByTagName('p');
		for (const user_error_old of user_errors_old) {
			user_errors_container_old.removeChild(user_error_old);
		}
		
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
 
/**
 * created-groups getter
 */
function loadCreatedGroups() {
	makeCall("POST", 'GetCreatedGroups', null, function(x) {
		fillGroup(x, "created-groups-table");
	});
}

/**
 * active-groups getter
 */
function loadActiveGroups() {
	makeCall("POST", 'GetActiveGroups', null, function(x) {
		fillGroup(x, "active-groups-table");
	});
}
 
/**
 * create the table rows with the group info
 */
function fillGroup(req, tableName) {
		if(req.readyState == XMLHttpRequest.DONE) {
			switch (req.status) {
				case 200:
					var message = JSON.parse(req.responseText);
					const table = document.getElementById(tableName);

					for (const group of message) {

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
						
						// automatically set the boolean true if the user is the group's creator
						row.appendChild(createDetailsAnchor(group.id, tableName === "created-groups-table"));
						table.appendChild(row);
					}
					break;
				case 400: // bad request
					createErrorWithTimeout("groups-table-error", "groups-table-error-container", x.responseText, 4*1000);
					break;
				case 500: // server error
					createErrorWithTimeout("groups-table-error", "groups-table-error-container", x.responseText, 4*1000);
					break;
		}
	}
}
 
/**
 * set the group detail view
 */
function viewGroup(details, participants, creator) {
	
	// clear the group details table
	clearTable("group-participants-table");
	
	// set the homepage container as hidden
	document.getElementById("homepage-container").classList.add("hidden");
	// set the homepage button as visible
	document.getElementById("homepage-button-container").classList.remove("hidden");
	// set the group container as visible
	document.getElementById("group-details-container").classList.remove("hidden");
	
	// hide or show the bin depending on user role
	if (creator) {
		document.getElementById("trash").classList.remove("hidden");
	} else {
		document.getElementById("trash").classList.add("hidden");
	}
	
	// set the group's details
	details["creation_date"] = formatDate(details["creation_date"]);
	const attributes = ["title", "duration", "creation_date", "min_participants", "max_participants"];
	for (const attribute of attributes) {
		document.getElementById(`group-${attribute}`).textContent = details[attribute];
	}
	
	// fill participants table
	const group_table = document.getElementById("group-participants-table");
	
	for (const participant of participants) {

		const row = document.createElement("tr");
		const user_id = participant.id;
		row.setAttribute("id", user_id);
		
		const participant_attributes = ["name", "surname"];
		for (const p_attr of participant_attributes) {
			const td = document.createElement("td");
			td.textContent = participant[p_attr];
			row.appendChild(td);
		}
		
		if(creator) { 
			row.setAttribute("draggable", true);
			row.classList.add("draggable");
			// add listeners to determine when the row is being dragged
			row.addEventListener('dragstart', (e) => {
				e.dataTransfer.setData('text/plain', e.target.id);
			});
		}

		group_table.appendChild(row);
	}
}
 
 /**
 * create the button that loads the group's details
 */
function createDetailsAnchor(group_id, creator=false) {
	const anchor = document.createElement("a");
	anchor.textContent = "Dettagli";
	anchor.href = "";
	
	anchor.addEventListener('click', (e) => {
		e.preventDefault();
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
										sessionStorage.setItem("group_id", group_id);
										
										viewGroup(details, participants, creator);
										break;
									case 400:
										createErrorWithTimeout("groups-table-error", "groups-table-error-container", x.responseText, 4*1000);
										break;
									case 500:
										createErrorWithTimeout("groups-table-error", "groups-table-error-container", x.responseText, 4*1000);
										break;
								}
							}
						});
						break;
					case 400:
						createErrorWithTimeout("groups-table-error", "groups-table-error-container", x.responseText, 4*1000);
						break;
					case 500:
						createErrorWithTimeout("groups-table-error", "groups-table-error-container", x.responseText, 4*1000);
						break;
				}
			}
		});
		
	});
	
	return anchor;
}

/**
 * users tavle creator
 */
function showUsers() {
	
	makeCall("GET", 'GetRegisteredUsers', null, function(x) {
		if (x.readyState == XMLHttpRequest.DONE) {
								
			switch (x.status) {
				case 200:
					var users = JSON.parse(x.responseText);
					const users_table = document.getElementById("users-table-body");
					
					for (const user of users) {
						const row = document.createElement("tr");
						const user_values = ["name", "surname"];
						for (const user_value of user_values) {
							const td = document.createElement("td");
							td.textContent = user[user_value];
							row.appendChild(td);
						}	
						
						// create the checkbox
						const checkbox = document.createElement("input");
						checkbox.setAttribute("type", "checkbox");
						checkbox.setAttribute("name", "selected");
						checkbox.setAttribute("value", user.id);
						
						row.appendChild(checkbox);
						users_table.appendChild(row);
					}
					
					break;
				case 400:
					createError("error-user-selection", "error-user-selection-container", x.responseText);
					break;
				case 500:
					createError("error-user-selection", "error-user-selection-container", x.responseText);
					break;
			}
		}
	});
}