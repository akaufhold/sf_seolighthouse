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
            var lhc;
            let newDataset = [];
            /* DECLARATION CHARTS VARS */
            var ChartObj;
            var chartColors = {
                fcp: 'rgb(255, 99, 132)', fcps: 'rgb(255, 99, 132)',
                si:  'rgb(255, 159, 64)', sis:  'rgb(255, 159, 64)',
                lcp: 'rgb(255, 205, 86)', lcps: 'rgb(255, 205, 86)',
                tti: 'rgb(75, 192, 192)', ttis: 'rgb(75, 192, 192)',
                tbt: 'rgb(54, 162, 235)', tbts: 'rgb(54, 162, 235)',
                cls: 'rgb(153, 102, 255)', clss: 'rgb(153, 102, 255)',
                os:  'rgb(40,167,69)'
            };

            /* INIT */
            ch.init = function () {
                var data;
                var entries = $(".chartsEntries").find(".entry"); 

                lhc         = document.getElementById('lighthouseChart').getContext('2d');
                ch.createCharts(lhc,ch.getChartType());
                ch.entriesToDataset($(entries),ch.getDevice(),ch.getChartValueType());

                $(".tx_sfseolighthouse").find(".custom-radio").find("label").click(function(){
                    $(".tx_sfseolighthouse").find(".custom-radio").find("label").removeClass("active");
                    $(this).addClass("active");
                });
                $(".device,#type-select,#valueType-select").on("change",function(){
                    ch.showChart($(entries));
                });
            }
            ch.getDevice = function(){
                return $("input[name='device']:checked").val().toLowerCase();
            }
            ch.getChartType = function(){
                return $("#type-select").find("option:selected").val();
            }
            ch.getChartValueType = function(){
                return $("#valueType-select").find("option:selected").val();
            }
            ch.showChart = function(entriesIn){
                ChartObj.destroy();
                ch.createCharts(lhc,ch.getChartType());
                ch.entriesToDataset(entriesIn,ch.getDevice(),ch.getChartValueType());
            }
            ch.entriesToDataset = function(entriesIn, deviceIn, valueTypeIn){
                var entryValues         	    = {};
                var entryiteration              = 1;
                var entryCounter                = ch.countEntries($(entriesIn), deviceIn);
                var lastDate;
                //console.log($(entriesIn));
                $(entriesIn).each(function(key,value) {
                    data                        = $(this).data();
                    device                      = data.device.toLowerCase();
                    /* DATES */
                    var crdate                  = data.crdate;
                    var timestamp               = data.timestamp;
                    var date                    = new Date(timestamp * 1000);
                    var dateLabel               = ("0" + date.getDate()).slice(-2)+"."+("0" + (date.getMonth() + 1)).slice(-2)+"."+date.getFullYear();
                    var dateLabelTime           = dateLabel +" "+ date.getHours()+":"+('0'+date.getMinutes()).slice(-2);

                    if (device==deviceIn){
                        console.log(entryCounter+" Ite:"+entryiteration);
                        ch.addDataLabel(ChartObj,dateLabelTime);
                        if (valueTypeIn=="value"){
                            /* AUDIT VALUES */
                            entryValues.fcp         = data.fcp; 
                            entryValues.si          = data.si;
                            entryValues.lcp         = data.lcp;
                            entryValues.tti         = data.tti;
                            entryValues.tbt         = data.tbt/1000;
                            entryValues.cls         = data.cls;
                        }else if(valueTypeIn=="score"){
                            /* AUDIT SCORES */
                            entryValues.fcps        = data.fcps;
                            entryValues.sis         = data.sis;
                            entryValues.lcps        = data.lcps;
                            entryValues.ttis        = data.ttis;
                            entryValues.tbts        = data.tbts;
                            entryValues.clss        = data.clss;
                            entryValues.os          = data.os; 
                        }
                        var auditIteration          = 0;
                        $.each(entryValues, function(auditKey,auditVal){
                            ch.addDataSet (ChartObj, auditKey, chartColors[auditKey], date, auditVal, ((entryiteration==1) ? '1' : '0'), ((entryiteration==entryCounter) ? '1' : '0'), auditIteration);
                            auditIteration++;
                        });
                        entryiteration++;
                    }
                    lastDate = dateLabel;
                });
            }

            ch.countEntries = function(entriesCountable, deviceCountable){
                var entryCounter = 0;
                $(entriesCountable).each(function() {
                    deviceSub  = $(this).data().device.toLowerCase();
                    if (deviceSub==deviceCountable){
                        entryCounter++;
                    }
                });
                return entryCounter;
            }

            ch.addDataLabel = function(chartIn,dateLabel){
                chartIn.config.data.labels.push(dateLabel);
            }

            /* DATA */
            ch.addDataSet = function (chartIn, label, color, date, data, createDataset, datasetReady, index) {
                if (createDataset==1){
                    if (index==0){
                        newDataset = [];
                    }
                    newDataset[index] = {
                        backgroundColor: [],
                        borderColor: [],
                        data:[]
                    };
                    newDataset[index].label             = label; 
                    newDataset[index].backgroundColor   = color;
                    newDataset[index].borderColor       = color;
                }
                newDataset[index].data.push({x:date,y:data});
                //console.log(datasetReady);
                if (datasetReady==1){
                    chartIn.data.datasets.push(newDataset[index]);
                    chartIn.update();
                }
            }

            /* CREATE CHARTS*/
            ch.createCharts = function (chartElement, typeChart) {
                ChartObj = new Chart(chartElement, {
                    type: typeChart,
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
        var lighthouseCharts = new LighthouseCharts();
        lighthouseCharts.init(); 
    });
});
