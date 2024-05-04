/**
 * 
 */
function showUsers() {
	
	makeCall("GET", 'GetRegisteredUsers', null, function(x) {
		if (x.readyState == XMLHttpRequest.DONE) {
								
			switch (x.status) {
				case 200:
					var users = JSON.parse(x.responseText);
					const users_table = document.getElementById("users-table-body");
					
					for (user of users) {
						const row = document.createElement("tr");
						const user_values = ["name", "surname"];
						for (user_value of user_values) {
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
					console.error(x.responseText);
					break;
				case 500:
					console.error(x.responseText);
					break;
			}
		}

	});
	
}

(function() {
	document.getElementById("invite-users-button").addEventListener('click', (e) => {
		e.preventDefault();
		
		removeError("error-user-selection");
		
		const user_table = document.getElementById("users-table-body");
		const inputs = user_table.getElementsByTagName("input");

		// remove the highlighted class from every row
		for (checkbox of inputs) {
			const row = checkbox.parentNode;
			row.classList.remove("highlighted");
		}
		
		// get all the checked user ids
		const checkboxes_html = Array.from(inputs).filter((c) => c.checked);
		const checkboxes = checkboxes_html.map((c) => c.value);

		let error = sessionStorage.getItem("error-min-max");
		let valid = true;
		if (!error) {
			error = 0;
		}
		
		const min_participants = parseInt(sessionStorage.getItem("min_participants"));
		const max_participants = parseInt(sessionStorage.getItem("max_participants"));
		
		if (isNaN(min_participants) || isNaN(max_participants)) {
			
		}
		
		if (checkboxes.length < min_participants) {
			const delta = min_participants - checkboxes.length;
			error++;
			sessionStorage.setItem("error-min-max", error);
			valid = false;
			createError("error-user-selection", "error-user-selection-container", `Troppi pochi utenti selezionati, aggiungerne almeno ${delta}`);
		}
		else if (checkboxes.length > max_participants) {
			const delta = checkboxes.length - max_participants;
			error++;
			sessionStorage.setItem("error-min-max", error);
			valid = false;
			createError("error-user-selection", "error-user-selection-container", `Troppi utenti selezionati, rimuoverne almeno ${delta}`);
			// highlight the selected users
			for (checkbox of checkboxes_html) {
				const row = checkbox.parentNode;
				row.classList.add("highlighted");
			}
		}
		
		if (error == 3) {
			
			// hide the homepage
			document.getElementById("homepage-container").classList.add("hidden");
			// set the group name in the cancel page
			document.getElementById("cancel-group-name").textContent = sessionStorage.getItem("title");
			// reset form and close the modal panel
			document.getElementById("modal-close-button").click();
			document.getElementById("new-group-form").reset();
			// show the cancel page
			document.getElementById("cancel-container").classList.remove("hidden");

		}
		if (valid) {
			
			const title = sessionStorage.getItem("title");
			const duration = parseInt(sessionStorage.getItem("duration"));
			
			if (isNaN(duration)) {
				
			}
			
			// checkboxes is the array of user ids
			createGroup(title, duration, min_participants, max_participants, checkboxes);
			
			// reset form and close modal panel
			document.getElementById("modal-close-button").click();
			document.getElementById("new-group-form").reset();
		}
		
		window.scrollTo(0,0);
		
	});
})();

/**
 * group creator
 */
function createGroup(title, duration, min_participants, max_participants, selected) {
	const params = new FormData();
	params.append("title", title);
	params.append("duration", duration);
	params.append("min_participants", min_participants);
	params.append("max_participants", max_participants);
	
	makeCall("POST", 'CreateGroup', params, function(x) {
		if (x.readyState == XMLHttpRequest.DONE) {
			switch (x.status) {
				case 200:
					const group_id = parseInt(x.responseText);
					if (isNaN(group_id)) {

					} else {
						saveParticipants(group_id, selected);
					}
				case 400:
					console.error(x.responseText);
					break;
				case 500:
					console.error(x.responseText);
					break;
			}
		}
	});
}

/**
 * user adder
 */
function saveParticipants(group_id, selected) {
	const params = new FormData();
	params.append("groupId", group_id);
	params.append("selected", selected);
	
	makeCall("POST", 'SetGroupParticipants', params, function(x) {
		if (x.readyState == XMLHttpRequest.DONE) {
			switch (x.status) {
				case 200:
					showSavedMessage();
					return;
				case 400:
					console.error(x.responseText);
					break;
				case 500:
					console.error(x.responseText);
					break;
			}
		}
	});
}

/**
 * success message handler
 */
function showSavedMessage() {
	const saved_message = document.getElementById("group-saved-message");
	saved_message.classList.remove("hidden");
	
	// remove the success message after 4 seconds
	setTimeout(function () {
		saved_message.classList.add("hidden");
	}, 4*1000);
}
