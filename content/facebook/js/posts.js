// JQuery Embed for Facebook
// Author: Loren Heyns
// Company: DreamStudio.com
// Please send updates to http://DreamStudio.com/account/write/8
// This message must remain at top of script.

var fbFolder = '';
var fbLimit = 3;
var showComments = true;
var commentQuantity = 8;
var fbOffset = 0;
var includePublicFeed; // not initialized, assume false
var fbShowControls = false;
var fbAdminID = ''; // Used as a CSS class name to show/hide public posts
var fbToken;
var nextfeedurl = '';
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  this.splice(from, (to || from || 1) + (from < 0 ? this.length : 0));
  return this.length;
};
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
                    fbToken = response.session.access_token;
                    fbFetch(response.session.access_token);
                }
            });

        } else {
            alert('Not logged into Facebook.  Unable to show latest news.');
        }
    });
}
function formatDateTicks(startDate,endDate) {
    var startdate = new Date(startDate);
    var enddate = new Date(endDate);
    return formatDate(startdate) + ' to ' + ' <span style="white-space:nowrap">' + showTheHours(enddate.getHours()) + ':' + showZeroFilled(enddate.getMinutes()) + ' ' + showAmPm(enddate) + '</span>';
}
function formatDate(startDate) {
    var days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    var dateStr = days[startDate.getDay()];
    dateStr += ', ' + months[startDate.getMonth()] + ' ' + startDate.getDate() + ', ' + fourdigits(startDate.getYear());
    dateStr += ', <span style="white-space:nowrap">' + showTheHours(startDate.getHours()) + ':' + showZeroFilled(startDate.getMinutes()) + ' ' + showAmPm(startDate) + '</span>';
    return dateStr;
}


function encode(unencoded) {
    return encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");
}
function decode(encoded) {
    return decodeURIComponent(encoded.replace(/\+/g,  " "));
}
function fbFetch() {
    // Callback is set with a '?' to overcome the cross domain problems with JSON

    // You can also request multiple objects in a single query using the "ids" query parameter.
    // For example, the URL https://graph.facebook.com?ids=arjun,vernal returns both profiles in the same response.
    // since=today&
    // Switch from /posts to /feed to show everyone

    var endpoint = includePublicFeed ? "feed" : "posts";
    

    var url = '';
    if (nextfeedurl == '') {
        url = "https://graph.facebook.com/" + fbFolder + "/" + endpoint + "?access_token=" + fbToken + "&fields=from,picture,link,created_time,name,message,caption,story,comments{message,from,created_time}&limit=" + fbLimit + "&callback=?";
    } else {
        url = nextfeedurl + "&callback=?";
    }
    
    if (typeof (console) != 'undefined' && typeof (console.log) != 'undefined') {
        console.log('Facebook feed query:', url);
    }
    
    //Use jQuery getJSON method to fetch the data from the url and then create our unordered list with the relevant data.
    $.getJSON(url, function (json) {
        var html = "";

        if (typeof (json.error) != 'undefined') {
            if (typeof (console) != 'undefined' && typeof (console.error) != 'undefined') {
                console.error('Facebook returned an error: ', json.error);
            }
            $('div[id*="FacebookPanel"]').hide();
            return;
        }

        html += "<ul>";
        var commentCount = 0;

        // These aren't working...
        if (!showComments) {
            // Wrap newsText under thumbnail.  Allows for irregualar thumbnail widths, which look odd when comments don't separate.
            $('.newsText').attr('style', 'overflow: visible;');
        }
        if (showComments) {
            $('.newsText').attr('style', 'overflow:hidden;');
        }
        if(typeof json.paging != 'undefined' && typeof json.paging.next != 'undefined') {
            nextfeedurl = json.paging.next;
        }

        //loop through and within data array's retrieve the message variable.
        $.each(json.data, function (i, fb) {
            // console.log('i=> ' + i)
            // console.log('fb=> ' + JSON.stringify(fb))
            var splitID = [];

            // id broke
            //html += "<li class='linked fbRow fbRowCollapsed fbRowHover " + fb.from.id + "'" + (!includePublicFeed && fbAdminID != '' && fb.from.id != fbAdminID  ? "style='display: none;'" : "") + ">";
            html += "<li class='linked fbRow fbRowCollapsed fbRowHover'" + (!includePublicFeed && fbAdminID != '' && fb.from.id != fbAdminID  ? "style='display: none;'" : "") + ">";

            // No longer effect when clicking
            html += "<div class='fbClose fbExpanded' style='float:right'><img style='width:15px;height:8px; margin-left:3px; opacity: 0.5; filter: alpha(opacity=50);' src='/core/img/arrows/olive-down.gif' alt='less' /></div>";

            // No longer effect when clicking
            html += "<div class='fbOpen fbCondensed' style='float:right'><img style='width:10px;height:10px' src='/core/img/arrows/next-sm.gif' alt='more' /></div>";
            
            if (fb.link) {

                html += "<a href='" + fb.link + "' target='_blank'><img class='newsImage newsImageSm fbCondensed' src='" + fb.picture + "' alt='' /></a>";

                html += "<a href='" + fb.link + "' target='_blank'><img class='newsImage fbExpanded' src='" + fb.picture + "' alt='' /></a>";
            }

            // BESIDE IMAGE
            html += "<div style='overflow:auto;margin-bottom:15px'>";
                html += "<div class='newsText'>";
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
                            html += "<div class='newsfeedTitle'><a href='" + fb.link + "' target='_blank'>" + fbname + "</a></div>";
                        } else {
                            html += "<div class='newsfeedTitle'><a href='https://www.facebook.com/" + fbFolder + "' target='_blank'>" + fbname + "</a></div>";
                        }
                    }
                } else {
                    html += "<div class='newsfeedTitle'><a href='https://www.facebook.com/" + fbFolder + "/posts/" + fb.id.split("_")[1] + "' target='_blank'>View Details</a></div>";
                }

                if (fb.created_time) {
                    var startDate = new Date(formatFBTime(fb.created_time));
                    var startDateString = formatDate(startDate);
                    //var author = " by <a href='https://www.facebook.com/" + fb.from.id + "' target='_blank'>" + fb.from.name + "</a>";
                    var author = "";
                    html += '<div class="postDate fbExpanded">Posted ' + startDateString + author + '</div>';
                }
                
                if (fb.message) {
                    html += "<div class='newsfeedTitle'>" + fb.message.substr(0,350);
                    if (fb.message.length > 351) {
                        html += " <strong>more...</strong>";
                    }
                    html += "</div>";
                }

                if (fb.description || fb.caption || fb.story ) {
                    
                     if (fb.type == 'event') {
                        console.log("fb.story" + fb.story);
                        ev_id_array = fb.link.split('/')
                        ev_id = ev_id_array[ev_id_array.length - 2]
                        
                        
                        var ev_url = 'https://graph.facebook.com/' + ev_id + '?method=GET&format=json&suppress_http_code=1&access_token=' + fbToken;
                        
                        $.getJSON(ev_url, function(ev_json) {
                            html += "<div class='newsfeedTitle'><a href='" + fb.link + "' target='_blank'>" + ev_json.name + "</a></div>";
                            if (ev_json.location) {
                                html += '<b>Where:</b> ' + ev_json.location + '<br />';
                            }
                            html += '<b>When:</b> ' + formatDateTicks(ev_json.start_time, ev_json.end_time) + '<br />';
                            
                            console.log('Event Title : ' + ev_json.name)
                        });
                        
                    }
                    if (fb.caption && fb.caption.length > 250) {
                        html += "<div class='newsfeedDesc'>";
                    } else {
                        html += "<div class='newsfeedDesc' style='overflow:hidden'>";
                    }
                    if (fb.caption) {
                        html += fb.caption.substr(0,500);
                    }
                    if (fb.description) {
                        if (fb.caption) {
                            html += " - ";
                        }
                        html += fb.description.replace(fb.name, "").substr(0,500);
                    } else if (fb.story) {
                        
                        if (fb.caption) {
                            html += " - ";
                        }
                        
                        html += fb.story.replace(fb.name, "").substr(0,500);
                    }
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
                        if (fb.comments) {
                            if(fb.comments.data.length > 3) {
                                html += "<a class='addComment commentIcon' href='https://www.facebook.com/" + fbFolder + "/posts/" + fb.id.split("_")[1] + "' target='_blank'>View all " + fb.comments.data.length + " comments / Add comment</a><br />";
                            } else {
                                html += "<a class='addComment commentIcon' href='https://www.facebook.com/" + fbFolder + "/posts/" + fb.id.split("_")[1] + "' target='_blank'>Add comment</a> | <a class='addComment' href='https://www.facebook.com/" + fbFolder + "/posts/" + fb.id.split("_")[1] + "' target='_blank'>View post</a><br />";
                            }
                        }
                        
                        html += "</div>"; // end .newsText
                        html += '<div style="height:10px"></div>';

                        $.each(fb.comments, function (i, theComments) {

                            if (i == "data") {
                                $.each(theComments, function (i, data) {
                                    
                                    if(i >= commentQuantity) {
                                        return;
                                    }

                                    data.message = data.message.replace(new RegExp("\\n", "g"),"<br />");

                                    var URLregex = new RegExp();
                                    URLregex.compile("(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))","g");
                                     
                                    data.message = data.message.replace(URLregex, ' <a href="$2" target="_blank">view link</a> ');

                                    //var DOMAINregex = new RegExp();
                                    //DOMAINregex.compile(">https?://(?:www\.)?([^/]+)","g");
                                    //data.message = data.message.replace(DOMAINregex, '>Visit link on $1');

                                    
                                    html += "<div class='comment'>";

                                    // id stopped working
                                    //html += "<img class='commentImage' src='https://graph.facebook.com/" + data.from.id + "/picture' alt='' />";
                                    html += data.message + "<br />";
                                    if (data.created_time) {
                                        var startDate = new Date(formatFBTime(data.created_time));
                                        //var startDateString = days[startDate.getDay()] + ' at ' + showTheHours(startDate.getHours()) + ':' + showZeroFilled(startDate.getMinutes()) + ' ' + showAmPm(startDate);
                                        html += '<span class="commentDate">Posted ' + formatDate(startDate) + '</span><br />';
                                    }

                                    html += "</div>";
                                    //html += "<div style='clear:both'></div>";
                                });
                            }
                            
                        });
                        html += "</div>";
                        commentCount = 0;
                    } else {
                        html += "</div>"; // end .newsText
                        //html += '<div style="clear:both"></div>';
                        html += "<a class='addComment commentIcon' href='https://www.facebook.com/" + fbFolder + "/posts/" + fb.id.split("_")[1] + "' target='_blank'>Add comment</a><br />";
                    }
                }

            
            html += "</div>";
            // END BESIDE IMAGE

            //html += "<div style='clear:both'></div>";
            html += "</li>";

            html += "</div>";
        });
        html += "</ul>";
        
        $('.newsfeed').append(html);

        if (typeof (processFacebookPosts) == "function") {
            processFacebookPosts($('.newsfeed')); // optional - perform any custom processing such as analytics tracking
        }

        if (fbShowControls && fbAdminID != '') {
            if ($("li", $(".newsfeed")).not("." + fbAdminID).length > 0) {
                // found public posts in feed results
                if (includePublicFeed) {
                    $('.fbShowPublicPosts').hide();
                    $('.fbHidePublicPosts').show();
                }
                else {
                    $('.fbShowPublicPosts').show();
                    $('.fbHidePublicPosts').hide();
                }
            }
        }
    
    }); // end getJSON

} // end fbFetch


function fbInit() {

    var html = [];
    var i = 0;
    var fb_includePublicFeed = "false";
    var $newsfeed = $('.newsfeed');

    if (fbShowControls) {

        fb_includePublicFeed = BrowserUtil.getCookie('fb_includePublicFeed');
        if (typeof fb_includePublicFeed != "undefined" && fb_includePublicFeed != "") {
            if (includePublicFeed === false) { // set to false, delete the cookie if found
                BrowserUtil.deleteCookie('fb_includePublicFeed');
            }
            else {
                // use cookie value to override the current value (true or undefined)
                includePublicFeed = fb_includePublicFeed == "true" ? true : false;
            }
        }

        html[i++] = "<div class='newsfeedControls'>";
        html[i++] = "<div id='loadMoreFbFeeds' class='button button-grey button-sm' style='margin:10px 0px 0px 0px'>More Posts</div>"; // Todo: adjust 10 More - may not always be 10
        // Hide buttons until the feed is loaded
        html[i++] = "<div class='fbShowPublicPosts button button-grey button-sm' style='display:none; float:left; margin:10px 10px 0px 0px'>Show Public Posts</div>";
        html[i++] = "<div class='fbHidePublicPosts button button-grey button-sm' style='display:none; float:left; margin:10px 10px 0px 0px'>Hide Public Posts</div>";
        html[i++] = "</div><div style='clearX:both;margin-bottom:18px'></div>"; // end newsfeedControls

        $newsfeed.after(html.join(''));

        $("#loadMoreFbFeeds").click(function () {
            fbLimit = 10; // Corresponds to the "10 More" button
            fbOffset = fbLimit + fbOffset;
            fbFetch();
        });
        $(".fbShowPublicPosts").click(function () {
            includePublicFeed = true;
            BrowserUtil.setCookie('fb_includePublicFeed', true, 3650);
            $("li", $newsfeed).not("." + fbAdminID).show();
            $(".fbShowPublicPosts").hide();
            $(".fbHidePublicPosts").show();
        });
        $(".fbHidePublicPosts").click(function () {
            includePublicFeed = false;
            BrowserUtil.setCookie('fb_includePublicFeed', false, 3650);
            $("li", $newsfeed).not("." + fbAdminID).hide();
            $(".fbHidePublicPosts").hide();
            $(".fbShowPublicPosts").show();
        });

    }

    if (typeof(includePublicFeed) == 'undefined') {  // Not intialized
        includePublicFeed = false;
    }

} // end fbInit

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


function formatFBTimestamp(unix_tm) {
    // For Explorer 8 and Firefox 3
    var dt = new Date(unix_tm*1000);
    
    var valid_date = new Date()
    valid_date.setUTCFullYear(dt.getFullYear());
    valid_date.setUTCMonth(dt.getMonth());
    valid_date.setUTCDate(dt.getDate());
    valid_date.setUTCHours(dt.getHours());
    valid_date.setUTCMinutes(dt.getMinutes());
    valid_date.setUTCSeconds(dt.getSeconds());
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

$(document).ready(function () {
    $(document).on('click', '.fbDetails', function (e) {
        $('.fbExpanded').show();
        $('.fbCondensed').hide();
        $('.fbRow.fbRowCollapsed').toggleClass('fbRowCollapsed fbRowExpanded'); // toggle row from collapsed to expanded
        $('.fbDetails').hide();
        $('.fbShrink').show();
        e.preventDefault();
    });
    $(document).on('click', '.fbShrink', function (e) {
        $('.fbExpanded').hide();
        $('.fbCondensed').show();
        $('.fbRow.fbRowCollapsed').toggleClass('fbRowCollapsed fbRowExpanded'); // toggle row from collapsed to expanded
        $('.fbShrink').hide();
        $('.fbDetails').show();
        e.preventDefault();
    });

    $('.newsfeed').click(function (event) {


        if (event.isDefaultPrevented()) {
            return false; // click hander called again due to event bubbling. If already handled, just return.
        }

        var $eventTarget = $(event.target);

        if ($eventTarget.is("a")) {
            return true; // follow the url
        }

        var $parent = $eventTarget.closest('.fbRow');
        if ($parent.length > 0) {
            
            if (!$parent.hasClass('fbRowCollapsed')) {
                $('.fbExpanded', $parent).hide();
                $('.fbCondensed', $parent).show();
                $parent.toggleClass('fbRowCollapsed fbRowExpanded'); // toggle row from expanded to collapsed
                $parent.addClass('fbRowHover');
            } else {
                $('.fbExpanded', $parent).show();
                $('.fbCondensed', $parent).hide();
                $parent.toggleClass('fbRowCollapsed fbRowExpanded'); // toggle row from collapsed to expanded
                $parent.removeClass('fbRowHover');
            }
            event.preventDefault();
        }
    });
});

function goPage(page,e) {
    window.location=page;
    e.preventDefault();
}

