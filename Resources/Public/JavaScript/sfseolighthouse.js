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
        const mainAuditsPerformance        = [
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
        var categoryUrl;

        /* PROGRESS BAR */
        var pb = $(".progressBar");
        var cc = $(".progressBar").find(".counterContainer");
        /* CHARTS */
        var oac,mac;
        lh.init = function () {
          categoryUrl =  lh.getCategoryList();
          lh.addCategoriesToTargetUrl(categoryUrl);

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
              lh.fetchLighthouseData(lh.getTargetUrl());
          });

          /* DEVICE RADIO BUTTON ON CHANGE */
          $("input[type=radio][name=device]").change(function(){
              $(".tx_sfseolighthouse").find(".custom-radio").find("label").removeClass("active");
              $(this).parents(".custom-radio").find("label").addClass("active");
              deviceUrl = lh.getDeviceUrl(lh.getDevice());
              lh.setTargetUrl(deviceUrl);
              categoryUrl =  lh.getCategoryList();
              lh.addCategoriesToTargetUrl(categoryUrl);
          });

          /* CATEGORY CLICK EVENT */  
          $(".categoriesCheck").find(".custom-check").find("label").click(function(){
              var curVal = $(this).parents(".custom-check").find(".form-check-input").val();
              if (curVal == "all"){
                  $(".form-check-label").removeClass("active");
              }
              else{
                  $("input[value='all']").parents(".custom-check").find(".form-check-label").removeClass("active");
              }
              if ($(this).hasClass("active")){
                  $(this).removeClass("active");
              }
              else{
                  $(this).addClass("active");
              }  
              categoryUrl =  lh.getCategoryList();
              lh.addCategoriesToTargetUrl(categoryUrl);

          });

          $(".auditButtons").find("a").click(function(){
              var idTarget = $(this).attr("id").split("show")[1].charAt(0).toLowerCase()+$(this).attr("id").split("show")[1].substring(1);
              $("."+idTarget).css({display:"block"});
          })

          /* ACTIVE LIST ENTRY ON CLICK */
          $(".list-main").on("click","li",function(){
              var listItem = $(this);
              $(".list-main").find("li").removeClass("active");
              if (!$(listItem).hasClass("active")){
                  $(listItem).addClass("active");
              }
          });
      };
      /* SET TARGET URL */
      lh.setTargetUrl = function(targetUrl){
        $(".targetUrl").html(targetUrl);
      }

      /* GET CATEGORY URL PARAMS */
      lh.getCategoryList = function(){
        var targetCategory = "";
        category = $(".categoriesCheck").find(".form-check-label.active");
        $(category).each(function(key,label){
            val = $(label).parents(".custom-check").find(".category").val().toUpperCase();
            if (val!="ALL"){
                targetCategory += val;
                targetCategory += (((key+1)!=category.length)?",":"");
            }
            else{
              allCategory = $(".categoriesCheck").find(".form-check-label").not(".active");
              $(allCategory).each(function(key,label){
                val = $(label).parents(".custom-check").find(".category").val().toUpperCase();
                targetCategory += val;
                targetCategory += (((key+1)!=allCategory.length)?",":"");
              });
            }
        });
        return targetCategory;
      }

      /* ADD CATEGORY TO URL */
      lh.addCategoriesToTargetUrl = function(categoriesUrl){
          var curTargetUrl =""; 
          var categoryUrl = categoriesUrl.split(",");
          $(categoryUrl).each(function(key,category){
              curTargetUrl = lh.addUrlParam(curTargetUrl,"category",category);
          })
          lh.setTargetUrl(lh.getDeviceUrl(lh.getDevice())+curTargetUrl);
      }

      /* ADD URL PARAM */
      lh.addUrlParam = function(search, key, val){
        var newParam = key + '=' + val, 
            params = '&' + newParam;
        if (search) {
            params = search.replace(new RegExp('([?&])' + val + '[^&]*'), '$1' + newParam);
            params += '&' + newParam;
        }
        return params;
      };
      /* GET TARGET URL */
      lh.getTargetUrl = function(){
          return $(".targetUrl")[0].innerText;
      }
      /* SET TARGET URL */
      lh.setTargetUrl = function(targetUrlInput){
          $(".targetUrl").html(targetUrlInput);
      }
      /* GET DEVICE */
      lh.getDevice = function(){  
          return $(".deviceRadio").find(".active").parents(".custom-radio").find(".device").val();
      }
      /* GET URL DEPENDING ON DEVICE */
      lh.getDeviceUrl = function(deviceTarget){
          return $(".getLighthouseData").data(deviceTarget);
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
              const lighthouse      = json.lighthouseResult, 
                    auditResults    = lighthouse.audits;
              var   lhCategoryList  = lh.getCategoryList().split(",");
              $(lhCategoryList).each(function(key,category){
                  var overallScore  = lighthouse.categories[category.toLowerCase()].score;
                  $("#os").val(overallScore);
                  lh.pbReset();
                  lh.setPbStatus("success");
                  /* CREATE CHARTS OUTPUT */
                  var missingScore  = 1-overallScore;
                  var speedColor    = lh.getSpeedColor(overallScore);
                  lh.createCharts(oac,"pie","score");
                  lh.addDataSet(scoreChart,"Score",speedColor,overallScore*100,1,0);
                  lh.addDataSet(scoreChart,"","rgba(255, 255, 255, 1)",missingScore*100,0,1);
                  lh.createCharts(mac,"bar","audits");
                  scoreChart.options.plugins.title.display = true;
                  scoreChart.options.plugins.title.text    = "Overall Score";
                  /* MAIN AUDIT PROPERTIES */
                  OutputAuditsHtml  = "<ul class='list-lighthouse list-lighthouse-"+category+" list-main list-group'>"+lh.getMainAudits(mainAuditsPerformance,auditResults)+"</ul>";
                  $(".list-Audits").append(OutputAuditsHtml);
                  /* ADDTIONAL AUDIT PROPERTIES*/
                  OutputAuditsHtml  = "";
                  OutputAuditsHtml  = "<ul class='list-lighthouse list-additional-"+category+" list-group'>"+lh.getAddionalAudits(auditResults)+'</ul>';
                  $(".list-Addtional-Audits").append(OutputAuditsHtml);
                  $(".newLighthouseStatistics").css({display:"block"});
              })
              
              lh.setTotalTime(lighthouse.timing.total);
            }else{
              /* ERROR HANDLING */
              lh.errorHandling(json.error.message);
            }
          });
      } 
      /* ERROR HANDLING */
      lh.errorHandling = function(errorMessage){
          lh.pbReset();
          lh.setPbStatus("error");
          $(pb).find(".errorMessage").append(": "+errorMessage.substring(0, 130));
          lh.fetchLighthouseData(lh.getTargetUrl());
      }
      /* SET TOTAL TIME 4 PROGRESS BAR */
      lh.setTotalTime = function(timer){
        if (!$(cc).find(".totalTime").length)
          $(cc).find(".counterTitle").append("<span class='totalTime'>"+(timer/1000).toFixed(2)+" s</span>");
        else
          $(cc).find(".totalTime").html((timer/1000).toFixed(2)+" s");
      }
      /* GET MAIN AUDITS */
      lh.getMainAudits = function(auditCategory,auditResults){
          var speed, score, displayValue, chartVal;
          var mainCounter = 1;
          auditCategory.forEach(function(value){
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
            $("#"+value[1]+"s").val(parseFloat(score)); 
            /* ADD CHARTS DATA TO ARRAY */
            chartVal = score*100;
            if (mainAuditsPerformance.length==mainCounter){
              lh.addDataSet(auditsChart,OutputAuditName,color,chartVal,((mainCounter==1) ? '1' : '0'),1);
            }else{
              lh.addDataSet(auditsChart,OutputAuditName,color,chartVal,((mainCounter==1) ? '1' : '0'),0);
            }
            mainCounter++; 
          });
          return OutputAuditsHtml;
      }
      /* GET ADDITIONAL AUDITS */
      lh.getAddionalAudits = function(auditResults){
          var speed, score, displayValue, screenshot, displayMode, description;
          Object.keys(auditResults).sort().forEach(function(key){
            description         = auditResults[key].description;
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
          return OutputAuditsHtml;
      }
      /* HTML SPAN OUTPUT */
      lh.addSpan = function(htmlClass,value){
        var htmlOut  = '<span class="'+htmlClass+'">';
        htmlOut      +=    value;
        htmlOut      += '</span>';
        return htmlOut;
      }
      /* CSS CLASS FOR SPEED STATUS COLOR */
      lh.getSpeedClass = function(scoreIn){
        if (scoreIn < 0.5){speedOut = 'slow';} 
        else if (scoreIn < 0.9){speedOut = 'average';} 
        else if (scoreIn <= 1){speedOut = 'fast';}
        return speedOut;
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
    }

    var lighthouseData = new LighthouseData();
    lighthouseData.init();
    
  });  
});
