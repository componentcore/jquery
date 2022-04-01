// JQuery Gallery
// Author: Loren Heyns
// Company: DreamStudio.com
// Please send updates to http://DreamStudio.com/account/write/8
// This message must remain at top of script.
// Additional version at parks/template/js/blurbfeed.js

jQuery.url = function () { var segments = {}; var parsed = {}; var options = { url: window.location, strictMode: false, key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"], q: { name: "queryKey", parser: /(?:^|&)([^&=]*)=?([^&]*)/g }, parser: { strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/, loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/} }; var parseUri = function () { str = decodeURI(options.url); var m = options.parser[options.strictMode ? "strict" : "loose"].exec(str); var uri = {}; var i = 14; while (i--) { uri[options.key[i]] = m[i] || "" } uri[options.q.name] = {}; uri[options.key[12]].replace(options.q.parser, function ($0, $1, $2) { if ($1) { uri[options.q.name][$1] = $2 } }); return uri }; var key = function (key) { if (!parsed.length) { setUp() } if (key == "base") { if (parsed.port !== null && parsed.port !== "") { return parsed.protocol + "://" + parsed.host + ":" + parsed.port + "/" } else { return parsed.protocol + "://" + parsed.host + "/" } } return (parsed[key] === "") ? null : parsed[key] }; var param = function (item) { if (!parsed.length) { setUp() } return (parsed.queryKey[item] === null) ? null : parsed.queryKey[item] }; var setUp = function () { parsed = parseUri(); getSegments() }; var getSegments = function () { var p = parsed.path; segments = []; segments = parsed.path.length == 1 ? {} : (p.charAt(p.length - 1) == "/" ? p.substring(1, p.length - 1) : path = p.substring(1)).split("/") }; return { setMode: function (mode) { strictMode = mode == "strict" ? true : false; return this }, setUrl: function (newUri) { options.url = newUri === undefined ? window.location : newUri; setUp(); return this }, segment: function (pos) { if (!parsed.length) { setUp() } if (pos === undefined) { return segments.length } return (segments[pos] === "" || segments[pos] === undefined) ? null : segments[pos] }, attr: key, param: param} } ();

var hash = (function (a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.hash.substr(1).split('&'));

var jsonLink = '';
var host = '';
var galleryid; // Optional, a ManagementSuite ItemID.
//var thumbnail = '';
//var thumbContainer = '';
//var slideContainer = '';
var numberArrows = true;
var showPlayPause = false;
var initiallyPaused = false;
var showSlideNumbers = true;
var loadThumbnails = false;
var autoStart = true;
var ua = 0;
//var fixedHeight = 0;
var maxHeight = 350;
var recentMaxHeight = 0;
var galleryDataModified = new Array();
//var scrollTo; // Name or id of tag to slide to
var currentIndex = 0;
var currentSlide = 1;
var slideCount = 0;
var galleryJqxhr;

// Function: at_intervals 
// Author: Jacek Becela
// Website: http://github.com/ncr/at_intervals
// License: cc-by-sa
(function ($) {
    $.fn.at_intervals = function (fn, options) {
        var settings = $.extend({}, $.fn.at_intervals.defaults, options);

        return this.each(function () {
            var e = $(this)
            var name = settings.name
            var delay = settings.delay

            var helper = {
                should_stop: function () { // used to completely remove the interval
                    return !this.element_in_dom() || this.user_wants_to_stop()
                },
                should_work: function () { // used to pause/resume the interval
                    return this.element_visible() && !this.user_wants_to_pause()
                },
                user_wants_to_stop: function () {
                    return e.data(name).should_stop == true
                },
                user_wants_to_pause: function () {
                    return e.data(name).should_pause == true
                },
                element_in_dom: function () {
                    return e.parents("html").length > 0
                },
                element_visible: function () {
                    return e.parents("*").andSelf().not(":visible").length == 0
                },
                stop: function (interval_id) {
                    clearInterval(interval_id)
                    e.removeData(name)
                }
            }

            if (e.data(name)) {
                helper.stop(e.data(name).interval_id) // remove previous executer
            }

            e.data(name, { delay: delay }) // initialize data cache

            if (helper.should_work()) {
                fn() // call fn immediately (setInterval applies the delay before calling fn for the first time)
            }

            var interval_id = setInterval(function () {
                if (helper.should_stop()) {
                    helper.stop(interval_id)
                } else {
                    if (helper.should_work()) {
                        fn()
                    }
                }
            }, delay)

            e.data(name).interval_id = interval_id
        })
    };

    $.fn.at_intervals.defaults = {
        name: "at_intervals",
        delay: 1000 // one second
    }
})(jQuery);

function loadGallery() {
	var thumbContainer = '';
    jsonLink = jsonLink.replace("&amp;", "&");
	galleryJqxhr = $.getJSON(jsonLink, function (data) {
		var thumbnail = '';
	    // top do: Simplify - look at Facebook reader posts.js
	    var parentTitle = '';
	    if (data.parentTitle) {
	        $.each(data.parentTitle, function (i, id) {
	            if (id.id) {
	                parentTitle = id.id;
	            }
	        });
	    }
	    // top do: Simplify, look at Facebook reader
	    var parentLink = '';
	    if (data.parentLink) {
	        $.each(data.parentLink, function (i, id) {
	            if (id.id) {
	                parentLink = id.id;
	            }
	        });
	    }

	    $('<div class="parentTitle"><a href="' + parentLink + '">' + parentTitle + '</a></div>').prependTo('#gallery-container');

	    if (data.parentLink) {
	        // top do: Simplify, look at Facebook reader
	        $.each(data.ua, function (i, id) {
	            if (id.id) {
	                ua = id.id;
	            }
	        });
	    }
	    galleryDataModified.length = 0; // Clear the array for reload
	    $.each(data.results, function (i, id) {
	        galleryDataModified.push(id);
	    });

	    // Then combine and/or sort galleryDataModified - to be implimented, sort sample in core/event/calendar.aspx.
	    //galleryDataModified.sort(sortMyObjects);
	    $('#thumb-holder').html('');
	    $('#slide-numbers').html('');
	    slideCount = 0;

	    var navNumber = '<div onclick="previousSlide();return;"><img src="/core/img/arrows/black-back-sm.gif" /></div>';
	    if (numberArrows && galleryDataModified.length > 1) {
	        $(navNumber).appendTo('#slide-numbers');
	    }
	    $.each(galleryDataModified, function (index, id) {
	        slideCount++;
	        if (id.imageSmall) {
	            thumbnail = host + id.imageSmall;
	        } else if (id.thumbnail) {
	            thumbnail = host + id.thumbnail;
	        }
	        if (id.imageLarge) {
	            photoUrlLarge = host + id.imageLarge;
	        } else {
	            photoUrlLarge = host + id.image;
	        }
	        // Useful for other sites: $(\'#slide-numbers a\').removeClass(\'activeNav\');$(this).addClass(\'activeNav\');
	        if (galleryDataModified.length > 1) {
	            navNumber = '<a href="#go=' + (index + 1) + '" id="nav' + index + '" onclick="pauseShow();goHide(' + (index + 1) + ')">' + (index + 1) + '</a>';
	            $(navNumber).appendTo('#slide-numbers');
	        }
	        if (loadThumbnails) {
                // scrollTo(\'#gallery-container\') // Removed for lodges
	            thumbContainer = '<div class="thumb-container" onclick="goIndex(' + index + ');"><div class="thumb-mask"><img class="thumb-class" src="' + thumbnail + '" alt="" /></div>';
	            if (id.title) thumbContainer += '<div class="thumb-text">' + id.title + '</div>';
	            thumbContainer += '</div>';
	            $(thumbContainer).appendTo('#thumb-holder');
	        }
	    });
	    //alert('slideCount ' + slideCount);
	    if (slideCount > 1) {
	        $("#pauseResume").show();
	    }
	    if (numberArrows) {
	        navNumber = '<div onclick="nextSlide();"><img src="/core/img/arrows/black-next-sm.gif" /></div>';
	        $(navNumber).appendTo('#slide-numbers');
	    }
	    if (showPlayPause) {
	        //var playPauseButton = '<div id="resume" class="textbutton playPauseButtons" style="display:none;height:20px;position:relative;"><img src="/core/img/icons/play160.jpg" width="16" alt="resume" style="position:absolute" /> &nbsp; &nbsp; &nbsp; &nbsp;start rotation</div><div id="pause" class="textbutton playPauseButtons" style="display:block;height:20px;padding-bottom:1px"><img style="position:absolute" src="/core/img/icons/pause160.jpg" width="16" alt="pause" /> <span style="float:left;padding-bottom:3px">&nbsp; &nbsp; &nbsp; &nbsp;pause rotation</span></div>';
	        //$(playPauseButton).appendTo('#playPause');
	        // /core/img/icons/pause22.jpg play22.jpg
	        var playPause = '<div id="resume" style="display:none;position:relative;">&nbsp;</div><div id="pause">&nbsp;</div>';
            if(initiallyPaused) {
                playPause = '<div id="resume">&nbsp;</div><div id="pause" style="display:none;position:relative;">&nbsp;</div>';
            }
	        $(playPause).appendTo('#pauseResume');
	    }
	    //alert('got data');

	    // ROTATION USING at_intervals
	    $("#pause").click(function () {
			$('#content-holder').show(); // Resides in GP MasterPage, GlP Default.
			$('#showContent').hide(); // Resides in GP MasterPage, GlP Default.
	        pauseShow();
	        return false;
	    });

	    $("#resume").click(function () {
	        $("#widget").data("feature_rotate").should_pause = false;
			//$('#content-holder').hide(); // Resides in GP MasterPage, GlP Default.
			$('#showContent').show(); // Resides in GP MasterPage, GlP Default.
	        $('#resume').hide();
	        $('#pause').show();
            //$('.hideShow').hide();
            $('#galleryPosition').insertAfter($('#insertHeaderGallery'));
            $('#slideshow-holder').css({ 'height': '' }); // Clear to force height reset.
            
            // Wasn't needed, fixedHeight is only acted on when 0.
            //fixedHeight == $('.slide-image').height(); // Force to use the new height, rather than height of previous slide. Setting to 0 gets overwritten.
            
            //$('#slideshow-holder').css({ 'min-height': '' });
            //$('#slideshow-holder').css({ 'min-height': $('.slide-image').height() });
            //alert('Reset slideshow-holder ' + $('#slideshow-holder').height());
            //resetHeight();
	        return false;
	    });
	});
}
function previousSlide() {
    //alert('previousSlide');
    $("#widget").data("feature_rotate").should_pause = true;
    $('#resume').hide();
    $('#pause').show();

    if (currentIndex == 0) {
        goIndex(slideCount - 1);
    } else {
        goIndex(currentIndex - 1);
    }
    //alert('previousSlideDone');
}
function nextSlide() {
    if (currentIndex == (slideCount - 1)) {
        goSlide(1);
    } else {
        goSlide(currentIndex + 2);
    }
}
function goIndex(number) {
    //$('.hideShow').hide(); // Hides header fade GP.
	//$('#content-holder').hide(); // Resides in GP MasterPage.
    $('#showContent').show(); // Resides in GP MasterPage. Needed when clicking thumbnail. Could be moved to thumbnail click event.
	// Keep visible for lodges
    //$('#thumb-holder-container').hide(); // Resides in GP MasterPage and Locaton/Gallery/ImageGallery.aspx.
    showImage(number);
}

function initiateSlideshow() {
    var number = 1;
    if (hash["go"] > 0) { number = hash["go"] };
    //goSlide(number);

    var tickspeed = 2000 //ticker speed in miliseconds (2000=2 seconds)

    currentIndex = -1; // Allows nextSlide to start with 1st image.
    //alert('JQuery/gallery/slideshow-1.1.js line 180');
    $("#widget").at_intervals(function () {
        nextSlide();
    }, { name: "feature_rotate", delay: 5000 });

    if (autoStart == false) {
        //$("#widget").data("feature_rotate").should_pause = true;
        //pauseShow();
    }
}
function pauseShow() {
	$("#widget").data("feature_rotate").should_pause = true;
    $('#pause').hide();
    $('#resume').show();
}

// Added because IE was hiding info below gallery
//function stopShow() {
//    $("#widget").data("feature_rotate").should_stop = true;
//    $('#pause').hide();
//    $('#resume').hide();
//}

function goHide(number) {
	$('#content-holder').hide(); // Resides in GP MasterPage, GlP Default.
    $('#showContent').show(); // Resides in GP MasterPage, GlP Default.
	goSlide(number);
}
function goSlide(number) {
    resetHeight();
    
    var featureCount = $('.featureMenu li').size();
    for (var i = 1; i <= featureCount; ++i) {
        if (i == number) {

        } else {
            $('#featureLink' + i).addClass('inactive');
            $('#featureText' + i).hide();
        }
    }

    //$('.featureMenu li').css('background', 'url(\'/core/img/dots/333-60.png\')');
    //$('.featureMenu a').removeClass('active');

    // Bug - this prevents area from dropping hover color
    //$('#featureNav' + number + ':hover').css('background', 'url(\'/core/img/dots/333-60.png\')'); // Cover blue

    // Bug - This prevents making previous ones inactive
    //$('#featureNav' + number).css('background', 'url(\'/core/img/dots/333-60.png\')'); // Cover blue hover
    
    // Didn't work (on LI)
    //$('#featureNav' + number).addClass('active'); // Bug this is too dark.  But can't do two actions on li or a.

    $('#featureLink' + number).removeClass('inactive').addClass('active');
    $('#featureText' + number).show();
    showImage(number-1);
}
function resetHeight() {
    // Set the min-height so area does not jump while next slide loads.
    var minHeight = 400;
    if ($('#slideshow-holder').height() > 0) {
        minHeight = $('#slideshow-holder').height();
        //alert('reset minHeight to ' + minHeight);
    }

    if ($('.slide-image').height() > recentMaxHeight && $('.slide-image').height() < maxHeight) {
        // Prevents jumping of height and arrow positions.
        recentMaxHeight = $('.slide-image').height() 
        $('#slideshow-holder').css({ 'min-height': recentMaxHeight + 'px' });

        //if ($('.slide-image').height() > 0 && fixedHeight == 0) {
        //fixedHeight = $('#slideshow-holder').height();
        //alert('reset fixedHeight to ' + fixedHeight);
        // These differ in height by 10 so slideshow-holder is used to prevent initial jump.
        //alert('.slide-image ' + $('.slide-image').height());
        //alert('#slideshow-holder ' + $('#slideshow-holder').height());
        // Prevents text under slideshow from jumping up and down.
        //$('#slideshow-holder').css({ 'height': fixedHeight + 'px' }); // Retain the height of the previous slide
        $('#slideshow-holder').css({ 'height': recentMaxHeight + 'px' }); // Retain the height of the previous slide
    
    }
}
function testFade() {
    var fade = $('.slide-next');
    // if the element is currently being animated (to a fadeOut)...
    if (fade.is(':animated')) {
        // ...take it's current opacity back up to 1
        fade.stop().fadeTo(850, 1);
    } else {
        // fade in quickly
        fade.fadeIn(850);
    }
}
function showImage(index) {

    galleryJqxhr.success(function () {

        if ((index == currentIndex + 1 || (index == 0 && currentSlide == slideCount)) && currentIndex != -1) {
            var fade = $('.slide-next');
            // if the element is currently being animated (to a fadeOut)...
            if (fade.is(':animated')) {
                // ...take it's current opacity back up to 1
                fade.stop().fadeTo(850, 1);
            } else {
                //alert('fade');
                // fade in quickly
                changeNumber(index);
                fade.fadeIn(850);
                setTimeout(function () { loadNext(index); }, 850);
            }
        } else {
            changeNumber(index);
            loadNext(index);
        }
    });
	//galleryJqxhr.error(function () { alert("Unable to load JSON feed."); });
}
function changeNumber(index) {
    $('#slide-numbers a').removeClass('activeNav');
    $('#nav' + index).addClass('activeNav');
    $('#featureNav' + index + 1).addClass('active'); // GLaw
    if (showSlideNumbers) {
        $('#slide-numbers').show();
    }
    $('#slide-number-holder').show();
}
function loadNext(index) {
	var slideContainer = '';
    //showImageReady(index, 1);
    //return;

    //setInterval(showImageReady(index, 1), 0); // No delay
    //setInterval(showImageReady(index, 2), 100); // Checks 10 times a second.

    //alert('showImage ' + index);
    //window.location.hash = 'slide=' + (index + 1);

	// This causes thumb gallery to disappear if image rotation has started when gallery icon is clicked.
    //$('#thumb-holder').attr('style', 'z-index:1');
    currentIndex = index;
    var indexNext = index + 1;
    if (indexNext >= slideCount) indexNext = 0;

    currentSlide = index + 1;
    if (currentSlide > slideCount) currentSlide = 1;


    $('#slideshow-holder').show();
    //alert('slideCount ' + slideCount);
    //if (galleryDataModified.length == 0) alert('No data found, or a delay has occured during processing.');

    slideContainer = '<div class="slide-text">';
    if (galleryDataModified[index].title) slideContainer += '<div class="slide-title">' + galleryDataModified[index].title + '</div>';
    if (ua >= 6) {
        if (galleryDataModified[index].id > 0) {
            // s=' + galleryDataModified[index].id + '&
            slideContainer += '<a href="/net/content/upload.aspx?imageid=' + galleryDataModified[index].id + '&parentid=' + galleryid + '"><img src="/core/img/arrows/dot-pointer-on-white.gif" alt="" /> Edit Image</a><br />';
            slideContainer += '<a href="/net/content/categoryedit.aspx?itemid=' + galleryDataModified[index].id + '"><img src="/core/img/arrows/dot-pointer-on-white.gif" alt="" /> Edit Categories</a><br />';
            // To do: Parse the s value
            // &s=' + $.url.param("s") + '
            slideContainer += '<a href="/net/content/upload.aspx?popup=0&siteid=' + $.url.param("siteid") + '&parentid=' + galleryid + '"><img src="/core/img/arrows/dot-pointer-on-white.gif" alt="" /> Add Image</a><br />';
        }
        if (galleryDataModified[index].typeID != 98000 && galleryDataModified[index].typeID != $.url.param("tid")) {
            slideContainer += '<a href="<%=SetLink("/location/gallery/imagegallery.aspx?1=2")%>&tid=' + galleryDataModified[index].typeID + '"><img src="/core/img/arrows/dot-pointer-on-white.gif" alt="" /> ' + galleryDataModified[index].typeTitlePlural + ' at all Parks</a><br />';
        }
    }
    slideContainer += '</div>';
    slideContainer += '<div class="slide-class"><img onload="setRatio(this.height);" class="slide-image" src="' + host + galleryDataModified[index].imageLarge + '" alt="" /><div class="slide-next"><img class="slide-image" src="' + host + galleryDataModified[indexNext].imageLarge + '" alt="" /></div></div>';

    slideContainer += '</div>';

    $('#slide-container').html(slideContainer);
    //$('#slide-container').html(slideContainer).fadeIn("slow"); // No effect, could try one div in front of another

    // Not only when the DOM is ready, but when the images have finished loading,
    // BUGBUG - but this only works on initial load.
    $(window).bind('load', function () {
        // run the cross fade plugin against selector
        //$('img.fade').crossfade();
        //alert('done');
    });
    $('.slide-next').hide();
    $('.slide-nav-button').show();
    //alert('Done: ' + index);
}
function setRatio(thisHeight) {
    // Clear min-height to remove gap below slides as browser is resized.
    $('#slideshow-holder').css({ 'min-height': '' });
}
function showImageReady(index, attempts) {
    if (attempts > 10000) {
        alert('attempts: ' + attempts + ' galleryDataModified.length: ' + galleryDataModified.length);
        return;
    }
    if (galleryDataModified.length == 0) {
        //alert('Loading images' + attempts);
        setInterval(showImageReady(index, attempts + 1), 50); // Checks 5 times a second.
        return;
    }
    alert('attempts: ' + attempts + ' galleryDataModified.length: ' + galleryDataModified.length);
 
}
function hideImage() {
    $('#slideshow-holder').hide();
    $('#slide-numbers').hide();
}

//if (scrollTo) {
function scrollTo(target) {
    //get the top offset of the target anchor
    //var target_offset = $("#gallery-container").offset();
    var target_offset = $(target).offset();
    var target_top = target_offset.top;

    //goto that anchor by setting the body scroll top to anchor top
    $('html, body').animate({ scrollTop: target_top }, 500);
}

