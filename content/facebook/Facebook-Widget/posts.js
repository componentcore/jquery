// JQuery Embed for Facebook
// Author: Loren Heyns
// Company: DreamStudio.com
// Please send updates to http://DreamStudio.com/account/write/8
// This message must remain at top of script.

var fbFolder = '111662108795'; // GL - to change
var showComments = true;

// Alternate - requires popup for user to signin via Facebook to get their individual access token.  
function fbFetchAccess() {
	FB.login(function (response) {
	    if (response.session) {

	        FB.getLoginStatus(function (response) {
                //alert('FireFox response');
	            if (response.session) {
	                //alert('connected');
	                //$('#connect_button').hide();
	                //$('#res_json').html('loading...');
	                token = response.session.access_token;
	                fbFetch(response.session.access_token);
	            }
	        });

	    } else {
	        alert('Not logged into Facebook.  Unable to show latest news.');
	    }
	});
}
function formatDate(startDate) {
	var days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
	var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
	var dateStr = days[startDate.getDay()];
	dateStr += ', ' + months[startDate.getMonth()] + ' ' + startDate.getDate() + ', ' + fourdigits(startDate.getYear());
	dateStr += ' at ' + showTheHours(startDate.getHours()) + ':' + showZeroFilled(startDate.getMinutes()) + ' ' + showAmPm(startDate);
	return dateStr;
}
function fbFetch(token) {
	// Callback is set with a '?' to overcome the cross domain problems with JSON

    // You can also request multiple objects in a single query using the "ids" query parameter.
    // For example, the URL https://graph.facebook.com?ids=arjun,vernal returns both profiles in the same response.
	// since=today&

	// Swicth from /posts to /feed to show everyone
	var url = "https://graph.facebook.com/" + fbFolder + "/posts?access_token=" + token + "&limit=3&callback=?";
	
	//url = "index.txt";
	//url = "../jquery/content/facebook/index.txt";
	//alert(url);
	//Use jQuery getJSON method to fetch the data from the url and then create our unordered list with the relevant data.
	$.getJSON(url, function (json) {
		var html = "<ul>";
	    var commentCount = 0;

	    // These aren't working...
	    if (!showComments) {
	    	// Wrap newsText under thumbnail.  Allows for irregualar thumbnail widths, which look odd when comments don't separate.
		    $('.newsText').attr('style', 'overflow: visible;');
	    }
	    if (showComments) {
	    	$('.newsText').attr('style', 'overflow:hidden;');
	    }

	    //loop through and within data array's retrieve the message variable.
	    $.each(json.data, function (i, fb) {
	        var splitID = fb.id.split("_");
			if (fb.link) {
	            html += "<li class='linked' onclick='javascript:document.location=\"" + fb.link + "\"'>";
	        } else if (showComments) {
				html += "<li class='linked' onclick='javascript:document.location=\"https://www.facebook.com/" + fbFolder + "/posts/" + splitID[1] + "\"'>";
			} else {
	            html += "<li class='linked' onclick='javascript:document.location=\"https://www.facebook.com/" + fbFolder + "\"'>";
	        }
			
	        if (!fb.from.category) {
	            html += "<img style='float:left; margin-right:4px' src='https://graph.facebook.com/" + fb.from.id + "/picture' alt='' />";
	        }

	        if (fb.picture) {
	            html += "<img class='newsImage' src='" + fb.picture + "' alt='' />";
	        }

	        html += "<div class='newsText'>";
	        if (fb.created_time) {
	        	var startDate = new Date(formatFBTime(fb.created_time));
	            var startDateString = formatDate(startDate);
	            html += '<div class="postDate">Posted ' + startDateString + '</div>';
	        }
	        if (fb.name) {
				fbname = fb.name;
	            if (fb.name.indexOf(" ") == -1 && fb.name.length > 40) {
					if (fb.name.length < 80)
					{
						fbname = fb.name.substring(0,40) + '<br />' + fb.name.substring(41);
						
					} else {
						fbname = '';
					}
				}
				if (fbname.length > 0) {
					if (fb.link) {
						//html += "<div class='newsfeedTitle'><a href='javascript:document.location=\"" + fb.link + "\"'>" + fbname + "</a></div>";
						html += "<div class='newsfeedTitle'><a href='" + fb.link + "'>" + fbname + "</a></div>";
					} else {
						//html += "<div class='newsfeedTitle'><a href='javascript:document.location=\"https://www.facebook.com/" + fbFolder + "\"'>" + fbname + "</a></div>";
						html += "<div class='newsfeedTitle'><a href='https://www.facebook.com/" + fbFolder + "'>" + fbname + "</a></div>";
					}
				}
	        }
	        
	        if (fb.message) {
	            html += "<div >" + fb.message.substr(0,350);
	            if (fb.message.length > 351) {
	            	html += " <strong>more...</strong>";
	            }
	            html += "</div>";
	        }
			
	        if (fb.description || fb.caption) {
	        	html += "<div class='newsfeedDesc'>";
		        if (fb.caption) {
		            html += "<div><b>" + fb.caption.substr(0,500) + "</b></div>";
		        }
		        if (fb.description) {
		        	// redundant
		            //html += fb.description.replace(fb.name, "").substr(0,500);
		        }
		        html += "</div>";
		    }
	        // Comments
	        // Only summary of comments is displayed, just like facebook default, only 2 available unless you "read more" or "view all"... 
	        // the graph call for "view all comments" is get the post ID of that post and append "/comment"...
	        // example:
	        // FEED: https://graph.facebook.com/161439580553446/feed
	        // A POST FROM THE FEED: https://graph.facebook.com/161439580553446_177522428945161
	        // VIEW ALL COMMENTS: https://graph.facebook.com/161439580553446_177522428945161/comments

	        

	        // COMMENTS
	        if (showComments) {
	            if (fb.comments) {
	            	//commentCount = 0;
	            	html += "<div class='comments'>";
	            	$.each(fb.comments, function (i, theComments) {
	            		if (i == "count") {
	                        if (theComments > 3) {
	                            html += "<a class='addComment' href='https://www.facebook.com/" + fbFolder + "/posts/" + splitID[1] + "'>View all " + theComments + " comments / Add comment</a><br />";
	                        } else {
	                            html += "<a class='addComment' href='https://www.facebook.com/" + fbFolder + "/posts/" + splitID[1] + "'>Add comment</a><br />";
	                        }
	                    }
	            		
	            	});
	            	html += "</div>"; // end .newsText
	        		html += '<div style="clear:both"></div>';

	                $.each(fb.comments, function (i, theComments) {

	                    if (i == "data") {
	                        $.each(theComments, function (i, data) {

	                            data.message = data.message.replace(new RegExp("\\n", "g"),"<br />");

	                            var URLregex = new RegExp();
								URLregex.compile("(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))","g");
								 
								data.message = data.message.replace(URLregex, ' <a href="$2" target="_blank">view link</a> ');

								//var DOMAINregex = new RegExp();
								//DOMAINregex.compile(">https?://(?:www\.)?([^/]+)","g");
								//data.message = data.message.replace(DOMAINregex, '>Visit link on $1');

	                            html += "<div class='comment'><img class='commentImage' src='https://graph.facebook.com/" + data.from.id + "/picture' alt='' />";
	                            html += data.message + "<br />";
	                            if (data.created_time) {
	                                var startDate = new Date(formatFBTime(data.created_time));
	                                //var startDateString = days[startDate.getDay()] + ' at ' + showTheHours(startDate.getHours()) + ':' + showZeroFilled(startDate.getMinutes()) + ' ' + showAmPm(startDate);
	                                html += '<span class="commentDate">Posted ' + formatDate(startDate) + '</span><br />';
	                            }

	                            html += "</div><div style='clear:both'></div>";
	                        });
	                    }
	                    
	                });
					html += "</div>";
	            } else {
	            	html += "</div>"; // end .newsText
	        		html += '<div style="clear:both"></div>';
	                html += "<a class='addComment' href='https://www.facebook.com/" + fbFolder + "/posts/" + splitID[1] + "'>Add comment</a><br />";
	            }
	        }

	        //	                            if (fb.properties.name) {
	        //	                                    html += fb.properties.name + "<br />";
	        //                              }

	        //	                                if (fb.updated_time) {
	        //	                                    var offset = new Date(fb.updated_time);
	        //	                                    //var offset = curdate.getTimeZoneOffset();
	        //	                                    var startDateString = days[offset.getDay()] + ' at ' + offset.getHours() + ':' + offset.getMinutes();
	        //	                                    //+ ", " + months[offset.getMonth()] + ' ' + offset.getDate() + ', ' + fourdigits(offset.getYear());
	        //	                                    html += 'Updated ' + startDateString + '</a><br />';
	        //	                                }



	        html += "<div style='clear:both'></div></li>";
	    });
	    html += "</ul>";


	    //Animate - Fuzzy text with IE8
	    //	                            $('.newsfeed').animate({ opacity: 0 }, 500, function () {

	    //	                                $('.newsfeed').html(html);

	    //	                            });

	    //	                            $('.newsfeed').animate({ opacity: 1 }, 500);

	    // Temp, no animation
		
	    //$('.newsfeed').html(html); // Overwrites
		$('.newsfeed').append(html);
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
 
	                