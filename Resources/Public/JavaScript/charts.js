require.config({
    paths: {
      moment: "//cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min",
      chart: "//cdn.jsdelivr.net/npm/chart.js@3.0.2/dist/chart.min"
    },
    shim: {
      chartjs: {
        exports: "C"
      },
    },
});

requirejs(['jquery'], function ($) {
    require(["moment","chart"], function(moment, chart) {
        var LighthouseCharts = function () {
            var ch = this;
            var lhcd, lhcm, type, period, device;
            var labelArray = [];
            var datasetArray= [];
            let newDataset = [];

            /* DECLARATION CHARTS VARS */
            var desktopChart, mobileChart;

            /* DECLARATION CHARTS COLORS */
            var chartColors = {
                fcp: 'rgb(255, 99, 132)',
                si:  'rgb(255, 159, 64)',
                lcp: 'rgb(255, 205, 86)',
                tti: 'rgb(75, 192, 192)',
                tbt: 'rgb(54, 162, 235)',
                cls: 'rgb(153, 102, 255)',
                os:  'rgb(40,167,69)'
            };

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
                    device = $(this).val().toLowerCase();
                    ch.showChart(device);
                });

                $("#type-select").on("change",function(){
                    // console.log($(this).val());
                    device = $("input[name='device']:checked").val().toLowerCase();
                    console.log(device);
                    type = $(this).val().toLowerCase();
                    desktopChart.destroy();
                    mobileChart.destroy();
                    //console.log(device.toLowerCase());
                    ch.createCharts(lhcd,type,device);
                    ch.showChart(device);
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
                    entryValues.tbt         = data.tbt/1000;
                    entryValues.cls         = data.cls;
                    entryValues.os          = data.os;
                    device                  = data.device;
                    /* DATES */
                    var crdate      = data.crdate;
                    var timestamp   = data.timestamp;
                    var date        = new Date(timestamp * 1000);
                    var dateLabel   = date.getDate()+"."+date.getMonth()+1+"."+date.getFullYear();

                    if (entryiteration==entryCounter){
                        auditIteration = 0;
                        $.each(entryValues, function(auditKey,auditVal){
                            /* ADD AUDIT VALUES TO DESKTOP CHART / ADD COMPLETE DATASET */
                            if(device=="Desktop")
                                ch.addDataSet (desktopChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 1, auditIteration, "desktop");
                            /* ADD AUDIT VALUES TO MOBILE CHART / ADD COMPLETE DATASET */
                            if(device=="Mobile")
                                ch.addDataSet (mobileChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 1, auditIteration, "mobile");
                            
                            auditIteration++;
                        });
                    }else{
                        auditIteration = 0;
                        $.each(entryValues, function(auditKey,auditVal){                          
                            /* ADD AUDIT VALUES TO DESKTOP CHART / ADD TO EXISTING DATASET */
                            if(device=="Desktop")
                                ch.addDataSet (desktopChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 0, auditIteration, "desktop");
                            /* ADD AUDIT VALUES TO MOBILE CHART / ADD TO EXISTING DATASET */
                            if(device=="Mobile")
                                ch.addDataSet (mobileChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 0, auditIteration, "mobile");
                            auditIteration++;
                        });
                    }
                    entryiteration++;
                });
            }

            /* DATA */
            ch.addDataSet = function (chartIn, label, color, dateLabel, date, data, createDataset, datasetReady, index, device) {
                if (index==0)
                    chartIn.data.labels.push(dateLabel);
                if (createDataset==1){
                    if (index==0)
                        newDataset[device] = [];

                    newDataset[device][index] = {
                        backgroundColor: [],
                        borderColor: [],
                        data:[]
                    };
                    newDataset[device][index].label             = label; 
                    newDataset[device][index].backgroundColor   = color;
                    newDataset[device][index].borderColor       = color;
                }
                newDataset[device][index].data.push({x:date,y:data});
                if (datasetReady==1){
                    chartIn.data.datasets.push(newDataset[device][index]);
                    chartIn.update();
                }
            }

            /* CREATE CHARTS*/
            ch.createCharts = function (chartIn, typeIn, target) {
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
                            responsive: true,
                            scales:{
                                x: {
                                    /*type: 'time',
                                    stacked: true,*/
                                    // type: 'time',
                                    distribution: 'linear',
                                    // stacked: true,
                                    time: { 
                                        displayFormats: { 
                                            month: 'MM',
                                        },
                                        unit: 'day',
                                    },
                                    ticks: {
                                        display: true,
                                        autoskip:true,
                                        stepSize: 1,
                                        fixedStepSize: 1,
                                    },
                                    gridLines: {
                                        display: false
                                    }
                                }
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
                            responsive: true,
                            scales:{
                                x: {
                                    /*type: 'time',
                                    stacked: true,*/
                                    // type: 'time',
                                    distribution: 'linear',
                                    // stacked: true,
                                    time: { 
                                        displayFormats: { 
                                            month: 'MM', 
                                        },
                                        unit: 'day',
                                    },
                                    ticks: {
                                        display: true,
                                        autoskip:true,
                                        stepSize: 1,
                                        fixedStepSize: 1,
                                    },
                                    gridLines: {
                                        display: false
                                    }
                                }
                            }
                        }
                    });
                }
            }
            ch.showChart = function(type){
                $(".lighthouseCharts").css({display:"none"});
                $("#lighthouseChart_"+type).css({display:"block"});
            }
        }
    
        var lighthouseCharts = new LighthouseCharts();
        lighthouseCharts.init();
        
    });
});
