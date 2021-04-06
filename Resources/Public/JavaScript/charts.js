require.config({
    paths: {
      moment: "//cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment.min",
      chart: "//cdn.jsdelivr.net/npm/chart.js@3.0.2/dist/chart.min"
    },
    shim: {
      chartjs: {
        exports: "C"
      },
    },
});
  

requirejs(['jquery'], function ($) {
    require(["moment", "chart"], function(moment, chart) {
        var LighthouseCharts = function () {
            var ch = this;
            var datasetArray;
            var labelArray;

            /* INIT */
            ch.init = function () {
                var entries = $(".chartsEntries").find(".entry"); 
                var data;
                var ctx = document.getElementById('lighthouseChart').getContext('2d');

                $(entries).each(function(key,value) {
                    data = $(this).data();
                });
                ch.createDatasets();
                ch.createLabels();
                ch.createCharts(ctx,"line");

            }
            /* DATA */
            ch.createDatasets = function () {
                datasetArray = [{
                    label: 'My First dataset',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: [0, 10, 5, 2, 20, 30, 45]
                }];
            }
            /* LABELS */
            ch.createLabels = function () {
                labelArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
            }
            /* CREATE CHARTS*/
            ch.createCharts = function (ctxIn, typeIn) {
                const chart = new Chart(ctxIn, {
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
    });
});
