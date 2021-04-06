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

var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(231,233,237)'
};


requirejs(['jquery'], function ($) {
    require(["moment", "chart"], function(moment, chart) {
        var LighthouseCharts = function () {
            var ch = this;
            var datasetArray, labelArray, type, period, chart;
            /* INIT */
            ch.init = function () {
                var entries = $(".chartsEntries").find(".entry"); 
                var data;
                var lhc = document.getElementById('lighthouseChart').getContext('2d');

                $(entries).each(function(key,value) {
                    data = $(this).data();
                });
                ch.createDatasets();
                ch.createLabels();

                period = $("#period-select").find("option:selected").val();
                type = $("#type-select").find("option:selected").val();

                chart = ch.createCharts(lhc,type);

                $("#type-select").on("change",function(){
                    // console.log($(this).val());
                    type = $(this).val().toLowerCase();
                    chart.destroy();
                    chart = ch.createCharts(lhc,type);
                });

                $("#period-select").on("change",function(){
                    // console.log($(this).val());
                    period = $(this).val().toLowerCase(); 
                    chart.destroy();
                    chart = ch.createCharts(lhc,type);
                });
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
            ch.createCharts = function (chartIn, typeIn) {
                var chartIn = new Chart(chartIn, {
                    // The type of chart we want to create
                    type: typeIn,

                    // The data for our dataset
                    data: {
                        labels: labelArray,
                        datasets: datasetArray
                    },

                    // Configuration options go here
                    options: {
                        scales:{
                            
                        }
                    }
                });
                return chartIn;
            }
        }
        
        var lighthouseCharts = new LighthouseCharts();
        lighthouseCharts.init();
        
    });
});
