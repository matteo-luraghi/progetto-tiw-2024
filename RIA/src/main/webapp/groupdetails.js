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
	// start the participant counter
	let counter = 0;
	
	for (participant of participants) {
		counter++;

		const row = document.createElement("tr");
		row.setAttribute("id", `user-${counter}`)
		
		const participant_attributes = ["name", "surname"];
		for (p_attr of participant_attributes) {
			const td = document.createElement("td");
			td.textContent = participant[`${p_attr}`];
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
		const id = e.dataTransfer.getData('text/plain');
		const element = document.getElementById(id);
		
		if (element) {
			// checks for participants and if positive remove participant
			console.log(element);
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