(function() {
	document.getElementById("logout-button").addEventListener("click", (e) => {
		e.preventDefault();
		// delete the username from the storage
		sessionStorage.removeItem("username");
		// redirect to the login page
		window.location.href = "index.html";
		// call the logout servlet
		makeCall("POST", "Logout", null, () => {});
	});
})();