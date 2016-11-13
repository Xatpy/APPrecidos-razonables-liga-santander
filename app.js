/* APP-recidos-razonables-liga-santander */

function showLoadingSpinner(value) {
	document.getElementById("loading").style.display = value ? "block": "none" ;
}

function loadImageToCompareImg(imageUrl) {
	document.getElementById("imgCompare").src = imageUrl;
}

function showErrorMessage(message) {
	document.getElementById("errorMessage").style.visibility = "visible";
	document.getElementById("errorMessage").innerText = message;
	document.getElementById("errorMessage").style.display = "block";
}

function hideErrorMessage() {
	document.getElementById("errorMessage").style.visibility = "hidden";
}

function onblurInput() {
	var photoURL = document.getElementById("photoURL").value;
	if (checkURLisAnImage(photoURL)) {
		hideErrorMessage();
		document.getElementById("preImg").src = photoURL;
		document.getElementById("preImgDiv").style.display = "block";
		document.getElementById("errorMessage").style.display = "none";
		document.getElementById("buttonSend").disabled = false; 
		inputStyleWithError(false);
		//loadImageToCompareImg(document.getElementById("preImg").value);
	} else {
		showErrorMessage("Error, inserta una dirección web (URL) con una foto válida (formatos aceptados .jpg | .jpeg | .png");
		document.getElementById("preImgDiv").style.display = "none";
		document.getElementById("buttonSend").disabled = true; 
		//hideResults();
		inputStyleWithError(true);
	}
}

function inputStyleWithError(error) {
	document.getElementById("photoURL").style.border = !error ? "1px solid #ccc" : "1px solid #F00";
}

function checkURLisAnImage(url) {
    return(url.match(/\.(jpeg|jpg|png)$/) != null);
}

function fillWithPlaceholders() {
	var placeholderURL = "http://e03-elmundo.uecdn.es/assets/multimedia/imagenes/2015/11/13/14474300157302.jpg";
	for (var i = 0; i < 3; ++i) {
		document.getElementById("resultPhoto" + (i)).src = placeholderURL;
		document.getElementById("resultName" + (i)).innerText = "foo";
	}
	// Photo to compare
	document.getElementById("imgCompare").src = placeholderURL;
}

function hideResults() {
	document.getElementById("resultsTitle").style.visibility = "hidden";
	document.getElementById("resultsDiv").style.visibility = "hidden";
}

$(document).ready(function(){
	//fillWithPlaceholders();
	showLoadingSpinner(false);
	onblurInput();

    $("button").click(function(){
    	var apiURL = "https://znrd2tniy1.execute-api.us-west-2.amazonaws.com/prod/getPlayers";
    	var photoURL = document.getElementById("photoURL").value;
    	var json = {key1:photoURL}

    	/// Loading....
    	document.getElementById("loading-image").src = photoURL;
    	showLoadingSpinner(true);

        $.ajax(apiURL, {
		    'data': JSON.stringify(json),
		    'type': 'POST',
		    'processData': false,
		    'contentType': 'application/json',
		    success: function (data) {
		    	//alert(data.a);
		    	if (data.errorType === undefined) {
		    		var players = JSON.parse(data);
			    	var urlImg;
			    	for (var i = 0; i < players.length; ++i) {
			    		document.getElementById("resultPhoto" + (i)).src = players[i].photoUrl;
			    		document.getElementById("resultName" + (i)).innerText = (i+1) + ".- " +players[i].name;
			    		document.getElementById("confidence" + (i)).innerText = "Parecido (%): " + (players[i].confidence * 100).toFixed(2) + "%";
			    	}
			    	// Photo to compare
					//loadImageToCompareImg(photoURL);
					document.getElementById("imgCompare").src = photoURL;

			    	document.getElementById("resultsDiv").style.visibility = "visible";
					document.getElementById("resultsTitle").style.visibility = "visible";
					document.getElementById("preImgDiv").style.display = "none";

		    	} else {
	    			showErrorMessage("Error obteniendo la cara de la persona con la imagen data. Por favor, intenta con una nueva foto.");
					hideResults();
		    	}			    	

    			showLoadingSpinner(false);		    		
		    },
		    error: function (request, status, error) {
        		alert(request.responseText);
    		}
		});
    });
});