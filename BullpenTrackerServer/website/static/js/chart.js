$(document).ready(function() {

    var vars = ['pitch types', 'strike/executed', 'velocity', 'location'];
    var types = {};
    var pitching_data = {};

    $(function() {
        bullpen_types = [];
        bullpen_sessions = [];
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
        var b_tokens = [];

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

//        ajax(b_tokens);
    };

    $("#stat_select").on("change", function () {
        var stat = $("#chart_form #stat_select option:selected");
        console.log(stat.val());
    });

    $("#type_select").on("change", function () {
        var type = $("#chart_form #type_select option:selected");

        var type = type.val();
        var text = "<option selected value='all'>all</option>";
        $("#session_select").html(text);
        for (var i = 0; i < bullpen_sessions.length; i++) {
            if (type == "all") {
                var text = "<option value='" + bullpen_sessions[i].b_token + "'>" + bullpen_sessions[i].date + "</option>";
                $("#session_select").append(text);
            }
            else if (bullpen_sessions[i].type == type) {
                var text = "<option value='" + bullpen_sessions[i].b_token + "'>" + bullpen_sessions[i].date + "</option>";
                $("#session_select").append(text);
            }

        };
    });

    $("#session_select").on("change", function () {
        var session = $("#chart_form #session_select option:selected");
        if (session.val() == "all") {
            var tokens_list = $('#session_select option').map(function() { return $(this).val(); }).get();
            tokens_list.shift();
//            ajax(tokens_list);
        } else {
            ajax([session.val()]);
        }
    });

    function ajax(b_tokens) {

        var all_pitches = [];

        for (i = 0; i < b_tokens.length; i++) {
            $.ajax({
                method: 'GET',
                url: "/api/bullpen/" + b_tokens[i],
                success: function(pitch_data) {
                    all_pitches = all_pitches.concat(pitch_data);
                },
                complete: function(pitch_data) {
                    if (i == b_tokens.length) {
                        processData(all_pitches);
                    }
                }
            });
        };
    };

    function processData(pitch_data) {
        var pitch_count = 1;

        for (i = 0; i < pitch_data.length; i++) {

            var pitch_type = pitch_data[i].pitch_type;
            var velocity = pitch_data[i].vel;
            var strike = pitch_data[i].ball_strike;

            if (pitch_type == "F") {pitch_type = "Fastball"}
            else if (pitch_type == "X") {pitch_type = "Change-Up"}
            else if (pitch_type == "S") {pitch_type = "Slider"}
            else if (pitch_type == "B") {pitch_type = "Curveball"}

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


//        create_chart();
//        new_chart();
//        bubble_chart();
    }


    function bubble_chart() {

        var text = "<div><canvas id='canvas4'></canvas></div>";
        $("body").append(text);

        var myChart = $("#canvas4");
        var chart4 = new Chart(myChart, {
            type: 'bubble',
            data: {
                datasets: [
                {
                    label: ["Fastball"],
                    backgroundColor: "rgba(255,221,50,0.2)",
                    borderColor: "rgba(255,221,50,1)",
                    data: [{
                        x: 9,
                        y: 74,
                        r: 57
                    }]
                },
                {
                    label: ["Change-Up"],
                    backgroundColor: "rgba(60,186,159,0.2)",
                    borderColor: "rgba(60,186,159,1)",
                    data: [{
                        x: 1,
                        y: 71,
                        r: 76
                    }]
                },
                {
                    label: ["Slider"],
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderColor: "#000",
                    data: [{
                        x: 13,
                        y: 68,
                        r: 42
                    }]
                },
                {
                    label: ["Curveball"],
                    backgroundColor: "rgba(193,46,12,0.2)",
                    borderColor: "rgba(193,46,12,1)",
                    data: [{
                        x: 4,
                        y: 69,
                        r: 48
                    }]
                }]
            },
            options: {
                maintainAspectRatio: true,
                responsive: false,
                title: {
                    display: true,
                    text: 'Predicted strike percent'
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Average Velocity"
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

        var colors = [{"background":"rgba(255,221,50,0.2)","border":"rgba(255,221,50,1)"},
                      {"background":"rgba(60,186,159,0.2)","border":"rgba(60,186,159,1)"},
                      {"background":"rgba(193,46,12,0.2)","border":"rgba(193,46,12,1)"},
                      {"background":"rgba(173,216,230,0.2)","border":"rgba(173,216,230,1)"}];
        var datasets = [];
        var pitch_type = Object.keys(types);

        for (i = 0; i < pitch_type.length; i++) {

            var data_dict = {};
            data_dict["label"] = [pitch_type[i]];
            data_dict["data"] = [];
            data_dict["backgroundColor"] = colors[i].background;
            data_dict["borderColor"] = colors[i].border;
            for (k = 0; k < pitching_data[pitch_type[i]].length; k++) {
                var position = {};
                position['x'] = pitching_data[pitch_type[i]][k].pitch_count;
                if (pitching_data[pitch_type[i]][k].vel == 0) {
                    position['y'] = types[pitch_type[i]]["avg_velocity"];
                    position['r'] = 5;
                } else {
                    position['y'] = pitching_data[pitch_type[i]][k].vel;
                    position['r'] = 10;
                }

                data_dict['data'].push(position);
            }
            datasets.push(data_dict);
        }

        var text = "<div><canvas id='canvas5'></canvas></div>";
        $("body").append(text);

        var myChart = $("#canvas5");
        var chart5 = new Chart(myChart, {
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

    function create_chart() {

        var text = "<div><canvas id='canvas1'></canvas></div>";
        $("body").append(text);

        var pitch_types_array = Object.keys(types);
        var counts = [];

        for (i = 0; i < pitch_types_array.length; i++) {
            counts.push(types[pitch_types_array[i]]['count']);
        };

        var myChart = $("#canvas1");
        var chart1 = new Chart(myChart, {
            type: 'pie',
            data: {
                labels: pitch_types_array,
                datasets:[{
                    label: "# of pitches",
                    backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                    data: counts
                }]
            },
            options: {
                maintainAspectRatio: true,
                responsive: false,
                legend: { display: true },
                title: {
                    display: true,
                    text: 'Pitch Count'
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

        var text = "<div><canvas id='canvas2'></canvas></div>";
        $("body").append(text);

        var avg_velocities = [];

        for (i = 0; i < pitch_types_array.length; i++) {
            var vel_array = types[pitch_types_array[i]]['avg_velocity'];
            var vel_sum = 0;

            for (k = 0; k < vel_array.length; k++) {
                vel_sum += Number(vel_array[k]);
            }

            var vel_avg = vel_sum/vel_array.length;
            avg_velocities.push(vel_avg);
        }

        var myChart = $("#canvas2");
        var chart2 = new Chart(myChart, {
            type: 'bar',
            data: {
                labels: pitch_types_array,
                datasets:[{
                    label: "avg. velocity",
                    backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                    data: avg_velocities
                }]
            },
            options: {
                maintainAspectRatio: true,
                responsive: false,
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Average Velocities'
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

        var text = "<div><canvas id='canvas3'></canvas></div>";
        $("body").append(text);

        var strikes = [];

        for (i = 0; i < pitch_types_array.length; i++) {
            strikes.push(types[pitch_types_array[i]]['strike%']);
        };

        var myChart = $("#canvas3");
        var chart3 = new Chart(myChart, {
            type: 'bar',
            data: {
                labels: pitch_types_array,
                datasets:[{
                    label: "strike %",
                    backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                    data: strikes
                }]
            },
            options: {
                maintainAspectRatio: true,
                responsive: false,
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Strike Percentage'
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
    };

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
        for (i = 0; i < pitch_types_array.length; i++) {
            if (pitch_types_array[i] == "F") {pitch_types_array[i] = "Fastball"}
            else if (pitch_types_array[i] == "X") {pitch_types_array[i] = "Change-Up"}
            else if (pitch_types_array[i] == "S") {pitch_types_array[i] = "Slider"}
            else if (pitch_types_array[i] == "B") {pitch_types_array[i] = "Curveball"}
        };

        var text = "<div><canvas id='" + canvas + "'></canvas></div>";
        $("body").append(text);

        var myChart = $("#"+canvas);
        var chart3 = new Chart(myChart, {
            type: chart,
            data: {
                labels: pitch_types_array,
                datasets:[{
                    label: label,
                    backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
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