/**
 * user deleter
 */
(function() {
	
	/**
	 * error message remover
	 */
	function removeError(id) {
		const error_old = document.getElementById(id);
		if (error_old) {
			error_old.remove();
		}
	}
	
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

