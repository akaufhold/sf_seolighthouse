requirejs(['jquery'], function ($) {

    var LighthouseData = function () {
        var datasetArray;
        var labelArray;

        me.init = function () {
            var entries = $(".chartsEntries").find(".entry"); 
            var data;
            var ctx = document.getElementById('lighthouseChart').getContext('2d');

            $(entries).each(function(key,value) {
                data = $(this).data();
            });


        }
        /* TEST DATA */
        me.dataset = function () {
            var datasetArray = [{
                label: 'My First dataset',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45]
            }];
        }
        me.dataset = function () {
            label = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        }
        
        me.chart = function () {
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
        }
    }
    $(document).ready(function () {
        var lighthouseCharts = new LighthouseCharts();
        lighthouseCharts.init();
    });
})