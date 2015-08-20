function resizeTextArea(id, page){
	// Reset the height
	document.getElementById(id).style.height = "";
	
	// Get the size of the input in pixels
	var height = document.getElementById(id).scrollHeight;
	
	// Max height = 100px
	if(height < 100){
		// Set the height of the textarea 
		document.getElementById(id).style.height = (height) + "px";
	}
	else{
		document.getElementById(id).style.height = 100 + "px";
	}
}