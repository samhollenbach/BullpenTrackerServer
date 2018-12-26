

/*var datatype='jsonp'
var token = accessedtoken
var data = {}
$.post('targeturl', accessedtoken, success, datatype)
function success(response) {
// do something here
    set variables of pitchtypes for the for loop
}*/
var PitchLoc = {};

var currentPitch = null;
var trackedPitches = [];

function redrawTrackedPitches(canvas){

    var ctx = canvas.getContext("2d");
    
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(trackedPitches.length==0){ return; }

    // redraw each stored line
    for(var i=0;i<trackedPitches.length;i++){
        ctx.beginPath();
        ctx.arc(trackedPitches[i].x, trackedPitches[i].y, 10, 50, Math.PI * 2, true);
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    }
}



$(document).ready(function() {

    var c = document.getElementById("szone-canvas");
    var lastBall;

    var form = document.getElementById("form");
    var start = document.getElementById("start");

    var p_token = document.cookie.replace(/(?:(?:^|.*;\s*)p_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");


    document.getElementById('start').onclick = function newbullpen() {
        document.getElementById("form").style.display="block";
        var pentype = $('#pentype :selected').text();

        if (typeof b_token == 'undefined'){
            $.post(
                "/api/pitcher/bullpens",
                {team: "-1", type: pentype},
                function(data) {
                    b_token = data.b_token;
                    PitchLoc.btoken = b_token
                    $("#session-input").show();
                    $("#start-session").hide();
                    var img = document.getElementById("strikezone");   
                    c.style.position = "absolute";
                    c.style.left = img.offsetLeft + "px";
                    c.style.top = img.offsetTop + "px";
                    c.style.width = img.width + "px";
                    c.style.height = img.height + "px";
                }
            );
        }
    };

    var tooltip = $( '<div id="tooltip">' ).appendTo( 'body' )[0];

    $( '.coords' ).each(function () {

        $( this ).click(function ( e ) {

            var image = document.getElementById('strikezone');
            var xPos = 0;
            var yPos = 0;
            while (image) {
                if (image.tagName == "IMG") {
                    // deal with browser quirks with body/window/document and page scroll
                    var xScroll = image.scrollLeft || document.documentElement.scrollLeft;
                    var yScroll = image.scrollTop || document.documentElement.scrollTop;
                    xPos += (image.offsetLeft - xScroll + image.clientLeft);
                    yPos += (image.offsetTop - yScroll + image.clientTop);
                } else {
                    // for all other non-BODY elements
                    xPos += (image.offsetLeft - image.scrollLeft + image.clientLeft);
                    yPos += (image.offsetTop - image.scrollTop + image.clientTop);
                }

                image = image.offsetParent;
            }

            var pos = $( this ).position(),
            top = yPos,
            left = xPos,
            width = $( this ).width(),
            height = $( this ).height();

            x = ( ( e.clientX - left ) / width );
            y = ( ( height - ( e.clientY - top ) ) / height );

            var limX = 0.36;
            var limY = 0.36;
            var desLimX = 1.0;
            var desLimY = 1.5;
            var tempX = x - 0.5;
            var tempY = y - 0.5;     
            tempX = (tempX / limX) * desLimX;
            tempY = (tempY / limY) * desLimY;
            PitchLoc.x = Math.round(tempX * 100) / 100;
            PitchLoc.y = Math.round(tempY * 100) / 100;
            $('#pitch-info').html("<p>Pitch Location: (" + PitchLoc.x + ", " + PitchLoc.y + ")</p>");

            redrawTrackedPitches(c);

            var ctx = c.getContext("2d");
            ctx.beginPath();
            ctx.arc(x * width, (1-y) * height, 10, 50, Math.PI * 2, true);
            ctx.strokeStyle = '#ff0000';
            ctx.fill();

            currentPitch = {'x': x * width, 'y': (1-y) * height};

            // block = 0
            // if(x<=.13){
            //     if(y<=.5){
            //         block = 13
            //     }
            //     else if(y>.5){
            //         block = 11
            //     }
            // }
            // else if(x>=.14 && x<=.37){
            //     if(y>=.63 && y<=.86){
            //         block = 1
            //     }
            //     else if(y>=.38 && y<=.62){
            //         block = 4
            //     }
            //     else if(y>=.14 && y<=.37){
            //         block = 7
            //     }
            // }
            // else if(x>=.38 && x<=.61){
            //     if(y>=.63 && y<=.86){
            //         block = 2
            //     }
            //     else if(y>=.38 && y<=.62){
            //         block = 5
            //     }
            //     else if(y>=.14 && y<=.37){
            //         block = 8
            //     }
            // }
            // else if(x>=.62 && x<=.85){
            //     if(y>=.63 && y<=.86){
            //         block = 3
            //     }
            //     else if(y>=.38 && y<=.62){
            //         block = 6
            //     }
            //     else if(y>=.14 && y<=.37){
            //         block = 9
            //     }
            // }
            // else if(x>=.86){
            //     if(y<=.5){
            //         block = 14
            //     }
            //     else if(y>.5){
            //         block = 12
            //     }
            // }
            // if(y<=.13){
            //     if(x<=.5){
            //         block = 13
            //     }
            //     else if(x>.5){
            //         block = 14
            //     }
            // }
            // if(y>=.87){
            //     if(x<=.5){
            //         block = 11
            //     }
            //     else if(x>.5){
            //         block = 12
            //     }
            // }

            //PitchLoc.block = block;

            $( tooltip ).text( x + ', ' + y ).css({
                left: e.clientX - 30,
                top: e.clientY - 30
            }).show();

        }).mouseleave(function () {
            $( tooltip ).hide();
        });
    });

    document.getElementById('submitbutton').onclick = function() {
        //var block = PitchLoc.block;
        var x = PitchLoc.x;
        var y = PitchLoc.y;
        PitchLoc.x = null;
        PitchLoc.y = null;

        var b_token = PitchLoc.btoken;
        var contact = document.getElementById('hard_contact');
        var pitchtype = document.getElementById('pitch_type')
        var pitch_type = pitchtype.options[pitchtype.selectedIndex].value;
        var vel = document.getElementById("vel").value;
        if (contact.checked) {
            var hard_contact = true;
        } else {
            var hard_contact = false;
        }
        if (vel == null || vel == ""){
            vel = 0.0;
        }

        // if(block >= 11){
        //     var strike = "B";
        // }
        // else{
        //     var strike = "S";
        // }

        var data = {
            hard_contact: hard_contact,
            ball_strike: strike,
            pitch_type: pitch_type,
            vel: vel,
        };

        if (x != null){
            data.pitchX = x;
        }
        if (y != null){
            data.pitchY = y;
        }

        $('#pitch-info').text("No Pitch Location Selected");

        $.post("/api/bullpen/" + b_token, data, function(data, status) {
            $("#input-status").text("Pitch Added: " + pitch_type + " / " + strike + " / " + vel + "mph");

            if (currentPitch != null) {
                trackedPitches.push(currentPitch);
            }
            redrawTrackedPitches(c);
        });

    };


});

