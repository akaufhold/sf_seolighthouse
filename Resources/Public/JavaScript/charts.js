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
                var data;
                var entries = $(".chartsEntries").find(".entry"); 

                var lhcd    = document.getElementById('lighthouseChart_desktop').getContext('2d');
                var lhcm    = document.getElementById('lighthouseChart_mobile').getContext('2d');

                period      = $("#period-select").find("option:selected").val();
                type        = $("#type-select").find("option:selected").val();

                chart       = ch.createCharts(lhcd,type);
                chart2      = ch.createCharts(lhcm,type);

                $(entries).each(function(key,value) {
                    data        = $(this).data();
                    var date    = data.crdate;

                    var fcp     = data.fcp;
                    var si      = data.si;
                    var lcp     = data.lcp;
                    var tti     = data.tti;
                    var tbt     = data.tbt;
                    var cls     = data.cls;

                    
                    console.log(data.cls);
                    /*data.forEach(function(key,value){
                        console.log(key);
                        console.log(value);
                    });    */
                });
                //ch.addDataSet(chart);

                $(".device").on("change",function(){
                    type = $(this).val().toLowerCase();
                    $(".lighthouseCharts").css({display:"none"});
                    $("#lighthouseChart_"+type).css({display:"block"});
                });

                $("#type-select").on("change",function(){
                    // console.log($(this).val());
                    type = $(this).val().toLowerCase();
                    chart.destroy();
                    chart = ch.createCharts(lhcd,type);
                    chart2.destroy();
                    chart2 = ch.createCharts(lhcm,type);
                });

                $("#period-select").on("change",function(){
                    // console.log($(this).val());
                    period = $(this).val().toLowerCase(); 
                    chart.destroy();
                    chart = ch.createCharts(lhcd,type);
                    chart2.destroy();
                    chart2 = ch.createCharts(lhcm,type);
                });
            }
            /* DATA */
            var newDataset = [];
            ch.addDataSet = function (chart, label, color, date, data, createDataset, datasetReady) {
              chart.data.labels.push(label);
              if (createDataset==1){
                newDataset = {
                  backgroundColor: [],
                  borderColor: [],
                  data:[]
                };
              }
              newDataset.backgroundColor.push(color);
              newDataset.borderColor.push(color);
              newDataset.data.push(data);
      
              if (datasetReady){
                chart.data.datasets.push(newDataset);
                chart.update();
              }  
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
                            xAxes: [{
                                type: 'time',
                            }]
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
