$(document).ready(function() {

    var p_token = document.cookie.replace(/(?:(?:^|.*;\s*)p_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    summary_dict = {};

    function name() {
        $.get("/api/pitcher", function(data){
            var name = data.firstname + " " + data.lastname
            $(".pitcher_name").text(name);
            var throws = data.throws
            $(".throw_side").text(throws + "HP");

        }).then(bullpens);
    };

    function bullpens() {
        $.get("/api/pitcher/bullpens", function(bullpen_data) {
            var total_pitches = 0;
            var types = {};

            for (i = 0; i < bullpen_data.length; i++) {
                total_pitches += Number(bullpen_data[i].pitch_count);
                var bullpen_type = bullpen_data[i].type;
                if (types[bullpen_type] === undefined) {
                    types[bullpen_type] = [];
                }
                types[bullpen_type].push(bullpen_data[i]);

            }

            summary_dict["bullpens"] = bullpen_data.length;
            summary_dict["last"] = bullpen_data[bullpen_data.length - 1].date;
            summary_dict["pitches recorded"] = total_pitches;
        }).then(table);

//            var b_token = data[0].b_token;
//
//            $.get("/api/bullpen/" + b_token, function(pitch_data) {
//
//            });

    };

    function table() {
        for (var key in summary_dict) {
            var rowDiv = "<tr><th>" + key + "</th><td>" + summary_dict[key] + "</td></tr>"
            $(".summary_table").append(rowDiv);

        }
        // $.get("/api/bullpen/" + b_token, function(pitch_data) {


        // });
    };

    name();


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
