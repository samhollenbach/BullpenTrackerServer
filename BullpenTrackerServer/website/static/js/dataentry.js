

/*var datatype='jsonp'
var token = accessedtoken
var data = {}
$.post('targeturl', accessedtoken, success, datatype)
function success(response) {
// do something here
    set variables of pitchtypes for the for loop
}*/
    var PitchLoc = {};
$(document).ready(function() {




    var form = document.getElementById("form");
    var start = document.getElementById("start");
    var p_token = document.cookie.replace(/(?:(?:^|.*;\s*)p_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        document.getElementById('start').onclick = function newbullpen() {
        document.getElementById("form").style.display="block";
        var pentype = $('#pentype :selected').text();
        $.post(
            "/api/pitcher/bullpens",
            {team: "-1", type: pentype},
            function(data) {
                b_token = data.b_token;
                PitchLoc.btoken = b_token
            }
        );

    };


   // f.setAttribute('method',"post");
   // f.setAttribute('action',"submit.php");





    var tooltip = $( '<div id="tooltip">' ).appendTo( 'body' )[0];

    $( '.coords' ).each(function () {


        $( this ).
            click(function ( e ) {
                var pos = $( this ).position(),
                top = pos.top,
                left = pos.left,
                width = $( this ).width(),
                height = $( this ).height();

                x = ( ( e.clientX - left ) / width ).toFixed( 2 ),
                y = ( ( height - ( e.clientY - top ) ) / height ).toFixed( 2 );
                PitchLoc.x = x;
                PitchLoc.y = y;
                if(x<=.13){
                    if(y<=.5){
                    block = 13
                    }
                    else if(y>.5){
                    block = 11
                    }
                }
                else if(x>=.14 && x<=.37){
                    if(y>=.63 && y<=.86){
                    block = 1
                    }
                    else if(y>=.38 && y<=.62){
                    block = 4
                    }
                    else if(y>=.14 && y<=.37){
                    block = 7
                    }
                }
                else if(x>=.38 && x<=.61){
                    if(y>=.63 && y<=.86){
                    block = 2
                    }
                    else if(y>=.38 && y<=.62){
                    block = 5
                    }
                    else if(y>=.14 && y<=.37){
                    block = 8
                    }
                }
                else if(x>=.62 && x<=.85){
                    if(y>=.63 && y<=.86){
                    block = 3
                    }
                    else if(y>=.38 && y<=.62){
                    block = 6
                    }
                    else if(y>=.14 && y<=.37){
                    block = 9
                    }
                }
                else if(x>=.86){
                    if(y<=.5){
                    block = 14
                    }
                    else if(y>.5){
                    block = 12
                    }
                }
                if(y<=.13){
                    if(x<=.5){
                    block = 13
                    }
                    else if(x>.5){
                    block = 14
                    }
                }
                if(y>=.87){
                    if(x<=.5){
                    block = 11
                    }
                    else if(x>.5){
                    block = 12
                    }
                }
                PitchLoc.block=block;

                $( tooltip ).text( x + ', ' + y ).css({
                    left: e.clientX - 30,
                    top: e.clientY - 30
                }).show();
            }).
            mouseleave(function () {
                $( tooltip ).hide();
            });
    });

    document.getElementById('submitbutton').onclick = function() {
        var block = PitchLoc.block;
        var x = PitchLoc.x;
        var y = PitchLoc.y;
        var b_token = PitchLoc.btoken;
        var contact = document.getElementById('hard_contact');
        var pitchtype = document.getElementById('pitch_type')
        var pitch_type = pitchtype.options[pitchtype.selectedIndex].value;
        var vel = document.getElementById("vel").value;
    if (contact.checked){
        var hard_contact = 1;
    }else{
        var hard_contact = 0;
     }
        if(block >= 11){
            var strike = "N";
        }
        else{
            var strike = "Y";
        }
        var url = "/api/pitcher/bullpen/" + b_token;
        var data = {
            hard_contact: hard_contact,
            ball_strike: strike,
            pitchX: x,
            pitchY: y,
            pitch_type: pitch_type,
            velocity: vel,

        };
        $.post("/api/bullpen/" + b_token,{
            hard_contact: hard_contact,
            ball_strike: strike,
            pitchX: x,
            pitchY: y,
            pitch_type: pitch_type,
            velocity: vel,

        },function(data, status) {
                }
        );
        };
/*        $.ajax({
        type: "POST",
        url: "/api/pitcher/bullpens/" + b_token +"/",
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify({ data }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){alert(data);},
        failure: function(errMsg) {
            alert(errMsg);
        }
        });
        event.preventDefault();
    });*/

   // $.ajax({
   // type: "POST",
   // url: "/api/pitcher/bullpens/" + b_token +"/",
    // The key needs to match your method's input parameter (case-sensitive).
   // data: JSON.stringify({ data }),
   // contentType: "application/json; charset=utf-8",
   // dataType: "json",
   // success: function(data){alert(data);},
   // failure: function(errMsg) {
   //     alert(errMsg);
   // }
   // });

    function getX(xval){

    }
    function setX(xval){

    }

});

/*
Automate this process such that the pitches are personalized by the player
and on each keypress the correct pitch is gathered. To do this it would
require a call to the player data and have relevant pitches to access*/
