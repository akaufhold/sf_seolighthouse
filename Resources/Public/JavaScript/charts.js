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
            /* DECLARATION CHARTS VARS */
            let newDataset = [];
            var lhc,data,ChartObj;
            var chartColors = {
                acs: 'rgb(255, 99, 132)', fcp: 'rgb(255, 99, 132)', fcps: 'rgb(255, 99, 132)',
                bps: 'rgb(255, 159, 64)', si:  'rgb(255, 159, 64)', sis:  'rgb(255, 159, 64)',
                pes: 'rgb(255, 205, 86)', lcp: 'rgb(255, 205, 86)', lcps: 'rgb(255, 205, 86)',
                pwas: 'rgb(75, 192, 192)', tti: 'rgb(75, 192, 192)', ttis: 'rgb(75, 192, 192)',
                seos: 'rgb(54, 162, 235)', tbt: 'rgb(54, 162, 235)', tbts: 'rgb(54, 162, 235)',
                cls: 'rgb(153, 102, 255)', clss: 'rgb(153, 102, 255)'
            };
            /* INIT */
            ch.init = function () {
                var entries = $(".chartsEntries").find(".entry"); 

                lhc         = document.getElementById('lighthouseChart').getContext('2d');
                ch.createCharts(lhc,ch.getChartType());
                ch.entriesToDataset($(entries),ch.getDevice(),ch.getChartValueType());

                $(".tx_sfseolighthouse").find(".custom-radio").find("label").click(function(){
                    $(this).parents(".container-control").find("label").removeClass("active");
                    $(this).addClass("active");
                });
                $(".device,.type-select,.valueType-select").on("change",function(){
                    ch.showChart($(entries));
                });
            }
            ch.getDevice = function(){
                return $("input[name='device']:checked").val().toLowerCase();
            }
            ch.getChartType = function(){
                return $("input[name='type-select']:checked").val();
            }
            ch.getChartValueType = function(){
                return $("input[name='valueType-select']:checked").val();
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
                //console.log(valueTypeIn);
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
                        //console.log(valueTypeIn);
                        var auditIteration      = 0;
                        entryValues             = ch.getEntryValues(data, valueTypeIn);
                        ch.addDataLabel(ChartObj,dateLabelTime);     
                        $.each(entryValues, function(auditKey,auditVal){
                            var labelChart = $(".entryLabels").attr("data-label-"+auditKey);
                            console.log(labelChart);
                            ch.addDataSet (ChartObj, labelChart, chartColors[auditKey], date, auditVal, ((entryiteration==1) ? '1' : '0'), ((entryiteration==entryCounter) ? '1' : '0'), auditIteration);
                            auditIteration++;
                        });
                        entryiteration++;
                    }
                    lastDate = dateLabel;
                });
            }
            ch.getEntryValues = function(dataIn, vti){
                var entVal = {};
                var dataType;
                if (vti=="value"){
                    /* AUDIT VALUES */
                    $.each(dataIn, function(dataKey,dataVal){
                        if (dataKey.match(/^value/)!=null){
                            dataType = dataKey.split("value")[1].toLowerCase();
                            if (dataType!="tbt"){
                                entVal[dataType] = dataVal;
                            }else{
                                entVal[dataType] = dataVal/1000;
                            }
                        }
                    });
                }else if(vti=="score"){
                    /* AUDIT SCORES */
                    $.each(dataIn, function(dataKey,dataVal){
                        if (dataKey.match(/^score/)!=null){
                            dataType = dataKey.split("score")[1].toLowerCase();
                            entVal[dataType] = dataVal;
                        }
                    });
                }else if(vti=="catscore"){
                    /* AUDIT SCORES */
                    $.each(dataIn, function(dataKey,dataVal){
                        if (dataKey.match(/^catscore/)!=null){
                            dataType = dataKey.split("catscore")[1].toLowerCase();
                            entVal[dataType] = dataVal;
                        }
                    });
                }
                return entVal;
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
                if (datasetReady==1){
                    chartIn.data.datasets.push(newDataset[index]);
                    chartIn.update();
                }
            }
            ch.createCharts = function (chartElement, typeChart) {
                ChartObj = new Chart(chartElement, {
                    type: typeChart,
                    options: {
                        responsive: true,
                        scales:{
                            x: {
                                distribution: 'linear',
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
