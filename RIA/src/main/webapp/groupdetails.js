/**
 * set the group detail view
 */
function viewGroup(details, participants) {
	
	// clear the group details table
	clearTable("group-participants-table");
	
	// set the homepage container as hidden
	document.getElementById("homepage-container").classList.add("hidden");
	// set the homepage button as visible
	document.getElementById("homepage-button-container").classList.remove("hidden");
	// set the group container as visible
	document.getElementById("group-details-container").classList.remove("hidden");
	
	// set the group's details
	details["creation_date"] = formatDate(details["creation_date"]);
	const attributes = ["title", "duration", "creation_date", "min_participants", "max_participants"];
	for (attribute of attributes) {
		document.getElementById(`group-${attribute}`).textContent = details[attribute];
	}
	
	// fill participants table
	const group_table = document.getElementById("group-participants-table");
	
	for (participant of participants) {

		const row = document.createElement("tr");
		const user_id = participant.id;
		row.setAttribute("id", user_id);
		
		const participant_attributes = ["name", "surname"];
		for (p_attr of participant_attributes) {
			const td = document.createElement("td");
			td.textContent = participant[p_attr];
			row.appendChild(td);
		}
		
		if(true) { //group creator
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
 * user deleter
 */
(function() {
	const trash = document.getElementById("trash");
	// change image when an item is dragged over the bin
	trash.addEventListener('dragover', (e) => {
		e.preventDefault();
		trash.setAttribute("src", "images/trash-active.svg");
	});
	// change the image when an item is dragged away from the bin
	trash.addEventListener('dragleave', (e) => {
		trash.setAttribute("src", "images/trash.svg");
	});
	
	// manage item dropping
	trash.addEventListener('drop', (e) => {
		e.preventDefault();
		
		trash.setAttribute("src", "images/trash.svg");

		const id = e.dataTransfer.getData('text/plain');
		const element = document.getElementById(id);
		
		if (element) {
			const min_participants = document.getElementById("group-min_participants").textContent;
			
			const participants_num = document.querySelectorAll("tr.draggable").length - 1; // TOOD: check if the creator is included in the number
			
			if (participants_num - 1 < min_participants) {
				createError("remove-user-error", "remove-user-error-container", "Numero minimo di partecipanti non rispettato!");
				setTimeout(function() {
					removeError("remove-user-error");
				}, 4*1000);
			} else {
				const group_id = sessionStorage.getItem("group_id");
				const params = new FormData();
				params.append("userId", id);
				params.append("groupId", group_id);
				makeCall("POST", 'RemoveUser', params, function(x) {
					if (x.readyState == XMLHttpRequest.DONE) {
						switch (x.status) {
							case 200:
								// update table by removing user
								element.remove();
								// show success message
								const user_removed_success = document.getElementById("user-removed-message");
								user_removed_success.classList.remove("hidden");
								setTimeout(function() {
									user_removed_success.classList.add("hidden");
								}, 4*1000);
								break;
							case 400: // bad request
								createErrorWithTimeout("remove-user-error", "remove-user-error-container", x.responseText, 4*1000);
								break;
							case 401: // unauthorized
								createErrorWithTimeout("remove-user-error", "remove-user-error-container", x.responseText, 4*1000);
								break;
							case 403: // forbidden
								createErrorWithTimeout("remove-user-error", "remove-user-error-container", x.responseText, 4*1000);
								break;
							case 500: // server error
								createErrorWithTimeout("remove-user-error", "remove-user-error-container", x.responseText, 4*1000);
								break;
						}
					}
				});
			}
		}
	});
})();

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