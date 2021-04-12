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
            var desktopValueChart, desktopScoreChart, mobileValueChart, mobileScoreChart;

            /* DECLARATION CHARTS COLORS */
            var chartColors = {
                fcp: 'rgb(255, 99, 132)',
                si:  'rgb(255, 159, 64)',
                lcp: 'rgb(255, 205, 86)',
                tti: 'rgb(75, 192, 192)',
                tbt: 'rgb(54, 162, 235)',
                cls: 'rgb(153, 102, 255)',
                fcps: 'rgb(255, 99, 132)',
                sis:  'rgb(255, 159, 64)',
                lcps: 'rgb(255, 205, 86)',
                ttis: 'rgb(75, 192, 192)',
                tbts: 'rgb(54, 162, 235)',
                clss: 'rgb(153, 102, 255)',
                os:  'rgb(40,167,69)'
            };

            /* INIT */
            ch.init = function () {
                var data;
                var entries = $(".chartsEntries").find(".entry"); 
                period      = $("#period-select").find("option:selected").val();
                type        = $("#type-select").find("option:selected").val();

                /* VALUES SCORES */
                lhcd        = document.getElementById('lighthouseChart_desktop').getContext('2d');
                lhcm        = document.getElementById('lighthouseChart_mobile').getContext('2d');
                ch.createCharts(lhcd,type,"desktop","value");
                ch.createCharts(lhcm,type,"mobile","value");

                /* CHARTS SCORES */                
                lhcds       = document.getElementById('lighthouseChart_desktopScore').getContext('2d');
                lhcms       = document.getElementById('lighthouseChart_mobileScore').getContext('2d');
                ch.createCharts(lhcds,type,"desktop","score");
                ch.createCharts(lhcms,type,"mobile","score");

                $("#lighthouseChart_mobile,#lighthouseChart_mobileScore").css({"display":"none"});

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
                    desktopValueChart.destroy();
                    mobileValueChart.destroy();
                    desktopScoreChart.destroy();
                    mobileScoreChart.destroy();
                    //console.log(device.toLowerCase());
                    ch.createCharts(lhcd,type,device);
                    ch.showChart(device);
                });

                $(".tx_sfseolighthouse").find(".custom-radio").find("label").click(function(){
                    $(".tx_sfseolighthouse").find(".custom-radio").find("label").removeClass("active");
                    $(this).addClass("active");
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
                var entryScores     = {};
                var entryiteration              = 1;
                var auditIteration;
                var entryCounter                = $(entriesIn).length;

                $(entriesIn).each(function(key,value) {
                    data        = $(this).data();

                    /* AUDIT VALUES */
                    entryValues.fcp         = data.fcp;
                    entryValues.si          = data.si;
                    entryValues.lcp         = data.lcp;
                    entryValues.tti         = data.tti;
                    entryValues.tbt         = data.tbt/1000;
                    entryValues.cls         = data.cls;

                    entryScores.fcps        = data.fcps;
                    entryScores.sis         = data.sis;
                    entryScores.lcps        = data.lcps;
                    entryScores.ttis        = data.ttis;
                    entryScores.tbts        = data.tbts;
                    entryScores.clss        = data.clss;
                    entryScores.os          = data.os; 

                    device                  = data.device;
                    /* DATES */
                    var crdate      = data.crdate;
                    var timestamp   = data.timestamp;
                    var date        = new Date(timestamp * 1000);
                    var dateLabel   = ("0" + date.getDate()).slice(-2)+"."+("0" + (date.getMonth() + 1)).slice(-2)+"."+date.getFullYear();

                    if (entryiteration==entryCounter){
                        auditIterationDesktop   = 0;
                        auditIterationMobile    = 0;
                        $.each(entryValues, function(auditKey,auditVal){
                            /* ADD AUDIT VALUES TO DESKTOP CHART / ADD COMPLETE DATASET */
                            if(device=="Desktop"){
                                ch.addDataSet (desktopValueChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 1, auditIterationDesktop, "desktop","values");
                                auditIterationDesktop++;
                            }
                            /* ADD AUDIT VALUES TO MOBILE CHART / ADD COMPLETE DATASET */
                            if(device=="Mobile"){
                                ch.addDataSet (mobileValueChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 1, auditIterationMobile, "mobile","values");
                                auditIterationMobile++;
                            }
                        });
                        auditIterationDesktop   = 0;
                        auditIterationMobile    = 0;
                        $.each(entryScores, function(auditKey,auditVal){
                            /* ADD AUDIT VALUES TO DESKTOP CHART / ADD COMPLETE DATASET */
                            if(device=="Desktop"){
                                ch.addDataSet (desktopScoreChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 1, auditIterationDesktop, "desktop","scores");
                                auditIterationDesktop++;
                            }
                            /* ADD AUDIT VALUES TO MOBILE CHART / ADD COMPLETE DATASET */
                            if(device=="Mobile"){
                                ch.addDataSet (mobileScoreChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 1, auditIterationMobile, "mobile","scores");
                                auditIterationMobile++;
                            }
                        });
                    }else{
                        auditIterationDesktop   = 0;
                        auditIterationMobile    = 0;
                        $.each(entryValues, function(auditKey,auditVal){                          
                            /* ADD AUDIT VALUES TO DESKTOP CHART / ADD TO EXISTING DATASET */
                            if(device=="Desktop"){
                                ch.addDataSet (desktopValueChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 0, auditIterationDesktop, "desktop","values");
                                auditIterationDesktop++;
                            }
                            /* ADD AUDIT VALUES TO MOBILE CHART / ADD TO EXISTING DATASET */
                            if(device=="Mobile"){
                                ch.addDataSet (mobileValueChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 0, auditIterationMobile, "mobile","values");
                                auditIterationMobile++;
                            }
                        });
                        auditIterationDesktop   = 0;
                        auditIterationMobile    = 0;
                        $.each(entryScores, function(auditKey,auditVal){
                            /* ADD AUDIT VALUES TO DESKTOP CHART / ADD COMPLETE DATASET */
                            if(device=="Desktop"){
                                ch.addDataSet (desktopScoreChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 0, auditIterationDesktop, "desktop","scores");
                                auditIterationDesktop++;
                            }

                            /* ADD AUDIT VALUES TO MOBILE CHART / ADD COMPLETE DATASET */
                            if(device=="Mobile"){
                                ch.addDataSet (mobileScoreChart, auditKey, chartColors[auditKey], dateLabel, date, auditVal, ((entryiteration==1) ? '1' : '0'), 0, auditIterationMobile, "mobile","scores");
                                auditIterationMobile++;
                            }
                        });
                    }
                    entryiteration++;
                });
            }

            /* DATA */
            ch.addDataSet = function (chartIn, label, color, dateLabel, date, data, createDataset, datasetReady, index, device, chartType) {
                if ((index==0) && (datasetReady==0)){
                    chartIn.data.labels.push(dateLabel);
                    console.log("dataCreate: "+createDataset+" datasetReady: "+datasetReady+" "+chartType+" Index:"+index+" Device:"+device);
                }
                if (createDataset==1){
                    if (index==0){
                        if(typeof newDataset[device] === 'undefined') {
                            newDataset[device] = [];
                        } 
                        newDataset[device][chartType] = [];
                        //console.log(newDataset);
                    }
                    //console.log(newDataset); 
                    newDataset[device][chartType][index] = {
                        backgroundColor: [],
                        borderColor: [],
                        data:[]
                    };
                    newDataset[device][chartType][index].label             = label; 
                    newDataset[device][chartType][index].backgroundColor   = color;
                    newDataset[device][chartType][index].borderColor       = color;
                }
                //console.log(newDataset);
                newDataset[device][chartType][index].data.push({x:date,y:data});
                if (datasetReady==1){
                    //console.log(chartIn);
                    chartIn.data.datasets.push(newDataset[device][chartType][index]);
                    chartIn.update();
                }
            }

            /* CREATE CHARTS*/
            ch.createCharts = function (chartIn, typeChart, target, typeData) {
                if (target=="desktop"){
                    if (typeData=="value"){
                        desktopValueChart = new Chart(chartIn, {
                            // The type of chart we want to create
                            type: typeChart,
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
                                    },
                                    y: {
                                        ticks: {
                                        beginAtZero: true
                                        }
                                    }
                                }
                            }
                        });
                    }else if(typeData=="score"){
                        desktopScoreChart = new Chart(chartIn, {
                            // The type of chart we want to create
                            type: typeChart,
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
                                    },
                                    y: {
                                        ticks: {
                                        beginAtZero: true
                                        }
                                    }
                                }
                            }
                        });
                    }
                        
                }else{
                    if (typeData=="value"){
                        mobileValueChart = new Chart(chartIn, {
                            // The type of chart we want to create
                            type: typeChart,
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
                                    },
                                    y: {
                                        ticks: {
                                        beginAtZero: true
                                        }
                                    }
                                }
                            }
                        });
                    }else if(typeData=="score"){
                        mobileScoreChart = new Chart(chartIn, {
                            // The type of chart we want to create
                            type: typeChart,
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
                                    },
                                    y: {
                                        ticks: {
                                        beginAtZero: true
                                        }
                                    }
                                }
                            }
                        });
                    }
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
