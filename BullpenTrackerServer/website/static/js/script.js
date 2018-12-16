$(document).ready(function() {

    var p_token = document.cookie.replace(/(?:(?:^|.*;\s*)p_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    summary_dict = {};

    $(function() {
        // gets pitcher name and throw side
        $.get("/api/pitcher", function(data){
            var name = data.firstname + " " + data.lastname
            $(".pitcher_name").text(name);
            var throws = data.throws
            $(".throw_side").text(throws + "HP");

        })
        .done(function() {

            // gets summary data to input into summary_dict{}
            $.get("/api/pitcher/bullpens", function(bullpen_data) {
                var total_pitches = 0;

                for (i = 0; i < bullpen_data.length; i++) {
                    total_pitches += Number(bullpen_data[i].pitch_count);
                }

                var last_bullpen = bullpen_data[bullpen_data.length - 1].date;

                if (last_bullpen == undefined) {
                    last_bullpen = "None"
                };

                summary_dict["Bullpens Recorded"] = bullpen_data.length;
                summary_dict["Last Bullpen"] = last_bullpen;
                summary_dict["Pitches Recorded"] = total_pitches;
            })
            .done(function() {

                // loops through summary_dict{} and inputs into table
                for (var key in summary_dict) {
                    var rowDiv = "<tr><th>" + key + "</th><td>" + summary_dict[key] + "</td></tr>"
                    $(".summary_table").append(rowDiv);

                };
            });
        });
    });

//    document.getElementById('data_entry').onclick() = function newbullpen() {
//        var pentype = $('#pentype :selected').text();
//        $.post(
//            "/api/pitcher/bullpens/" + p_token,
//            {team: "-1", type: pentype},
//            function(data) {
//                alert("Response: " + data);
//            }
//        );
//    };

});
