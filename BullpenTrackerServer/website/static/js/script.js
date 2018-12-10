$(document).ready(function() {

    var p_token = document.cookie.replace(/(?:(?:^|.*;\s*)p_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    $.get("/api/pitcher", function(data){
        $(".pitcher_name").text(data.firstname + " " + data.lastname);

        var team_name = "Macalester%20College";
        $.get("/api/team/" + team_name, function(data){

            $(".team_name").text(data.team_name);

            $.get("/api/pitcher/bullpens", function(bullpen_data) {

        //var b_token = data[0].b_token;


        // $.get("/api/bullpen/" + b_token, function(pitch_data) {


        // });


    });

        });
    });

document.getElementById('data_entry').onclick() = function newbullpen() {
    var pentype = $('#pentype :selected').text();
    $.post(
  "/api/pitcher/bullpens/" + p_token,
  {team: "-1", type: pentype},
  function(data) {
    alert("Response: " + data);
  }
);
};




});
