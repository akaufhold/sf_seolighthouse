import '../Scss/backend.scss';
import Chart from 'chart.js/auto';

requirejs(['jquery'], function ($) {
    require(["moment","chart.js","roughjs"], function(moment, chart) {
        let LighthouseCharts = function () {
            let ch = this;
            /* DECLARATION CHARTS letS */
            let newDataset = [];
            let lhc,data,ChartObj;
            let chartColors = {
                acs: 'rgb(46, 204, 113)', fcp: 'rgb(46, 204, 113)', fcps: 'rgb(46, 204, 113)',
                bps: 'rgb(52, 152, 219)', si:  'rgb(52, 152, 219)', sis:  'rgb(52, 152, 219)',
                pes: 'rgb(52, 73, 94)', lcp: 'rgb(52, 73, 94)', lcps: 'rgb(52, 73, 94)',
                pwas: 'rgb(155, 89, 182)', tti: 'rgb(155, 89, 182)', ttis: 'rgb(155, 89, 182)',
                seos: 'rgb(241, 196, 15)', tbt: 'rgb(241, 196, 15)', tbts: 'rgb(241, 196, 15)',
                cls: 'rgb(231, 76, 60)', clss: 'rgb(231, 76, 60)'
            };
            /* INIT */
            ch.init = function () {
                let entries = $(".chartsEntries").find(".entry"); 

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
                let entryValues         	    = {};
                let entryiteration              = 1;
                let entryCounter                = ch.countEntries($(entriesIn), deviceIn);
                //console.log($(entriesIn));
                let lastDate,device,data;
                $(entriesIn).each(function(key,value) {
                    data                        = $(this).data();
                    device                      = $(this).data("device").toLowerCase();
                    /* DATES */
                    let crdate                  = $(this).data("crdate");
                    let timestamp               = $(this).data("timestamp");
                    let date                    = new Date(timestamp * 1000);
                    let dateLabel               = ("0" + date.getDate()).slice(-2)+"."+("0" + (date.getMonth() + 1)).slice(-2)+"."+date.getFullYear();
                    let dateLabelTime           = dateLabel +" "+ date.getHours()+":"+('0'+date.getMinutes()).slice(-2);

                    if (device==deviceIn){
                        let auditIteration      = 0;
                        entryValues             = ch.getEntryValues(data, valueTypeIn); 
                        ch.addDataLabel(ChartObj,dateLabelTime);     
                        $.each(entryValues, function(auditKey,auditVal){
                            let labelChart = $(".entryLabels").attr("data-label-"+auditKey);
                            ch.addDataSet (ChartObj, labelChart, chartColors[auditKey], date, auditVal, ((entryiteration==1) ? '1' : '0'), ((entryiteration==entryCounter) ? '1' : '0'), auditIteration);
                            auditIteration++;
                        });
                        entryiteration++;
                    }
                    lastDate = dateLabel;
                });
            }
            ch.getEntryValues = function(dataIn, vti){
                let entVal = {};
                let dataType;
                if (vti=="value"){
                    /* PERFORMANCE VALUES */
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
                    /* PERFORMANCE SCORES */
                    $.each(dataIn, function(dataKey,dataVal){
                        if (dataKey.match(/^score/)!=null){
                            dataType = dataKey.split("score")[1].toLowerCase();
                            entVal[dataType] = dataVal;
                        }
                    });
                }else if(vti=="catscore"){
                    /* OVERALL SCORES */
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
                let entryCounter = 0;
                let deviceSub;
                $(entriesCountable).each(function() {
                    //console.log($(this).data("device"));
                    deviceSub  = $(this).data("device").toLowerCase();
                    //console.log($(this).data().device.toLowerCase());
                    if (deviceSub==deviceCountable){
                        entryCounter++;
                    }
                });
                return entryCounter;
            }
            ch.addDataLabel = function(chartIn,dateLabel){
                console.log(chartIn);
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
                if(typeof window[typeChart] !== "undefined"){
                    window[typeChart].destroy();
                }
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
                                    maxTicksLimit: 10
                                },
                                gridLines: {
                                    display: false
                                }
                            },
                            y: {
                                min: 0,
                                suggestedMin: 0,
                                beginAtZero: true,
                                ticks: {
                                    display: true,
                                }
                            }
                        }
                    }
                });
            }
        }
        let lighthouseCharts = new LighthouseCharts();
        lighthouseCharts.init();
    });
});
