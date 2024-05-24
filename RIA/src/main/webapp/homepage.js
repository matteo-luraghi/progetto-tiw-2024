(function() { // prevent global scope

	//----------------------------------------------------ON LOAD------------------------------------------------
	
	const homeManager = new HomeManager(); // main controller
	window.addEventListener("load", ()  => {
		if (sessionStorage.getItem("username") == null) {
			window.location.href = "index.html";
		} else {
			homeManager.addEventListeners();
			homeManager.start();
		}
	}, false);
	
	//----------------------------------------------------HOMEPAGE------------------------------------------------

	/**
	 * HOMEPAGE manager
	 */
	function HomeManager() {
		
		/**
		 * add the needed event listeners
		 */
		this.addEventListeners = function() {
			// homepage button listener
			this.homePageButtonListener();
			// new group form listener
			const newGroupManager = new NewGroupManager();
			newGroupManager.addClickListener();
			// user selection button listeners
			const userSelectionManager = new UserSelectionManager();
			userSelectionManager.addInviteButtonListener();
			userSelectionManager.addCloseButtonListener();
		}
		
		/**
		 * load the homepage
		 */
		this.start = function() {
			// load the user's groups
			this.loadGroups();
			this.disableFormPageReload();
		}

		/**
		 * add homepage button functionality
		 */
		this.homePageButtonListener = function() {
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
		};

		// load the user's groups
		this.loadGroups = function() {
			loadCreatedGroups();
			loadActiveGroups();
		}
		
		/**
		 * prevent page from reloading
		 */
		this.disableFormPageReload = function() {
			const form = document.getElementById("new-group-form");
			form.addEventListener('submit', function(event) {event.preventDefault();});
		}

	}
	
	//---------------------------------------------------NEW GROUP FORM------------------------------------------------

	/**
	 * NEW GROUP manager
	 */
	function NewGroupManager() {
		const form = document.getElementById("new-group-form");
		const errors = ["title", "duration", "min_participants", "max_participants"];
		
		let title, duration, min_participants, max_participants;
		
		/**
		 * reset the error messages
		 */
		this.reset = function() {
			// remove old error messages
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
		}
		
		/**
		 * add the click listener to the new group form
		 */
		this.addClickListener = function() {
			
			document.getElementById("new-group-button").addEventListener('click', (e) => { 
				e.preventDefault();
				
				this.reset();
				
				if (form.checkValidity()) {

					if (this.checkParams()) {
						// show the modal window
						document.getElementById("modal-panel").classList.remove("hidden");
						document.getElementById("modal-overlay").classList.remove("hidden");
						
						// show users in the modal panel
						this.showUsers();
						
						// save the group's info in the session storage
						sessionStorage.setItem('title', title);
						sessionStorage.setItem('duration', duration);
						sessionStorage.setItem('min_participants', min_participants);
						sessionStorage.setItem('max_participants', max_participants);
					}

				} else {
					form.reportValidity();
				}
			});
		}
		
		/**
		 * check params' validity
		 */
		this.checkParams = function() {
			let valid = true;
				
			title = form.title.value;
			duration = parseInt(form.duration.value);
			min_participants = parseInt(form.min_participants.value);
			max_participants = parseInt(form.max_participants.value);
			
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
			
			return valid;
		}
		
		/**
		 * users table creator
		 */
		this.showUsers = function() {
			
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
		
	}

	//--------------------------------------------------------USER SELECTION MODAL PANEL----------------------------------------------------------

	/**
	 * USER SELECTION MODAL WINDOW manager
	 */
	function UserSelectionManager() {

		/**
		 * add invite button click listener
		 */
		this.addInviteButtonListener = function() {
			document.getElementById("invite-users-button").addEventListener('click', (e) => {
				e.preventDefault();
				
				removeError("error-user-selection");
				
				const user_table = document.getElementById("users-table-body");
				const inputs = user_table.getElementsByTagName("input");

				// remove the highlighted class from every row
				for (const checkbox of inputs) {
					const row = checkbox.parentNode;
					row.classList.remove("highlighted");
				}
				
				// get all the checked user ids
				const checkboxes_html = Array.from(inputs).filter((c) => c.checked);
				const checkboxes = checkboxes_html.map((c) => c.value);
			
				// load or initialize the error number
				let error = sessionStorage.getItem("error-min-max");
				let valid = true;
				if (!error) {
					error = 0;
				}
				
				const min_participants = parseInt(sessionStorage.getItem("min_participants"));
				const max_participants = parseInt(sessionStorage.getItem("max_participants"));
				
				if (isNaN(min_participants) || isNaN(max_participants)) {
					createError("error-user-selection", "error-user-selection-container", "Numero massimo o minimo di partecipanti invalido!");
					return;
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
					for (const checkbox of checkboxes_html) {
						const row = checkbox.parentNode;
						row.classList.add("highlighted");
					}
				}
				
				if (error == 3) {
					// too many errors: showing cancellation page
					this.showCancelPage();		

				}
				if (valid) {
					
					const title = sessionStorage.getItem("title");
					const duration = parseInt(sessionStorage.getItem("duration"));
					
					if (isNaN(duration)) {
						createError("error-user-selection", "error-user-selection-container", "Durata invalida!");
						return;
					}
					
					// checkboxes is the array of user ids
					this.createGroup(title, duration, min_participants, max_participants, checkboxes);
					
					// reset form and close modal panel
					document.getElementById("modal-close-button").click();
					document.getElementById("new-group-form").reset();
				}
				
				// scroll back to the top of the page	
				window.scrollTo(0,0);	
			
			});
		}
		
		/**
		 * add close button click listener
		 */
		this.addCloseButtonListener = function() {
			document.getElementById("modal-close-button").addEventListener('click', (e) => {
				e.preventDefault();

				// hide the modal window
				document.getElementById("modal-panel").classList.add("hidden");
				document.getElementById("modal-overlay").classList.add("hidden");
				
				// remove the group info from session storage and the attempt number
				sessionStorage.removeItem("title");
				sessionStorage.removeItem("duration");
				sessionStorage.removeItem("min_participants");
				sessionStorage.removeItem("max_participants");
				sessionStorage.removeItem("error-min-max");
				
				// remove the error message
				removeError("error-user-selection");
				
				// scroll back to the top of the page	
				window.scrollTo(0,0);
				
				// reset users in the modal panel (so that if a new user signs up they'll be immediatly present in the list)
				clearTable("users-table-body");

			});
		}
	
		/**
		 * show the cancel page due to too many failed attempts
		 */
		this.showCancelPage = function() {
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

		
		/**
		 * group creator
		 */
		this.createGroup = function(title, duration, min_participants, max_participants, selected) {
			const params = new FormData();
			params.append("title", title);
			params.append("duration", duration);
			params.append("min_participants", min_participants);
			params.append("max_participants", max_participants);
			params.append("selected", selected);
			
			makeCall("POST", 'CreateGroup', params, function(x) {
				if (x.readyState == XMLHttpRequest.DONE) {
					switch (x.status) {
						case 200:
							// delete all groups
							clearTable("created-groups-table");
							// reload created groups
							loadCreatedGroups();
							// show success message
							showSavedMessage();
							break;
						case 400:
							const errorMessage = x.responseText;
							if (errorMessage === "Too many attempts\n") {
								this.showCancelPage();
							} else {
								createError("error-user-selection", "error-user-selection-container", errorMessage);
							}
							break;
						case 500:
							createError("error-user-selection", "error-user-selection-container", x.responseText);
							break;
					}
				}
			});
		}
	
	}
	
	//-------------------------------------------------------------UTILITY FUNCTIONS-------------------------------------------------------
	
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

							for (const [key, value] of Object.entries(group)) { // get the group's details

								// special case: need to format the date
								if (key === "creation_date") {
									const td = document.createElement("td");
									td.textContent = formatDate(value);
									row.appendChild(td);
						
								// every other case (excluding min and max participants in home view)
								} else if(key !== "min_participants" && key !== "max_participants" && key !== "id") {
									const td = document.createElement("td");
									td.textContent = value;
									row.appendChild(td);
								}

							}
							
							// create the "details" link to show the GROUP DETIALS view
							// automatically set the boolean true if the user is the group's creator
							// in order to show the bin in the details page
							row.appendChild(createDetailsAnchor(group.id, tableName === "created-groups-table"));
							table.appendChild(row);
						}
						break;
					case 400: // bad request
						createErrorWithTimeout("groups-table-error", "groups-table-error-container", x.responseText, 4*1000);
						break;
					case 403: // forbidden, user not logged in
						sessionStorage.removeItem("username");
						window.location.href = "index.html";
					case 500: // server error
						createErrorWithTimeout("groups-table-error", "groups-table-error-container", x.responseText, 4*1000);
						break;
			}
		}
	}
	
	 /**
	 * create the button that loads the group's details
	 */
	function createDetailsAnchor(group_id, creator=false) {
		const anchor = document.createElement("a");
		anchor.textContent = "Dettagli";
		anchor.href = "";
		
		// on click load the group's data and show the GROUP DETAILS view
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
											
											// show the GROUP DETAILS view
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
	 * set the GROUP DETAILS view
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
		if (details["duration"] > 1) {
			details["duration"] = `${details["duration"]} giorni`;
		} else {
			details["duration"] = `${details["duration"]} giorno`;
		}
		const attributes = ["title", "duration", "creation_date", "min_participants", "max_participants"];
		for (const attribute of attributes) {
			document.getElementById(`group-${attribute}`).textContent = details[attribute];
		}
		
		// fill participants table
		const group_table = document.getElementById("group-participants-table");
		
		// set the group creator
		const group_creator = participants.pop();
		document.getElementById("group-creator").textContent = group_creator["name"] + " " + group_creator["surname"];
		
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
				// prevents drag event if the user is not the creator of the group
				row.addEventListener('dragstart', (e) => {
					e.dataTransfer.setData('text/plain', e.target.id);
				});
			}

			group_table.appendChild(row);
		}
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

	/**
	 * remove all rows from a table
	 */
	function clearTable(table_id) {
		const body = document.getElementById(table_id);
		const table = body.parentNode;
		body.remove();
		const new_body = document.createElement("tbody");
		new_body.setAttribute("id", table_id);
		table.appendChild(new_body);
	}
	
	
	/**
	 * format the date in the format yyyy-MM-dd 
	 */
	function formatDate(date) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;

		return [year, month, day].join('-');
	}
	
	/**
	 * error message remover
	 */
	function removeError(id) {
		const error_old = document.getElementById(id);
		if (error_old) {
			error_old.remove();
		}
	}
	
})();