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
		const user_table = document.getElementById("users-table-body");
		const checkboxes_html = user_table.getElementsByTagName("input");
		
		// get all the checked user ids
		const checkboxes = Array.from(checkboxes_html).filter((c) => c.checked).map((c) => c.value);
		
		if (checkboxes.length < sessionStorage.getItem("min_participants") || checkboxes.length > sessionStorage.getItem("max_participants")) {
			console.log("ERROR");
		}
	})
})();
