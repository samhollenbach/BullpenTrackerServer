$(document).ready(function() {

    var types = {};
    var pitching_data = {};
    var b_tokens = [];
    var bullpen_types = [];
    var bullpen_sessions = [];
    var stat_measures = ['pitch types', 'count', 'velocity', 'location'];  // list of variables to use in charts
    var stat = ""; // selected variable to graph in charts

    // list of colors for charts
    var colors = [{"background":"rgba(255,221,50,0.2)","border":"rgba(255,221,50,1)"}, // yellow
                  {"background":"rgba(60,186,159,0.2)","border":"rgba(60,186,159,1)"}, // green
                  {"background":"rgba(193,46,12,0.2)","border":"rgba(193,46,12,1)"}, // red
                  {"background":"rgba(173,216,230,0.2)","border":"rgba(173,216,230,1)"}, // blue
                  {"background":"rgba(104,19,214,0.2)","border":"rgba(104,19,214,1)"}, // purple
                  {"background":"rgba(249,122,232,0.2)","border":"rgba(249,122,232,1)"}  // pink
                  ];

    // dictionary of pitch type variables to pitch type names
    var pitch_list = {"2":"2-Seam",
                      "B":"Curveball",
                      "C":"Cutter",
                      "F":"Fastball",
                      "S":"Slider",
                      "X":"Change-Up"}

    // initializing function that gets list of bullpens for user
    $(function() {
        $.get("/api/pitcher/bullpens", function(bullpen_data) {
            for (var i = 0; i < bullpen_data.length; i++) {
                bullpen_session = {"date":bullpen_data[i].date, "b_token":bullpen_data[i].b_token, "type":bullpen_data[i].type};
                bullpen_sessions.push(bullpen_session);

                // organizes bullpens by type
                bullpen_type = bullpen_data[i].type;
                if (!bullpen_types.includes(bullpen_type)) {
                    bullpen_types.push(bullpen_type);
                }
            };

            set_select();
        });
    });

    // renders filter options for stat, type and session
    function set_select() {
        b_tokens = [];

//        var text = "<option selected value='all'>all</option>";
//        $("#stat_select").append(text);
        for (var i = 0; i < stat_measures.length; i++) {
            variable = stat_measures[i];
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
        // runs ajax sequence with all pitcher data
        ajax(b_tokens);
    };

    // event handler for stat_select
    $("#stat_select").on("change", function() {
        stat = $("#chart_form #stat_select option:selected").val();
        $(".chart_container").html("");
        if (stat == "location") {
            location_chart();
        }
        else if (stat == "count") {
            bar_charts(true);
            count_velocity_chart();
        }
        else if (stat == "velocity") {
            bar_charts(false,true);
            count_velocity_chart();
        }
        else {
            bar_charts(true,true,true);
            count_velocity_chart();
            location_chart();
        }
    });

    // event handler for type_select
    $("#type_select").on("change", function() {
        var type = $("#chart_form #type_select option:selected").val();

        // edits session_select options to only the ones of the selected bullpen type,
        // automatically calls ajax to redraw charts with data fitting the type filter
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

    // event handler for session_select
    $("#session_select").on("change", function () {
        var session = $("#chart_form #session_select option:selected").val();

        // automatically calls ajax to redraw charts with data fitting the session filter
        if (session == "all") {
            b_tokens = $('#session_select option').map(function() { return $(this).val(); }).get();
            b_tokens.shift();
            ajax(b_tokens);
        } else {
            ajax([session]);
        };
    });

    // Takes a list of b_tokens as a parameter.  Triggers ajax call for all sessions
    // with b_tokens in the input.
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

        $(document).ajaxStart(function() {
            $("#chart_form select").attr("disabled", true); // disables functionality of select fields when ajax call starts
        });

        $(document).ajaxStop(function() {
            processData(data);
            $("#chart_form select").attr("disabled", false); // re-enables functionality of select fields when ajax call stops
        });
    };

    function processData(pitch_data) {
        types = {}; // summary of each pitch type
        pitching_data = {};  // pitch_data + pitch_count organized by pitch type
        var pitch_count = 1;

        for (i = 0; i < pitch_data.length; i++) {

            // Variable declaration
            var pitch_type = pitch_data[i].pitch_type;
            var velocity = pitch_data[i].vel;
            var strike = pitch_data[i].ball_strike;

            pitch_type = pitch_list[pitch_type]; // renames pitch_type as pitch name

            // avoids key repetition when building pitching_data dictionary
            if (pitching_data[pitch_type] === undefined) {
                pitching_data[pitch_type] = [];
            }

            pitch_data[i]["pitch_count"] = pitch_count;
            pitching_data[pitch_type].push(pitch_data[i]);
            pitch_count++;

            // avoids key repetition when building types dictionary
            if (types[pitch_type] === undefined) {
                types[pitch_type] = {"avg_velocity":0, "count":0, "strike%":0, "vel_pitches":0};
            }

            types[pitch_type]["count"] += 1;

            // filters out pitches with no recorded velocity for calculating avg. velocity
            if (velocity != 0) {
                types[pitch_type]["avg_velocity"] += velocity;
                types[pitch_type]["vel_pitches"] += 1;
            }

            if (strike == "X" || strike == "Y" || strike == "S") {
                types[pitch_type]["strike%"] += 1;
            };

        }

        // lists all keys(pitch types) added into types dictionary
        var pitch_type = Object.keys(types);

        // calculates strike percentage and average velocity for each pitch type
        for (i = 0; i < pitch_type.length; i++) {
            types[pitch_type[i]]["strike%"] = (types[pitch_type[i]]["strike%"]/types[pitch_type[i]]["count"])*100
            types[pitch_type[i]]["avg_velocity"] = types[pitch_type[i]]["avg_velocity"]/types[pitch_type[i]]["vel_pitches"];
        };

        // empties chart_container in html before drawing new charts
        $(".chart_container").html("");
        if (stat == "location") {
            location_chart();
        }
        else if (stat == "count") {
            bar_charts(true);
            count_velocity_chart();
        }
        else if (stat == "velocity") {
            bar_charts(false,true);
            count_velocity_chart();
        }
        else {
            bar_charts(true,true,true);
            count_velocity_chart();
            location_chart();
        }
    }

    // graph of pitch count to velocity
    function count_velocity_chart() {
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
                    text: 'Pitch Count by Velocity',
                    fontSize: 20
                },
                legend: {
                    labels: {
                        fontSize: 14
                    }
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Pitch Velocity",
                            fontSize: 16
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Pitch Count",
                            fontSize: 16
                        }
                    }]
                }
            }
        });

    }

    // graph of pitch locations on strike zone grid
    function location_chart() {
        var datasets = [];
        var pitch_type = Object.keys(types);

        // builds strike zone box
        var strikezone1 = {"type":"line","data":[{'x':-1,'y':-2},{'x':1,'y':-2}]};
        var strikezone2 = {"type":"line","data":[{'x':-1,'y':2},{'x':1,'y':2}]};
        var strikezone3 = {"type":"line","data":[{'x':-1,'y':-2},{'x':-1,'y':2}]};
        var strikezone4 = {"type":"line","data":[{'x':1,'y':-2},{'x':1,'y':2}]};
        datasets.push(strikezone1);
        datasets.push(strikezone2);
        datasets.push(strikezone3);
        datasets.push(strikezone4);

        // plots each pitch by x and y coordinates
        for (i = 0; i < pitch_type.length; i++) {
            var data_dict = {};
            data_dict["label"] = [pitch_type[i]];
            data_dict["data"] = [];
            data_dict["borderColor"] = colors[i].border;
            data_dict["backgroundColor"] = colors[i].background;

            for (k = 0; k < pitching_data[pitch_type[i]].length; k++) {
                var position = {};
                position['x'] = pitching_data[pitch_type[i]][k].pitchX;
                position['y'] = pitching_data[pitch_type[i]][k].pitchY;
                position['r'] = 10;

                data_dict['data'].push(position);
            }
            datasets.push(data_dict);
        }

        var text = "<div><canvas id='canvas5'></canvas></div>";
        $(".chart_container").append(text);

        var myChart = $("#canvas5");
        var chart5 = new Chart(myChart, {
            type: 'bubble',
            data: {
                datasets: datasets
            },
            options: {
                maintainAspectRatio: false,
                responsive: false,
                legend: {
                    display: true,
                    labels: {
                        filter: function(legendItem, data) {
                            return legendItem.text != undefined // catches line data with undefined labels
                        },
                        fontSize: 14
                    },
                    position: 'right'
                },
                layout: {
                    padding: {
                        left: 200, // helps scale the axes
                        right: 150, // helps scale the axes
                        top: 0,
                        bottom: 0
                    }
                },
                title: {
                    display: true,
                    text: 'Pitch Location Map',
                    fontSize: 20
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            stepSize:1,
                            min:-3,
                            max:3
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            stepSize:1,
                            min:-2,
                            max:2
                        }
                    }]
                }
            }
        });
    }

    // Sets up data to be graphed on bar charts using Chart.js
    // Calls chart_builder() to draw charts with input data
    function bar_charts(count=false,velocity=false,strike=false) {
        var pitch_types_array = Object.keys(types);

        if (count) {
            var counts = [];

            for (i = 0; i < pitch_types_array.length; i++) {
                counts.push(types[pitch_types_array[i]]['count']);
            };

            chart_builder('canvas1', 'bar', "# of Pitches", counts, "Pitch Count");
        }

        if (velocity) {
            var velocities = [];

            for (i = 0; i < pitch_types_array.length; i++) {
                velocities.push(Math.round(types[pitch_types_array[i]]['avg_velocity']));
            };

            chart_builder('canvas2', 'bar', "Avg. Velocity", velocities, "Average Velocity");
        }

        if (strike) {
            var strikes = [];

            for (i = 0; i < pitch_types_array.length; i++) {
                strikes.push(Math.round(types[pitch_types_array[i]]['strike%']));
            };

            chart_builder('canvas3', 'bar', "Strike %", strikes, "Strike Percentage");
        }


    };

    // Graphs of pitch count, average velocity and strike percentage by pitch type
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
                    backgroundColor: background_colors,
                    data: data
                }]
            },
            options: {
                maintainAspectRatio: true,
                responsive: false,
                // disables hover animation because it hides bar values
                hover: {
                    animationDuration: 0
                },
                // shows value of bar at the top
                animation: {
        	        duration: 1,
						onComplete: function () {
							var chartInstance = this.chart,
								ctx = chartInstance.ctx;

							ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
							ctx.textAlign = 'center';
							ctx.textBaseline = 'bottom';

							this.data.datasets.forEach(function (dataset, i) {
								var meta = chartInstance.controller.getDatasetMeta(i);
								meta.data.forEach(function (bar, index) {
									var data = dataset.data[index];
									ctx.fillText(data, bar._model.x, bar._model.y - 5);
								});
							});
						}
                },
                tooltips: {
                    enabled: false
                },
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: title,
                    fontSize: 20,
                    lineHeight:2
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: label,
                            fontSize: 16
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: "Pitch Types",
                            fontSize: 16
                        }
                    }]
                }
            }
        });
    }

});