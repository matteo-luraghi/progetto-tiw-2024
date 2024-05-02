/**
 * group retriever
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

/*
const anchor = document.createElement("a");
anchor.textContent = "Dettagli";
anchor.href = `GetGroupDetails?groupId=${value}`;
row.appendChild(anchor);

*/

function createGroups(req, tableName) {
		if(req.readyState == XMLHttpRequest.DONE) {
			var message = JSON.parse(req.responseText);

			switch (req.status) {
				case 200:
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
						table.appendChild(row);
						}
					}
					break;
				case 400: // bad request
					console.error("BAD REQUEST");
					break;
				case 500: // server error
					console.error("SERVER ERROR");
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
		createGroups(req, "createdgroupstable");
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
		createGroups(req, "activegroupstable");
	}
	
	req.open("POST", 'GetActiveGroups');
	req.send();
})();


/**
 * new group manager
 */

// prevent page from reloading
(function() {
		const form = document.getElementById("newgroupform");
		form.addEventListener('submit', function(event) {event.preventDefault();});
})();

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