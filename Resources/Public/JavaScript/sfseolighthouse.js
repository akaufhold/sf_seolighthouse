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
    /* REQUIRED ICONS */
    var chevronDown;
    requirejs(['TYPO3/CMS/Backend/Icons'], function(Icons) {
      Icons.getIcon('actions-chevron-down', Icons.sizes.small).done(function(icon) {
        chevronDown = icon;
      });
    });
    //var color = Chart.helpers.color;
    var LighthouseData = function () {
        /* DECLARATION AUDIT CONSTANTS */
        const mainAudits        = [
            ["first-contentful-paint", "fcp",0.15,"rgba(255, 159, 64, 1)"],
            ["speed-index", "si",0.15,"rgba(255, 99, 132, 1)"],
            ["interactive", "tti",0.25,"rgba(255, 205, 86, 1)"],
            ["largest-contentful-paint", "lcp",0.15,"rgba(75, 192, 192, 1)"],
            ["total-blocking-time", "tbt",0.25,"rgba(54, 162, 235, 1)"],
            ["cumulative-layout-shift", "cls",0.05,"rgba(153, 102, 255, 1)"]
        ];
        const environmentAudits = [
            ["benchmarkIndex", "bi"],["dom-size", "ds"]
        ];
        const individualAudits  = [
            ["Overall Score","os"]
        ];
        /* DECLARATION VARS */
        var scoreChart;
        var auditsChart;

        var me = this;
        /* LIGHTHOUSE */
        var OutputAuditName, OutputAuditsHtml;
        var url = [];
        /* PROGRESS BAR */
        var pb = $(".progressBar");
        var cc = $(".progressBar").find(".counterContainer");
        /* CHARTS */
        var labelArray = [];
        var datasetArray= [];

        me.init = function () {
            $('.getLighthouseData').on('click', function(){
              var thisis = $(this);
              /* PROGRESS BAR */
              me.pbReset();
              me.setPbStatus("progress");
              /* PREFILL TARGET INPUT */
              $("#target").val($('.newLighthouseStatistics').attr("id"));
              /* SETTING DATA FORMAT */
              var format = 'html'; 
              if($(this).data('format')){
                  format = $(this).data('format');
              } 
              /* CALL LIGHTHOUSE REQUEST FUNCTION */
              me.fetchLighthouseData(me.getDevice(thisis));
          });
          /* DEVICE RADIO BUTTON ON CHANGE */
          $("input[type=radio][name=device]").change(function(){
            var deviceName = $(this).val();
            var targetUrl = $(".getLighthouseData").data(deviceName.toLowerCase());
            $(".targetUrl").html(targetUrl);
          });
          /* ACTIVE LIST ENTRY ON CLICK */
          $(".list-lighthouse").on("click","li",function(){
            var listItem = $(this);
            $(".list-lighthouse").find("li").removeClass("active");
            if (!$(listItem).hasClass("active")){
              $(listItem).addClass("active");
            }
          });
      };
      /* FETCH API REQUEST FUNCTION */
      me.fetchLighthouseData = function(targetUrl) {
        fetch(targetUrl)
          .then(response => response.json())
          .then(json => {
            if (!json.hasOwnProperty("error")){
              OutputAuditsHtml = "";
              var speed, score, displayValue, screenshot, displayMode, chartVal;
              const lighthouse = json.lighthouseResult;
              const auditResults = lighthouse.audits;
              const overallScore = lighthouse.categories.performance.score; 
          
              me.pbReset();
              me.setPbStatus("success");
              /* CREATE CHARTS OUTPUT */
              var oac = document.getElementById('overallChart').getContext('2d');
              me.createCharts(oac,"pie","score");

              var missingScore = 1-overallScore;
              me.addDataSet(scoreChart,"Score","rgba(255, 159, 64, 1)",[overallScore*100,missingScore*100]);
              
              //Score Missing","rgba(255, 255, 255, 1)",);

              var mac = document.getElementById('mainAuditsChart').getContext('2d');
              me.createCharts(mac,"bar","audits");

              /* MAIN AUDIT PROPERTIES */
              mainAudits.forEach(function(value){
                  displayValue      = auditResults[value[0]].displayValue;
                  score             = auditResults[value[0]].score;
                  speed             = me.getSpeedClass(score);
                  color             = value[3];
                  OutputAuditName   = value[0].replace("-"," ");
                  OutputAuditsHtml += '<li class="list-group-item" id="list-'+value[1]+'">';
                  OutputAuditsHtml +=     me.addSpan("label",OutputAuditName);
                  OutputAuditsHtml +=     me.addSpan("value", displayValue);
                  OutputAuditsHtml +=     me.addSpan("score "+speed,score);
                  OutputAuditsHtml += '</li>';
                  $("#"+value[1]).val(parseFloat(displayValue.replace(',', '.')));
                  /* ADD CHARTS DATA TO ARRAY */
                  chartVal = parseFloat(displayValue.replace(',', '.'))*100;
                  me.addDataSet(auditsChart,OutputAuditName,color,score);
              });
              $(".list-main").html(OutputAuditsHtml);
              OutputAuditsHtml = "";
              /* ADDTIONAL AUDIT PROPERTIES*/
              Object.keys(auditResults).sort().forEach(function(key){
                displayMode         = String(auditResults[key].scoreDisplayMode);
                if (auditResults[key].hasOwnProperty("details.screenshot")){
                    screenshot = auditResults[key].details.screenshot;
                }
                displayValue            = auditResults[key].displayValue;
                score                   = auditResults[key].score;
                if (displayMode!="notApplicable"){
                  OutputAuditName       = key.replace("-"," ");
                  OutputAuditsHtml      += '<li class="list-group-item" id="'+key+'">';
                  OutputAuditsHtml      += me.addSpan("label",((auditResults[key].description) ? chevronDown : '')+OutputAuditName);
                  if (displayValue!=undefined){
                      OutputAuditsHtml  += me.addSpan("value",displayValue);
                  }
                  if (score){
                      speed             =  me.getSpeedClass(score);
                      OutputAuditsHtml  += me.addSpan("score "+speed,score);
                  }
                  if (auditResults[key].description){  
                      OutputAuditsHtml  += "<span class='description'>"+((auditResults[key].title)?"<b>"+auditResults[key].title+"</b>":"")+auditResults[key].description;
                      if (auditResults[key].hasOwnProperty("details.screenshot")){
                          OutputAuditsHtml += screenshot;
                      }
                      OutputAuditsHtml += "</span>";
                  }
                  OutputAuditsHtml +=  '</li>';
                }
              });

              $(".list-additional").html(OutputAuditsHtml);
              $(".newLighthouseStatistics").css({display:"block"});
              if (!$(cc).find(".totalTime").length)
                $(cc).find(".counterTitle").append("<span class='totalTime'>"+(lighthouse.timing.total/1000).toFixed(2)+" s</span>");
              else
                $(cc).find(".totalTime").html((lighthouse.timing.total/1000).toFixed(2)+" s");
            }else{
              /* ERROR HANDLING */
              me.pbReset();
              me.setPbStatus("error");
              $(pb).find(".errorMessage").append(": "+json.error.message.substring(0, 130));
              me.fetchLighthouseData(me.getDevice($('.getLighthouseData')));
              me.pbReset();
            }
          });
      } 
      /* GET URL DEPENDING ON DEVICE */
      me.getDevice = function(radioInput){
          url['Mobile'] = $(radioInput).data('mobile');
          url['Desktop'] = $(radioInput).data('desktop');
          var device = $("input[name=device]").filter(":checked");
          var deviceVal = $(device).val();
          $("#device").val(deviceVal);
          return url[deviceVal];
      }
      /* CSS CLASS FOR SPEED STATUS COLOR */
      me.getSpeedClass = function(scoreIn){
          if (scoreIn < 0.5){speedOut = 'slow';} 
          else if (scoreIn < 0.9){speedOut = 'average';} 
          else if (scoreIn <= 1){speedOut = 'fast';}
          return speedOut;
      }
      /* PROGRESS BAR */
      me.pbReset = function(){
          $(cc).find(".counterAmount").css({width:"0%"});
          $(cc).removeClass("progress").removeClass("error").removeClass("success");
          $(cc).find(".counterTitle").find(".errorMessage").html("error");
      }
      me.setPbStatus = function(status){
          $(cc).addClass(status);
          if ((status=="success") || (status=="error"))
              $(cc).find(".counterAmount").css({width:"100%"});
      }
      /* HTML OUTPUT */
      me.addSpan = function(htmlClass,value){
          var htmlOut  = '<span class="'+htmlClass+'">';
          htmlOut      +=    value;
          htmlOut      += '</span>';
          return htmlOut;
      }
      /* CHARTS */
      me.createCharts = function (chartIn,typeIn,target) {
        if (target=="score"){
          scoreChart = new Chart(chartIn, {
            type: typeIn,
            data: {
              datasets: [{ 
                      data: [] 
                      }]
            },
            options: {
              plugins:{
                legend:{
                  display:false,
                }
              },
              scales: {

              }
            }
        });
        }else if(target="audits"){
          auditsChart = new Chart(chartIn, {
            type: typeIn,
            data: {
              datasets: [{ 
                      data: [] 
                      }]
            },
            options: {
              plugins:{
                legend:{
                  display:false,
                }
              },
              scales: {

              }
            }
          });
        }
      }

      me.addDataSet = function (chart, label, color, data) {
        chart.data.labels.push(label);
        var newDataset = {
          label: label,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
          data:[]
        };
        if (Array.isArray(data)){
          data.forEach(function(key,val){
            newDataset.data.push(val);
          })
        }
        else{
          newDataset.data.push(data);
        } 
        //console.log(newDataset);
        chart.data.datasets.push(newDataset);
        chart.update();
      }
    }

    var lighthouseData = new LighthouseData();
    lighthouseData.init();
    
  });  
});
