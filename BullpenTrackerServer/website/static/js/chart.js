$(document).ready(function() {

    var vars = ['pitch types', 'strike/executed', 'velocity', 'location'];
    var types = {};

    $(function() {
        for (var i = 0; i < vars.length; i++) {
            variable = vars[i];
            var text = "<option value='" + variable + "'>" + variable + "</option>";
            $("#stat_select").append(text);
        };
    });

    $("input[name=pick_chart_button]").click(function(event) {
		var stat = $("#chart_form #stat_select option:selected");
		event.preventDefault();
		$('#chart_form').trigger("reset");
		alert(stat.val());
    });

    $.ajax({
        method: 'GET',
        url: "/api/bullpen/3d068257",
        success: function(pitch_data) {

            var total_pitches = pitch_data.length;

            for (i = 0; i < pitch_data.length; i++) {

                var pitch_type = pitch_data[i].pitch_type;
                var strike = pitch_data[i].ball_strike;

                if (types[pitch_type] === undefined) {
                    types[pitch_type] = {"velocity":[], "count":0, "strike%":0};
                }

                types[pitch_type]["velocity"].push(pitch_data[i].vel);
                types[pitch_type]["count"] += 1;
                if (strike == "Y" | "E") {
                    types[pitch_type]["strike%"] += 1;
                };

            }

            types[pitch_type]["strike%"] = types[pitch_type]["strike%"]/total_pitches;
            var pitch_type = Object.keys(types);

            for (i = 0; i < pitch_type.length; i++) {
                types[pitch_type[i]]["strike%"] = types[pitch_type[i]]["strike%"]/types[pitch_type[i]]["count"]
            };

//            create_chart();
            new_chart();
        }
    });



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
            var vel_array = types[pitch_types_array[i]]['velocity'];
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

//        var text = "<div><canvas id='canvas1'></canvas></div>";
//        $("body").append(text);

        var pitch_types_array = Object.keys(types);
        var counts = [];

        for (i = 0; i < pitch_types_array.length; i++) {
            counts.push(types[pitch_types_array[i]]['count']);
        };

        chart_builder('canvas1', 'pie', "# of pitches", counts, "Pitch Count");

//        var text = "<div><canvas id='canvas2'></canvas></div>";
//        $("body").append(text);

        var avg_velocities = [];

        for (i = 0; i < pitch_types_array.length; i++) {
            var vel_array = types[pitch_types_array[i]]['velocity'];
            var vel_sum = 0;

            for (k = 0; k < vel_array.length; k++) {
                vel_sum += Number(vel_array[k]);
            }

            var vel_avg = vel_sum/vel_array.length;
            avg_velocities.push(vel_avg);
        }

        chart_builder('canvas2', 'bar', "avg. velocity", avg_velocities, "Average Velocity");

//        var text = "<div><canvas id='canvas3'></canvas></div>";
//        $("body").append(text);
        var strikes = [];

        for (i = 0; i < pitch_types_array.length; i++) {
            strikes.push(types[pitch_types_array[i]]['strike%']);
        };

        chart_builder('canvas3', 'bar', "strike %", strikes, "Strike Percentage");

    };

    function chart_builder(canvas, chart, label, data, title) {

        var pitch_types_array = Object.keys(types);

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