$(document).ready(function() {

    $.get("http://bullpentracker.com/api/pitcher/" + p_token, function(data){
        $(".pitcher_name").text(data.firstname + " " + data.lastname);
    });

    $.get("http://bullpentracker.com/api/team/" + team_name, function(data){
        $(".team_name").text(data.team_name);
    });

    $("#data_viz").click(function() {
        window.location.href='data_viz.html';
    });

    $("#data_entry").click(function() {
        window.location.href='data_entry.html';
    });

});
