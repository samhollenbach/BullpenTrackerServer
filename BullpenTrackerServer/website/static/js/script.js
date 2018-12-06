$(document).ready(function() {

    var p_token = document.cookie.replace(/(?:(?:^|.*;\s*)p_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log(p_token);
    $.get("http://127.0.0.1:5000/api/pitcher/" + p_token, function(data){
        $(".pitcher_name").text(data.firstname + " " + data.lastname);
    });

    var team_name = "Macalester%20College";

    $.get("http://127.0.0.1:5000/api/team/" + team_name, function(data){
        $(".team_name").text(data.team_name);
    });


    $.get("http://127.0.0.1:5000/api//" + team_name, function(data){
    });
});
