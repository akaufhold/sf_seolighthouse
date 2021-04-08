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
            var lhcd; 
            var lhcm;   
            var datasetArray, labelArray, type, period;
            var labelArray = [];
            var datasetArray= [];

            /* DECLARATION CHARTS COLORS */
            var chartColors = {
                fcp: 'rgb(255, 99, 132)',
                si:  'rgb(255, 159, 64)',
                lcp: 'rgb(255, 205, 86)',
                tti: 'rgb(75, 192, 192)',
                tbt: 'rgb(54, 162, 235)',
                cls: 'rgb(153, 102, 255)',
                os:  'rgb(231,233,237)'
            };

            /* DECLARATION CHARTS VARS */
            var desktopChart, mobileChart;

            /* INIT */
            ch.init = function () {
                var data;
                var entries = $(".chartsEntries").find(".entry"); 
                period      = $("#period-select").find("option:selected").val();
                type        = $("#type-select").find("option:selected").val();
                lhcd        = document.getElementById('lighthouseChart_desktop').getContext('2d');
                lhcm        = document.getElementById('lighthouseChart_mobile').getContext('2d');

                ch.createCharts(lhcd,type,"desktop");
                ch.createCharts(lhcm,type,"mobile");
                
                $("#lighthouseChart_mobile").css({"display":"none"});

                ch.entriesToDataset($(entries));

                $(".device").on("change",function(){
                    type = $(this).val().toLowerCase();
                    $(".lighthouseCharts").css({display:"none"});
                    $("#lighthouseChart_"+type).css({display:"block"});
                });

                $("#type-select").on("change",function(){
                    // console.log($(this).val());
                    type = $(this).val().toLowerCase();
                    desktopChart.destroy();
                    ch.createCharts(lhcd,type,"desktop");
                    mobileChart.destroy();
                    ch.createCharts(lhcm,type,"mobile");
                });

                /*$("#period-select").on("change",function(){
                    // console.log($(this).val());
                    period = $(this).val().toLowerCase(); 
                    chart.destroy();
                    chart = ch.createCharts(lhcd,type,"desktop");
                    chart2.destroy();
                    chart2 = ch.createCharts(lhcm,type,"mobile");
                });*/
            }

            ch.entriesToDataset = function(entriesIn){
                var entryValues     = {};
                var entryiteration  = 1;
                var auditIteration;
                var entryCounter    = $(entriesIn).length;
                $(entriesIn).each(function(key,value) {
                    data        = $(this).data();
                    /* AUDIT VALUES */
                    entryValues.fcp         = data.fcp;
                    entryValues.si          = data.si;
                    entryValues.lcp         = data.lcp;
                    entryValues.tti         = data.tti;
                    entryValues.tbt         = data.tbt;
                    entryValues.cls         = data.cls;
                    entryValues.os          = data.os;

                    /* DATES */
                    var crdate      = data.crdate;
                    var timestamp   = data.timestamp;
                    var date        = new Date(timestamp * 1000);
                    var day         = date.getDay();
                    var month       = date.getMonth();
                    var year        = date.getFullYear();
                    var hours       = date.getHours();
                    var minutes     = "0" + date.getMinutes();
                    var seconds     = "0" + date.getSeconds();
                    var dateLabel   = day+"."+month+"."+year;

                    if (entryiteration==entryCounter){
                        auditIteration = 0;
                        $.each(entryValues, function(auditKey,auditVal){
                            console.log(auditIteration);
                            /* ADD AUDIT VALUES TO DESKTOP CHART / ADD COMPLETE DATASET */
                            ch.addDataSet (desktopChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 1, auditIteration);
                            /* ADD AUDIT VALUES TO MOBILE CHART / ADD COMPLETE DATASET */
                            ch.addDataSet (mobileChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 1, auditIteration);
                            auditIteration++;
                        });
                    }else{
                        auditIteration = 0;
                        $.each(entryValues, function(auditKey,auditVal){
                            /* ADD AUDIT VALUES TO DESKTOP CHART / ADD TO EXISTING DATASET */
                            ch.addDataSet (desktopChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 0, auditIteration);
                            /* ADD AUDIT VALUES TO MOBILE CHART / ADD TO EXISTING DATASET */
                            ch.addDataSet (mobileChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 0, auditIteration);
                            auditIteration++;
                        });
                    }
                    /*
                    console.log(day+"."+month+"."+year+" "+hours+":"+minutes+":"+seconds);
                    */  
                    entryiteration++;
                });
            }
        

            /* DATA */
            var newDataset = [];
            ch.addDataSet = function (chartIn, label, color, dateLabel, date, data, createDataset, datasetReady, index) {
                chartIn.data.labels.push(date);
                console.log(label+" "+color+" "+dateLabel+" "+date+" "+data+" "+createDataset+" "+datasetReady);
                if (createDataset==1){
                    newDataset[index] = {backgroundColor: [],borderColor: [],data:[]};
                    //console.log(index+" "+newDataset[index].data);
                }
                newDataset[index].label = label; 
                newDataset[index].backgroundColor = color;
                newDataset[index].borderColor = color;
                newDataset[index].data.push({
                                            x:date,
                                            y:data
                                            });
        
                if (datasetReady){
                    console.log(newDataset);
                    chartIn.data.datasets.push(newDataset[index]);
                    chartIn.update();
                }
            }

            /* CREATE CHARTS*/
            ch.createCharts = function (chartIn, typeIn, target) {
                //console.log(chartIn); 
                if (target=="desktop"){
                    desktopChart = new Chart(chartIn, {
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
                }else{
                    mobileChart = new Chart(chartIn, {
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
                }
            }
        }
        
        var lighthouseCharts = new LighthouseCharts();
        lighthouseCharts.init();
        
    });
});
