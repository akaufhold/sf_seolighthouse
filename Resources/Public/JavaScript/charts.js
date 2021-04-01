requirejs(['jquery'], function ($) {

    var LighthouseCharts = function () {
        var datasetArray;
        var labelArray;

        me.init = function () {
            var entries = $(".chartsEntries").find(".entry"); 
            var data;
            var ctx = document.getElementById('lighthouseChart').getContext('2d');

            $(entries).each(function(key,value) {
                data = $(this).data();
            });
            me.createCharts(ctx);

        }
        /* TEST DATA */
        me.createDatasets = function () {
            datasetArray = [{
                label: 'My First dataset',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45]
            }];
        }
        me.createLabels = function () {
            label = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        }
        
        me.createCharts = function (ctxIn, typeIn) {
            var chart = new Chart(ctxIn, {
                // The type of chart we want to create
                type: typeIn,

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
