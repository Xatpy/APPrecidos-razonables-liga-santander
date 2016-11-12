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
}

function hideErrorMessage() {
	document.getElementById("errorMessage").style.visibility = "hidden";
}

function onblurInput() {
	var photoURL = document.getElementById("photoURL").value;
	if (checkURLisAnImage(photoURL)) {
		hideErrorMessage();
		document.getElementById("preImg").src = photoURL;
		//loadImageToCompareImg(document.getElementById("preImg").value);
	} else {
		showErrorMessage("Error, insert a valid photo url (accepted formats: .jpg | .jpeg | .png");
	}
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
    	debugger

        $.ajax(apiURL, {
		    'data': JSON.stringify(json),
		    'type': 'POST',
		    'processData': false,
		    'contentType': 'application/json',
		    success: function (data) {
		    	//alert(data.a);
		    	debugger
		    	if (data.errorType === undefined) {
		    		var players = JSON.parse(data);
			    	var urlImg;
			    	for (var i = 0; i < players.length; ++i) {
			    		document.getElementById("resultPhoto" + (i)).src = players[i].photoUrl;
			    		document.getElementById("resultName" + (i)).innerText = players[i].name;
			    		document.getElementById("confidence" + (i)).innerText = "Parecido (%): " + (players[i].confidence * 100).toFixed(2) + "%";
			    	}
			    	// Photo to compare
					//loadImageToCompareImg(photoURL);
					document.getElementById("imgCompare").src = photoURL;

			    	document.getElementById("resultsDiv").style.visibility = "visible";
					document.getElementById("resultsTitle").style.visibility = "visible";
					document.getElementById("preImgDiv").style.display = "none";

		    	} else {
	    			showErrorMessage("Error getting info about faces in the image that you sent. Please, try with another.");
	    			document.getElementById("resultsDiv").style.visibility = "hidden";
					document.getElementById("resultsTitle").style.visibility = "hidden";
		    	}			    	

    			showLoadingSpinner(false);		    		
		    },
		    error: function (request, status, error) {
        		alert(request.responseText);
    		}
		});
    });
});