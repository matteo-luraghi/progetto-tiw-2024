/**
 * homepage button in cancel page functionality
 */
(function() {
	document.getElementById("cancel-homepage-button").addEventListener('click', (e) => {
		e.preventDefault();
		
		// hide cancel page
		document.getElementById("cancel-container").classList.add("hidden");
		// show home page back
		document.getElementById("homepage-container").classList.remove("hidden");
	});
})();