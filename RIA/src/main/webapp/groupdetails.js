/**
 * set the group detail view
 */
function viewGroup(details, participants) {
	
	// TODO: add bin if the user is the group creator
	
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