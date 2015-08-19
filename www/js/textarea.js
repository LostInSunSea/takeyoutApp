function resizeTextArea(id){
	// Reset the height
	document.getElementById(id).style.height = "";
	
	// Get the size of the input in pixels
	var height = document.getElementById(id).scrollHeight;
    console.log(height);
	
	// Set the height of the textarea 
	document.getElementById(id).style.height = (height) + "px";
}