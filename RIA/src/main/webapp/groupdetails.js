
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

function viewGroup(details, participants) {
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
		document.getElementById(`group-${attribute}`).textContent = details[`${attribute}`];
	}
	
	// fill participants table
	const group_table = document.getElementById("group-participants-table");
	for (participant of participants) {
		const row = document.createElement("tr");
		
		const participant_attributes = ["name", "surname"];
		for (p_attr of participant_attributes) {
			const td = document.createElement("td");
			td.textContent = participant[`${p_attr}`];
			row.appendChild(td);
		}

		group_table.appendChild(row);
	}
}

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
									case 500:
										console.error(x.responseText);
								}
							}
						});
						break;
					case 400:
						console.error(x.responseText);
					case 500:
						console.error(x.responseText);
				}
			}
		});
		

	});
	
	return anchor;
}

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
 * created groups getter
 */
(function() {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		createGroups(req, "created-groups-table");
	}
	
	req.open("POST", 'GetCreatedGroups');
	req.send();
})();

/**
 * active groups getter
 */
(function() {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		createGroups(req, "active-groups-table");
	}
	
	req.open("POST", 'GetActiveGroups');
	req.send();
})();