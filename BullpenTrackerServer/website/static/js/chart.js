$(document).ready(function() {

    var vars = ['pitch types', 'strike/executed', 'velocity', 'location'];
    var types = {};
    var pitching_data = {};
    var b_tokens = [];
    var bullpen_types = [];
    var bullpen_sessions = [];

    var colors = [{"background":"rgba(255,221,50,0.2)","border":"rgba(255,221,50,1)"}, // yellow
                      {"background":"rgba(60,186,159,0.2)","border":"rgba(60,186,159,1)"}, // green
                      {"background":"rgba(193,46,12,0.2)","border":"rgba(193,46,12,1)"}, // red
                      {"background":"rgba(173,216,230,0.2)","border":"rgba(173,216,230,1)"}, // blue
                      {"background":"rgba(104,19,214,0.2)","border":"rgba(104,19,214,1)"}, // purple
                      {"background":"rgba(249,122,232,0.2)","border":"rgba(249,122,232,1)"}  // pink
                      ];

    var pitch_list = {"2":"2-Seam",
                      "B":"Curveball",
                      "C":"Cutter",
                      "F":"Fastball",
                      "S":"Slider",
                      "X":"Change-Up"
                      }

    $(function() {
        $.get("/api/pitcher/bullpens", function(bullpen_data) {
            for (var i = 0; i < bullpen_data.length; i++) {
                bullpen_session = {"date":bullpen_data[i].date, "b_token":bullpen_data[i].b_token, "type":bullpen_data[i].type};
                bullpen_sessions.push(bullpen_session);

                bullpen_type = bullpen_data[i].type;
                if (!bullpen_types.includes(bullpen_type)) {
                    bullpen_types.push(bullpen_type);
                }
            };

            set_select();
        });
    });


    function set_select() {
        b_tokens = [];

        var text = "<option selected value='all'>all</option>";
        $("#stat_select").append(text);
        for (var i = 0; i < vars.length; i++) {
            variable = vars[i];
            var text = "<option value='" + variable + "'>" + variable + "</option>";
            $("#stat_select").append(text);
        };

        var text = "<option selected value='all'>all</option>";
        $("#type_select").append(text);
        for (var i = 0; i < bullpen_types.length; i++) {
            var text = "<option value='" + bullpen_types[i] + "'>" + bullpen_types[i] + "</option>";
            $("#type_select").append(text);
        };

        var text = "<option selected value='all'>all</option>";
        $("#session_select").append(text);
        for (var i = 0; i < bullpen_sessions.length; i++) {
            var text = "<option value='" + bullpen_sessions[i].b_token + "'>" + bullpen_sessions[i].date + "</option>";
            b_tokens.push(bullpen_sessions[i].b_token)
            $("#session_select").append(text);
        };

        ajax(b_tokens);
    };

    $("#stat_select").on("change", function() {
        var stat = $("#chart_form #stat_select option:selected");
        console.log(stat.val());
    });

    $("#type_select").on("change", function() {
        var type = $("#chart_form #type_select option:selected");
        var type = type.val();

        b_tokens = [];
        var text = "<option selected value='all'>all</option>";
        $("#session_select").html(text);
        for (var i = 0; i < bullpen_sessions.length; i++) {
            if (type == "all") {
                var text = "<option value='" + bullpen_sessions[i].b_token + "'>" + bullpen_sessions[i].date + "</option>";
                $("#session_select").append(text);
                b_tokens.push(bullpen_sessions[i].b_token)
            }
            else if (bullpen_sessions[i].type == type) {
                var text = "<option value='" + bullpen_sessions[i].b_token + "'>" + bullpen_sessions[i].date + "</option>";
                $("#session_select").append(text);
                b_tokens.push(bullpen_sessions[i].b_token)
            };

        };

        ajax(b_tokens);
    });

    $("#session_select").on("change", function () {
        var session = $("#chart_form #session_select option:selected");

        if (session.val() == "all") {
            b_tokens = $('#session_select option').map(function() { return $(this).val(); }).get();
            b_tokens.shift();
            ajax(b_tokens);
        } else {
            ajax([session.val()]);
        };
    });

    function ajax(b_tokens) {

        var token_url = "";
        for (i = 0; i < b_tokens.length; i++) {
            if (i == 0) {
                token_url += b_tokens[0]
            } else {
                token_url += "+" + b_tokens[i]
            };
        };

        var data = []
        $("#chart_form select").attr("disabled", true);
        $.ajax({
            method: 'GET',
            url: "/api/bullpen/" + token_url,
            success: function(pitch_data) {
                data = pitch_data;
            },
        });

        $(document).ajaxStop(function() {
            processData(data);
            $("#chart_form select").attr("disabled", false);
        });
    };

    function processData(pitch_data) {
        types = {};
        pitching_data = {};
        var pitch_count = 1;

        for (i = 0; i < pitch_data.length; i++) {

            var pitch_type = pitch_data[i].pitch_type;
            var velocity = pitch_data[i].vel;
            var strike = pitch_data[i].ball_strike;

            pitch_type = pitch_list[pitch_type];

            if (pitching_data[pitch_type] === undefined) {
                pitching_data[pitch_type] = [];
            }

            pitch_data[i]["pitch_count"] = pitch_count;
            pitching_data[pitch_type].push(pitch_data[i]);
            pitch_count++;

            if (types[pitch_type] === undefined) {
                types[pitch_type] = {"avg_velocity":0, "count":0, "strike%":0, "vel_pitches":0};
            }

            types[pitch_type]["count"] += 1;

            if (velocity != 0) {
                types[pitch_type]["avg_velocity"] += velocity;
                types[pitch_type]["vel_pitches"] += 1;
            }

            if (strike === "X" | "Y") {
                types[pitch_type]["strike%"] += 1;
            };

        }

        var pitch_type = Object.keys(types);

        for (i = 0; i < pitch_type.length; i++) {
            types[pitch_type[i]]["strike%"] = types[pitch_type[i]]["strike%"]/types[pitch_type[i]]["count"]
            types[pitch_type[i]]["avg_velocity"] = types[pitch_type[i]]["avg_velocity"]/types[pitch_type[i]]["vel_pitches"];
        };

        $(".chart_container").html("");
        new_chart();
        bubble_chart();
    }


    function bubble_chart() {

        var datasets = [];
        var pitch_type = Object.keys(types);

        for (i = 0; i < pitch_type.length; i++) {
            var data_dict = {};
            data_dict["label"] = [pitch_type[i]];
            data_dict["data"] = [];
            data_dict["borderColor"] = colors[i].border;
            data_dict["backgroundColor"] = colors[i].background;

            for (k = 0; k < pitching_data[pitch_type[i]].length; k++) {
                if (pitching_data[pitch_type[i]][k].vel != 0) {
                    var position = {};
                    position['x'] = pitching_data[pitch_type[i]][k].pitch_count;
                    position['y'] = pitching_data[pitch_type[i]][k].vel;
                    position['r'] = 10;
                }

                data_dict['data'].push(position);
            }
            datasets.push(data_dict);
        }

//        // non-velocity pitches
//        for (i = 0; i < pitch_type.length; i++) {
//            var data_dict = {};
//            data_dict["label"] = [pitch_type[i]];
//            data_dict["data"] = [];
//            data_dict["borderColor"] = colors[i].border;
//            data_dict["backgroundColor"] = "rgba(0,0,0,0)";
//
//            for (k = 0; k < pitching_data[pitch_type[i]].length; k++) {
//                if (pitching_data[pitch_type[i]][k].vel == 0) {
//                    var position = {};
//                    position['x'] = pitching_data[pitch_type[i]][k].pitch_count;
//                    position['y'] = types[pitch_type[i]]["avg_velocity"];
//                    position['r'] = 10;
//                }
//
//                data_dict['data'].push(position);
//            }
//            datasets.push(data_dict);
//        }

        var text = "<div><canvas id='canvas4'></canvas></div>";
        $(".chart_container").append(text);

        var myChart = $("#canvas4");
        var chart4 = new Chart(myChart, {
            type: 'bubble',
            data: {
                datasets: datasets
            },
            options: {
                maintainAspectRatio: true,
                responsive: false,
                title: {
                    display: true,
                    text: 'Velocity by Pitch Count'
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Pitch Velocity"
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Pitch Count"
                        }
                    }]
                }
            }
        });

    }


    function new_chart() {

        var pitch_types_array = Object.keys(types);
        var counts = [];

        for (i = 0; i < pitch_types_array.length; i++) {
            counts.push(types[pitch_types_array[i]]['count']);
        };

        chart_builder('canvas1', 'bar', "# of pitches", counts, "Pitch Count");


        var velocities = [];

        for (i = 0; i < pitch_types_array.length; i++) {
            velocities.push(types[pitch_types_array[i]]['avg_velocity']);
        };

        chart_builder('canvas2', 'bar', "avg. velocity", velocities, "Average Velocity");



        var strikes = [];

        for (i = 0; i < pitch_types_array.length; i++) {
            strikes.push(types[pitch_types_array[i]]['strike%']);
        };

        chart_builder('canvas3', 'bar', "strike %", strikes, "Strike Percentage");

    };

    function chart_builder(canvas, chart, label, data, title) {
        var pitch_types_array = Object.keys(types);
        var background_colors = [];
        for (i = 0; i < colors.length; i++) {
            background_colors.push(colors[i].border);
        }

        var text = "<div><canvas id='" + canvas + "'></canvas></div>";
        $(".chart_container").append(text);

        var myChart = $("#"+canvas);
        var chart3 = new Chart(myChart, {
            type: chart,
            data: {
                labels: pitch_types_array,
                datasets:[{
                    label: label,
                    backgroundColor: background_colors,
                    data: data
                }]
            },
            options: {
                maintainAspectRatio: true,
                responsive: false,
                legend: { display: false },
                title: {
                    display: true,
                    text: title
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });


    }

});