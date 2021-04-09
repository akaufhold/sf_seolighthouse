require.config({
  paths: {
    moment: "//cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min",
    chartjs: "//cdn.jsdelivr.net/npm/chart.js@3.0.2/dist/chart.min",
    roughjs: "//cdn.jsdelivr.net/npm/roughjs@3.1.0/dist/rough"
  },
  shim: {
    chartjs: {
      exports: "C"
    },
  },
});

requirejs(['jquery'], function ($) {
  require(["moment", "chartjs","roughjs"], function(moment, chart) {
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
        const individualAudits  = [
            ["Overall Score","os"]
        ];
        /* DECLARATION VARS */
        var scoreChart;
        var auditsChart;

        var lh = this;
        /* LIGHTHOUSE */
        var OutputAuditName, OutputAuditsHtml;
        var url = [];
        /* PROGRESS BAR */
        var pb = $(".progressBar");
        var cc = $(".progressBar").find(".counterContainer");
        /* CHARTS */
        var labelArray = [];
        var datasetArray= [];
        var oac,mac;
        lh.init = function () {
            $('.getLighthouseData').on('click', function(){
              var thisis = $(this);
              /* PREFILL TARGET INPUT */
              $("#target").val($('.newLighthouseStatistics').attr("id"));
              /* SAVE CHARTS CANVAS */
              oac = document.getElementById('overallChart').getContext('2d');
              mac = document.getElementById('mainAuditsChart').getContext('2d');
              /* SETTING DATA FORMAT */
              var format = 'html'; 
              if($(this).data('format')){
                  format = $(this).data('format');
              } 
              /* CALL LIGHTHOUSE REQUEST FUNCTION */
              lh.fetchLighthouseData(lh.getDevice(thisis));
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
      lh.fetchLighthouseData = function(targetUrl) {
        /* PROGRESS BAR */
        lh.pbReset();
        lh.setPbStatus("progress");
        /* FETCH LIGHTHOUSE DATA */
        fetch(targetUrl)
          .then(response => response.json())
          .then(json => {
            if (!json.hasOwnProperty("error")){
              OutputAuditsHtml = "";
              var speed, score, displayValue, screenshot, displayMode, chartVal, description, descriptionMore, descriptionLink;
              const lighthouse = json.lighthouseResult;
              const auditResults = lighthouse.audits;
              const overallScore = lighthouse.categories.performance.score;

              const filterMore          = /\[((?:(?!\\]).)+)/igm;
              const filterLink          = /\(((?:(?!\\)).\)+)/igm; 

              $("#os").val(overallScore);
              lh.pbReset();
              lh.setPbStatus("success");
              
              /* CREATE CHARTS OUTPUT */
              var missingScore = 1-overallScore;
              var speedColor = lh.getSpeedColor(overallScore);
              lh.createCharts(oac,"pie","score");
              lh.addDataSet(scoreChart,"Score",speedColor,overallScore*100,1,0);
              lh.addDataSet(scoreChart,"","rgba(255, 255, 255, 1)",missingScore*100,0,1);
  
              lh.createCharts(mac,"bar","audits");
              scoreChart.options.plugins.title.display = true;
              scoreChart.options.plugins.title.text    = "Overall Score";

              /* MAIN AUDIT PROPERTIES */
              var mainCounter = 1;
              mainAudits.forEach(function(value){
                  displayValue      = auditResults[value[0]].displayValue;
                  score             = auditResults[value[0]].score;
                  speed             = lh.getSpeedClass(score);
                  color             = lh.getSpeedColor(score);
                  OutputAuditName   = value[0].replace("-"," ");
                  OutputAuditsHtml += '<li class="list-group-item" id="list-'+value[1]+'">';
                  OutputAuditsHtml +=     lh.addSpan("label",OutputAuditName);
                  OutputAuditsHtml +=     lh.addSpan("value", displayValue);
                  OutputAuditsHtml +=     lh.addSpan("score "+speed,score);
                  OutputAuditsHtml += '</li>';
                  $("#"+value[1]).val(parseFloat(displayValue.replace(',', '.')));

                  /* ADD CHARTS DATA TO ARRAY */
                  chartVal = score*100;
                  if (mainAudits.length==mainCounter){
                    lh.addDataSet(auditsChart,OutputAuditName,color,chartVal,((mainCounter==1) ? '1' : '0'),1);
                  }else{
                    lh.addDataSet(auditsChart,OutputAuditName,color,chartVal,((mainCounter==1) ? '1' : '0'),0);
                  }
                  mainCounter++; 
              });
              $(".list-main").html(OutputAuditsHtml);
              OutputAuditsHtml = "";
              /* ADDTIONAL AUDIT PROPERTIES*/
              Object.keys(auditResults).sort().forEach(function(key){
                description         = auditResults[key].description;
                
                /*descriptionMore     = lh.regexMatch(description,filterMore);
                descriptionLink     = lh.regexMatch(description,filterLink);
                description = ((descriptionMore!=undefined)?lh.replaceSub(description,descriptionMore,""):description);
                description = ((descriptionLink!=undefined)?lh.replaceSub(description,descriptionLink,""):description);*/

                displayMode         = String(auditResults[key].scoreDisplayMode);
                if (auditResults[key].hasOwnProperty("details.screenshot")){
                    screenshot = auditResults[key].details.screenshot;
                }
                displayValue            = auditResults[key].displayValue;
                score                   = auditResults[key].score;
                if (displayMode!="notApplicable"){
                  OutputAuditName       = key.replace("-"," ");
                  OutputAuditsHtml      += '<li class="list-group-item" id="'+key+'">';
                  OutputAuditsHtml      += lh.addSpan("label",((description) ? chevronDown : '')+OutputAuditName);
                  if (displayValue!=undefined){
                      OutputAuditsHtml  += lh.addSpan("value",displayValue);
                  }
                  if (score){
                      speed             =  lh.getSpeedClass(score);
                      OutputAuditsHtml  += lh.addSpan("score "+speed,score);
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
              lh.pbReset();
              lh.setPbStatus("error");
              $(pb).find(".errorMessage").append(": "+json.error.message.substring(0, 130));
              lh.fetchLighthouseData(lh.getDevice($('.getLighthouseData')));
            }
          });
      } 
      /* GET URL DEPENDING ON DEVICE */
      lh.getDevice = function(radioInput){
          url['Mobile'] = $(radioInput).data('mobile');
          url['Desktop'] = $(radioInput).data('desktop');
          var device = $("input[name=device]").filter(":checked");
          var deviceVal = $(device).val();
          $("#device").val(deviceVal);
          return url[deviceVal];
      }
      /* CSS CLASS FOR SPEED STATUS COLOR */
      lh.getSpeedClass = function(scoreIn){
          if (scoreIn < 0.5){speedOut = 'slow';} 
          else if (scoreIn < 0.9){speedOut = 'average';} 
          else if (scoreIn <= 1){speedOut = 'fast';}
          return speedOut;
      }
      /* COLOR FOR SPEED STATUS */
      lh.getSpeedColor = function(scoreIn){
          if (scoreIn < 0.5){speedOut = '#d8000c';} 
          else if (scoreIn < 0.9){speedOut = '#ffa400';} 
          else if (scoreIn <= 1){speedOut = '#28a745';}
          return speedOut;
      }
      /* PROGRESS BAR */
      lh.pbReset = function(){
          $(cc).find(".counterAmount").css({width:"0%"});
          $(cc).removeClass("progress").removeClass("error").removeClass("success");
          $(cc).find(".counterTitle").find(".errorMessage").html("error");
      }
      lh.setPbStatus = function(status){
          $(cc).addClass(status);
          if ((status=="success") || (status=="error"))
              $(cc).find(".counterAmount").css({width:"100%"});
      }
      /* HTML OUTPUT */
      lh.addSpan = function(htmlClass,value){
          var htmlOut  = '<span class="'+htmlClass+'">';
          htmlOut      +=    value;
          htmlOut      += '</span>';
          return htmlOut;
      }
      /* CHARTS */
      lh.createCharts = function (chartIn,typeIn,target) {
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
      var newDataset = [];
      lh.addDataSet = function (chart, label, color, data, createDataset, datasetReady) {
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

      lh.replaceSub = function(string,search,replace) {
        return string.replace(search,replace); 
      }

      lh.regexMatch = function(string, regex) {
        let m;
        while ((m = regex.exec(string)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            return m[0];
            /*m.forEach((match, groupIndex) => {
                //console.log(`Found match, group ${groupIndex}: ${match}`);
                return match;
            });*/
        }
      }
    }

    var lighthouseData = new LighthouseData();
    lighthouseData.init();
    
  });  
});
