// JQuery Embed for Facebook
// Author: Loren Heyns
// Company: DreamStudio.com
// Please send updates to http://DreamStudio.com/account/write/8
// This message must remain at top of script

var fbFolder = '111662108795'; // GL - to change
var showComments = true;

function fbImageFetch(token) {
	// Callback is set with a '?' to overcome the cross domain problems with JSON

    // You can also request multiple objects in a single query using the "ids" query parameter.
    // For example, the URL https://graph.facebook.com?ids=arjun,vernal returns both profiles in the same response.
	// since=today&

	// Swicth from /posts to /feed to show everyone
	var url = "https://graph.facebook.com/" + fbFolder + "/posts?access_token=" + token + "&limit=3&callback=?";

    // Needs token of current user:
	url = "https://graph.facebook.com/me/photos?access_token=" + token + "&limit=24&callback=?";

	//url = "https://graph.facebook.com/me/photos?access_token=2227470867|2.AQByDEggEPPubqEq.3600.1309010400.0-1409278164|IwZ75x8UR3gdQ_E6lsPipHLmgTI&limit=24&callback=?";

    alert(url);
	//Use jQuery getJSON method to fetch the data from the url and then create our unordered list with the relevant data.
	$.getJSON(url, function (json) {
	    var days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
	    var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
	    var html = "";
	    //loop through and within data array's retrieve the message variable.
	    $.each(json.data, function (i, fb) {

	        	        if (fb.link) {
	        	            html += "<div id='imageThumb' onclick='javascript:document.location=\"" + fb.link + "\"'>";
	        	        } else {
	        	            html += "<div id='imageThumb' onclick='javascript:document.location=\"https://www.facebook.com/" + fbFolder + "\"'>";
	        	        }

	        //	        if (!fb.from.category) {
	        //	            html += "<img style='float:left; margin-right:4px' src='https://graph.facebook.com/" + fb.from.id + "/picture' alt='' />";
	        //	        }

	        	        if (fb.picture) {
	        	            html += "<img src='" + fb.picture + "' style='margin-right:10px; margin-bottom:2px; max-width:160px' alt='' />";
	        	        }

//	        	        if (fb.name) {
//	        	            //html += '<b>' + fb.name + '</b><br />';
//	        	            if (fb.link) {
//	        	                html += "<b><a href='javascript:document.location=\"" + fb.link + "\"'>" + fb.name + "</a></b><br />";
//	        	            } else {
//	        	                html += "<b><a href='javascript:document.location=\"https://www.facebook.com/" + fbFolder + "\"'>" + fb.name + "</a></b><br />";
//	        	            }
//	        	        }

	        //	        if (fb.created_time) {
	        //	            var startDate = new Date(formatFBTime(fb.created_time));
	        //	            var startDateString = days[startDate.getDay()] + ' at ' + showTheHours(startDate.getHours()) + ':' + showZeroFilled(startDate.getMinutes()) + ' ' + showAmPm(startDate);
	        //	            html += '<div class="messagePostDate">Posted ' + startDateString + '</div>';
	        //	        }
	        //	        if (fb.message) {
	        //	            html += "<div >" + fb.message + "</div>";
	        //	        }
	        //	        if (fb.description) {
	        //	            html += "<div class='newsfeedDesc'>" + fb.description.replace(fb.name, "") + "</div>";
	        //	        }
	        //	        // Comments
	        //	        // Only summary of comments is displayed, just like facebook default, only 2 available unless you "read more" or "view all"... 
	        //	        // the graph call for "view all comments" is get the post ID of that post and append "/comment"...
	        //	        // example:
	        //	        // FEED: https://graph.facebook.com/161439580553446/feed
	        //	        // A POST FROM THE FEED: https://graph.facebook.com/161439580553446_177522428945161
	        //	        // VIEW ALL COMMENTS: https://graph.facebook.com/161439580553446_177522428945161/comments


	        //	        html += '<div style="clear:both"></div>';

	        //	        // COMMENTS
	        //	        var splitID = fb.id.split("_");
	        //	        if (showComments) {
	        //	            if (fb.comments) {
	        //	                $.each(fb.comments, function (i, theComments) {
	        //	                    if (i == "count") {
	        //	                        if (theComments > 2) {
	        //	                            html += "<a class='addComment' href='https://www.facebook.com/" + fbFolder + "/posts/" + splitID[1] + "'>" + (theComments - 2) + " more comments - Add comment</a><br />";
	        //	                        } else if (theComments == 1) {
	        //	                            html += "<a class='addComment' href='https://www.facebook.com/" + fbFolder + "/posts/" + splitID[1] + "'>Add comment</a><br />";
	        //	                        }
	        //	                    }

	        //	                    if (i == "data") {
	        //	                        $.each(theComments, function (i, data) {
	        //	                            html += "<div class='comment'><img class='commentImage' src='https://graph.facebook.com/" + data.from.id + "/picture' alt='' />";
	        //	                            html += data.message + "<br />";
	        //	                            if (data.created_time) {
	        //	                                var startDate = new Date(formatFBTime(data.created_time));
	        //	                                var startDateString = days[startDate.getDay()] + ' at ' + showTheHours(startDate.getHours()) + ':' + showZeroFilled(startDate.getMinutes()) + ' ' + showAmPm(startDate);
	        //	                                html += '<span style="color:#aaa">Posted ' + startDateString + '</span><br />';
	        //	                            }

	        //	                            html += "</div><div style='clear:both'></div>";
	        //	                        });
	        //	                    }

	        //	                });
	        //	            } else {
	        //	                html += "<a class='addComment' href='https://www.facebook.com/" + fbFolder + "/posts/" + splitID[1] + "'>Add comment</a><br />";
	        //	            }
	        //	        }

	        //	        //	                            if (fb.properties.name) {
	        //	        //	                                    html += fb.properties.name + "<br />";
	        //	        //                              }

	        //	        //	                                if (fb.updated_time) {
	        //	        //	                                    var offset = new Date(fb.updated_time);
	        //	        //	                                    //var offset = curdate.getTimeZoneOffset();
	        //	        //	                                    var startDateString = days[offset.getDay()] + ' at ' + offset.getHours() + ':' + offset.getMinutes();
	        //	        //	                                    //+ ", " + months[offset.getMonth()] + ' ' + offset.getDate() + ', ' + fourdigits(offset.getYear());
	        //	        //	                                    html += 'Updated ' + startDateString + '</a><br />';
	        //	        //	                                }



	        html += "</div>";
	    });
	    html += "";


	    //Animate - Fuzzy text with IE8
	    //	                            $('.imagefeed').animate({ opacity: 0 }, 500, function () {

	    //	                                $('.imagefeed').html(html);

	    //	                            });

	    //	                            $('.imagefeed').animate({ opacity: 1 }, 500);

	    // Temp, no animation
	    $('.imagefeed').html(html);
	});

};
function formatFBTime(fbDate) {
	// For Explorer 8 and Firefox 3
	var arrDateTime = fbDate.split("T");
	var arrDateCode = arrDateTime[0].split("-");
	var strTimeCode = arrDateTime[1].substring(0, arrDateTime[1].indexOf("+"));
	var arrTimeCode = strTimeCode.split(":");
	var valid_date = new Date()
	valid_date.setUTCFullYear(arrDateCode[0]);
	valid_date.setUTCMonth(arrDateCode[1] - 1);
	valid_date.setUTCDate(arrDateCode[2]);
	valid_date.setUTCHours(arrTimeCode[0]);
	valid_date.setUTCMinutes(arrTimeCode[1]);
	valid_date.setUTCSeconds(arrTimeCode[2]);
	return valid_date;
}
function fourdigits(number) {
	return (number < 1000) ? number + 1900 : number;
}
function showTheHours(theHour) {
	if (theHour > 0 && theHour < 13) {
	    if (theHour == "0") theHour = 12;
	    return (theHour);
	}
	if (theHour == 0) {
	    return (12);
	}
	return (theHour - 12);
}
function showZeroFilled(inValue) {
	if (inValue > 9) {
	    return "" + inValue;
	}
	return "0" + inValue;
}
function showAmPm(inDate) {
	if (inDate.getHours() < 12) {
	    return (" am");
	}
	return (" pm");
}
 
	                