$(document).ready(function() {

    $(function() {
        var myChart = $("#canvas").getContext('2d');
        var chart1 = new Chart(myChart, {
            type:'',
            data: {
                labels:[],
                datasets:[]
            },
            options: {}
        });
    });

});