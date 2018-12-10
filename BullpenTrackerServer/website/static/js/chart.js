$(document).ready(function() {

    var vars = ['pitch_types', 'strike_ball', 'velocity', 'location'];
    var types = {};

    $(function() {

        $.ajax({
            method: 'GET',
            url: "/api/bullpen/0",
            success: function(pitch_data) {

                for (i = 0; i < pitch_data.length; i++) {
                    var total_pitches = pitch_data.length;
                    var pitch_type = pitch_data[i].pitch_type;

                    if (types[pitch_type] === undefined) {
                        types[pitch_type] = {"velocity":[], "count":0};
                    }

                    types[pitch_type]["velocity"].push(pitch_data[i].vel);
                    types[pitch_type]["count"] += 1;

                }

                create_chart();
            }
        });

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
                    label: "Number of pitches",
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

        var pitch_types_array = Object.keys(types);
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
                    label: "Average Velocity",
                    backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                    data: avg_velocities
                }]
            },
            options: {
                maintainAspectRatio: true,
                responsive: false,
                legend: { display: true },
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


    };

});