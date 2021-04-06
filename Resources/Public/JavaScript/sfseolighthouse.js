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

    var LighthouseData = function () {
        /* DECLARATION AUDIT CONSTANTS */
        const mainAudits        = [
            ["first-contentful-paint", "fcp",0.15],
            ["speed-index", "si",0.15],
            ["interactive", "tti",0.25],
            ["largest-contentful-paint", "lcp",0.15],
            ["total-blocking-time", "tbt",0.25],
            ["cumulative-layout-shift", "cls",0.05]
        ];
        const environmentAudits = [
            ["benchmarkIndex", "bi"],["dom-size", "ds"]
        ];
        const individualAudits  = [
            ["Overall Score","os"]
        ];
        /* DECLARATION VARS */
        var me = this;
        /* LIGHTHOUSE */
        var OutputAuditName;
        var OutputAuditsHtml;
        var url = [];
        /* PROGRESS BAR */
        var pb = $(".progressBar");
        var cc = $(".progressBar").find(".counterContainer");
        /* CHARTS */
        /*var labelArray = [];
        var datasetArray = [];*/

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
              me.pbReset();
              me.setPbStatus("success");
              /* MAIN AUDIT PROPERTIES */
              mainAudits.forEach(function(value){
                  displayValue      = auditResults[value[0]].displayValue;
                  score             = auditResults[value[0]].score;
                  speed             = me.getSpeedClass(score);
                  OutputAuditName   = value[0].replace("-"," ");
                  OutputAuditsHtml += '<li class="list-group-item" id="list-'+value[1]+'">';
                  OutputAuditsHtml +=     me.addSpan("label",OutputAuditName);
                  OutputAuditsHtml +=     me.addSpan("value", displayValue);
                  OutputAuditsHtml +=     me.addSpan("score "+speed,score);
                  OutputAuditsHtml += '</li>';
                  $("#"+value[1]).val(parseFloat(displayValue.replace(',', '.')));
                  /* ADD CHARTS DATA TO ARRAY */
                  labelArray.push(OutputAuditName); 
                  chartVal = parseFloat(score)*value[2]*100;
                  //console.log(displayValue+" "+value[2]," "+chartVal);
                  /*datasetArray = [{
                    data: [0, 10, 5, 2, 20, 30, 45]
                  }]*/
                  datasetArray.push(parseInt(chartVal));
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
              console.log(labelArray);
              console.log(datasetArray);
              var ctx = document.getElementById('mainAuditsChart').getContext('2d');
              me.createCharts(ctx);

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
      datasetArray = [ 14, 15, 25, 14, 25, 2 ];
      me.createCharts = function (ctxIn) {
        const chart = new Chart(ctxIn, {
            // The type of chart we want to create
            type: "doughnut",

            // The data for our dataset
            data: {
                labels: labelArray,
                datasets: datasetArray
            },


            // Configuration options go here
            options: {
  
            }
        });
      }
    }

    var lighthouseData = new LighthouseData();
    lighthouseData.init();
    
  });  
});
