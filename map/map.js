/*
 * Mapping and Geolocation
 * @author Dreamstudio.com
 * @contributors SmartGov.info, ParkDynamics.com
 */

 /* BING MAP */

 // Script will be moved here from html page.

 /* GOOGLE MAP */

 // To be added.

 /* LOCAL FEEDS */
 if (navigator.geolocation) {  
	navigator.geolocation.getCurrentPosition(function(position) {  

        // UNCOMMENT TO ACTIVATE - Also remove display:none from container and copy over CSS from /twitter directory
		//callback(position.coords.latitude, position.coords.longitude);
		//alert("Near My Location (Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude + ")");
	});
} else {
    // alert("Geolocation services are not supported by your browser.  Please use Google Chrome or another browser supporting GeoLocation services.");

    //var parent = document.getElementById('tweetList'); 
    //parent.append('Geolocation services are not supported by your browser.'); 
    //loadFromIP(); // Didn't work with ip.  ALSO, NEED TO MOVE OVER ip.aspx
}

function loadFromIP() {
    var ip = "";
    jQuery.get('ip.aspx', function (data) {
        ip = data + "";
        //alert(ip);

        // Experimenting to see if ip supported 
        var geocode = "&rpp=100&ip=" + ip + "%2C1mi";
        var fullUrl = url + geocode;
        var head = document.getElementsByTagName('head');
        var script = document.createElement('script');
        //alert(fullUrl);

        script.src = fullUrl;
        head[0].appendChild(script);
    });
    //alert("ip " + ip);
}
function callback(lat, lon) {
    //print(lat,lon);

    // http://search.twitter.com/search.json?callback=getTweets&geocode=33.74454,-84.23409,1mi
    var geocode = "&rpp=100&geocode=" + lat + "%2C" + lon + "%2C1mi"; 
	var fullUrl = url + geocode; 
	var head = document.getElementsByTagName('head');
	var script = document.createElement('script');

	//alert('test ' + fullUrl);
	
	script.src = fullUrl; 
	head[0].appendChild(script); 
} 
var url = "http://search.twitter.com/search.json?callback=getTweets";

function getTweets(json) {
    var q; 
	var parent = document.getElementById('tweetList'); 
	parent.innerHTML = ''; 
	var child; 

	for (var i = 0; i < json.results.length; i++) { 
	   q = json.results[i]; 
	   child = document.createElement("div"); 
	   child.setAttribute("class","tweet");
	   child.innerHTML = '<div class="avatar"><img src="'+q.profile_image_url+'" alt="avatar" width="48" height="48" /></div>';
	   child.innerHTML += '<div class="content"><a href="http://m.twitter.com/' + q.from_user + '">' + q.from_user + '</a> ' + q.text + '<div class="extra">' + q.location + ' (' + q.created_at + ')</div></div>';

	   child.innerHTML += '<div class="content">' + q.source + '</div>';
	   child.innerHTML += '<div class="content">Location: ' + q.location + '</div>';

	   parent.appendChild(child); 
	}
}

function print(lat,lon){
	document.getElementById("location").innerHTML = "Lat: "+lat+ " Lon: " +lon;
}