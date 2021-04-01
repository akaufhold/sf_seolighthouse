requirejs(['jquery'], function ($) {
    var entries = $(".chartsEntries").find(".entry"); 
    var data;
    $(entries).each(function(key,value) {
        data = $(this).data();
    });
    
    var datasetArray = [{
        label: 'My First dataset',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgb(255, 99, 132)',
        data: [0, 10, 5, 2, 20, 30, 45]
    }];

    var labelArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    var ctx = document.getElementById('lighthouseChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: labelArray,
            datasets: datasetArray
        },

        // Configuration options go here
        options: {}
    });
    //console.log(chart["data"]);
    //chart.data.label = "Test";

    $(document).ready(function () {
        var lighthouseCharts = new LighthouseCharts();
        lighthouseCharts.init();
    });
})