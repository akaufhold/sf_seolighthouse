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
      Icons.getIcon('content-widget-chart-bar', Icons.sizes.default).done(function(icon) {
        chartsBar = icon;
      });
    });
    //var color = Chart.helpers.color;
    var LighthouseData = function () {
        /* DECLARATION AUDIT CONSTANTS */
        const mainAudits        = [
          ["accessibility", "acs"],
          ["best-practices", "bps"],
          ["performance", "pes"],
          ["pwa", "pwas"],
          ["seo", "seos"]
        ];
        const mainAuditsPerformance        = [
          ["first-contentful-paint", "fcp",0.15,"rgba(255, 159, 64, 1)"],
          ["speed-index", "si",0.15,"rgba(255, 99, 132, 1)"],
          ["interactive", "tti",0.25,"rgba(255, 205, 86, 1)"],
          ["largest-contentful-paint", "lcp",0.15,"rgba(75, 192, 192, 1)"],
          ["total-blocking-time", "tbt",0.25,"rgba(54, 162, 235, 1)"],
          ["cumulative-layout-shift", "cls",0.05,"rgba(153, 102, 255, 1)"]
        ];
        /* DECLARATION VARS */
        var lh = this;
        /* LIGHTHOUSE */
        var OutputAuditName, OutputAuditsHtml, OutputPerformanceAuditsHtml, OutputAdditionalAuditsHtml;
        var categoryUrl;

        /* PROGRESS BAR */
        var pb = $(".progressBar");
        var cc = $(".progressBar").find(".counterContainer");

        lh.init = function () {
          categoryUrl =  lh.getCategoryList();
          lh.addCategoriesToTargetUrl(categoryUrl);
          //console.log(mainAudits);
          $('.getLighthouseData').on('click', function(){
              /* PREFILL TARGET INPUT */
              $("#target").val($('.newLighthouseStatistics').attr("id"));

              /* INIT CHARTS CANVAS */
              window.oacacc = document.getElementById('overallChartAccessibilty').getContext('2d');
              window.oacbes = document.getElementById('overallChartBestPractices').getContext('2d');
              window.oacper = document.getElementById('overallChartPerformance').getContext('2d');
              window.oacpwa = document.getElementById('overallChartPwa').getContext('2d');
              window.oacseo = document.getElementById('overallChartSeo').getContext('2d');
              window.pac    = document.getElementById('performanceAuditsChart').getContext('2d');

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

          $(".performanceMenu").find("a").click(function(){
            var idTarget = $(this).attr("id").split("show")[1].charAt(0).toLowerCase()+$(this).attr("id").split("show")[1].substring(1);
            $(".performanceAudits").css({display:"none"});
            if (idTarget=="performanceAuditCharts"){
                $(".performanceListHeader").css({display:"none"});
            }else{
                $(".performanceListHeader").css({display:"block"});
            }
            $("."+idTarget).css({display:"block"});
          }) 

          /* ACTIVE LIST ENTRY ON CLICK */
          $(".list-lighthouse").on("click","li",function(){
              var listItem = $(this);
              $(".list-lighthouse").find("li").removeClass("active");
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
          });
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
                    auditCategories = lighthouse.categories;
              var   lhCategoryList  = lh.getCategoryList().split(",");
              var   lhCategoryListLength = $(lhCategoryList).length;
              lh.pbReset();
              lh.setPbStatus("success");
              $(".list-audits,.list-Addtional-Audits,.list-performance-audits").html("");
              /* SET DEVICE HIDDEN FIELD */
              $("#device").val(lh.getDevice().charAt(0).toUpperCase() + lh.getDevice().slice(1));
              OutputAuditsHtml  = "<ul class='list-lighthouse list-score list-main list-group'>";

              $(lhCategoryList).each(function(catIt,category){
                  catIt++;
                  var curCategory   = category.toLowerCase().replace("_","-");
                  var curChart      = "oac"+curCategory.substring(0,3);
                  var overallScore  = lighthouse.categories[curCategory].score;

                  /* CREATE CHARTS OUTPUT */
                  var missingScore  = 1-overallScore;
                  var speedColor    = lh.getSpeedColor(overallScore);
                  lh.createCharts(window[curChart],"pie",curCategory,curCategory+" Score");

                  lh.addDataSet(window[curCategory+"Chart"],"Score",speedColor,overallScore*100,1,0);
                  lh.addDataSet(window[curCategory+"Chart"],"","rgba(255, 255, 255, 1)",missingScore*100,0,1);
  
                  OutputAuditsHtml    += lh.getMainAudits(curCategory,auditCategories,catIt,lhCategoryListLength);

                  /* PERFORMANCE AUDIT PROPERTIES */
                  if (category=="PERFORMANCE"){
                      lh.createCharts(window.pac,"bar","audits");
                      OutputPerformanceAuditsHtml  = ""; 
                      OutputPerformanceAuditsHtml  += "<ul class='list-lighthouse list-lighthouse-"+curCategory+" list-group'>"+lh.getPerformanceAudits(mainAuditsPerformance,auditResults)+"</ul>";
                      $(".list-performance-audits").append(OutputPerformanceAuditsHtml);
                      $(".performanceAuditCharts").css({display:"none"});
                      $(".performanceHeadline").css({display:"block"});
                      $(".performanceListHeader").css({display:"block"});
                  }
                  /* ADDTIONAL AUDIT PROPERTIES*/
                  OutputAdditionalAuditsHtml  =  "";
                  OutputAdditionalAuditsHtml  += "<ul class='list-lighthouse list-additional-"+curCategory+" list-group'><li class='list-additional-header list-group-item'><span class='label'>"+auditCategories[curCategory].title+"</span></li>";
                  OutputAdditionalAuditsHtml  += lh.getAddionalAudits(auditResults);
                  OutputAdditionalAuditsHtml  += "</ul>";
                  $(".list-Addtional-Audits").append(OutputAdditionalAuditsHtml);
                  $(".newLighthouseStatistics").css({display:"block"});
              })
              OutputAuditsHtml  += "</ul>";
              $(".list-audits").append(OutputAuditsHtml);
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
        lh.getMainAudits = function(auditItem,auditResult,mainIteration,mainCounter){
          var speed, score, displayValue, chartVal;
          var htmlAuditsOut = "";
          $(mainAudits).each(function(key,value){
            if (value[0]==auditItem){
              score             = auditResult[auditItem].score;
              speed             = lh.getSpeedClass(score);
              color             = lh.getSpeedColor(score);
              OutputAuditName   = auditResult[auditItem].title.replace("-"," ");
              OutputAuditsHtml  = "";
              htmlAuditsOut     +='<li class="list-group-item" id="list-'+auditItem+'">';
              htmlAuditsOut     +=    lh.addSpan("label",OutputAuditName);
              htmlAuditsOut     +=    lh.addSpan("score "+speed,score);
              htmlAuditsOut     +='</li>';
              console.log(value);
              //console.log(mainAudits[auditItem]);
              $("#"+value[1]).val(score);
            }

          })

          /* ADD CHARTS DATA TO ARRAY */
          /*chartVal = score*100;
          if (mainCounter==mainIteration){
            lh.addDataSet(window.auditsChart,OutputAuditName,color,chartVal,((mainIteration==1) ? '1' : '0'),1);
          }else{
            lh.addDataSet(window.auditsChart,OutputAuditName,color,chartVal,((mainIteration==1) ? '1' : '0'),0);
          }*/
          return htmlAuditsOut;
      }
      /* GET PERFORMANCE AUDITS */
      lh.getPerformanceAudits = function(auditItemList,auditResults){
          var speed, score, displayValue, chartVal;
          var mainCounter = 1;
          var htmlPerformanceOut="";
          auditItemList.forEach(function(value){
            displayValue          = auditResults[value[0]].displayValue;
            score                 = auditResults[value[0]].score;
            speed                 = lh.getSpeedClass(score);
            color                 = lh.getSpeedColor(score);
            OutputAuditName       = value[0].replace("-"," ");
            htmlPerformanceOut    += '<li class="list-group-item" id="list-'+((value[1])?value[1]:"")+'">';
            htmlPerformanceOut    +=     lh.addSpan("label",OutputAuditName);
            htmlPerformanceOut    +=     lh.addSpan("value", displayValue);
            htmlPerformanceOut    +=     lh.addSpan("score "+speed,score);
            htmlPerformanceOut    += '</li>';
            $("#"+value[1]).val(parseFloat(displayValue.replace(',', '.')));
            $("#"+value[1]+"s").val(parseFloat(score)); 
            /* ADD CHARTS DATA TO ARRAY */
            chartVal = score*100;
            if (mainAuditsPerformance.length==mainCounter){
              lh.addDataSet(window.auditsChart,OutputAuditName,color,chartVal,((mainCounter==1) ? '1' : '0'),1);
            }else{
              lh.addDataSet(window.auditsChart,OutputAuditName,color,chartVal,((mainCounter==1) ? '1' : '0'),0);
            }
            mainCounter++; 
          });
          return htmlPerformanceOut;
      }
      /* GET ADDITIONAL AUDITS */
      lh.getAddionalAudits = function(auditResults){
          var speed, score, displayValue, screenshot, displayMode, description;
          var htmlAdditionalOut = "";

          Object.keys(auditResults).sort().forEach(function(key){
            description                        = auditResults[key].description;
            displayMode                        = String(auditResults[key].scoreDisplayMode);
            if (auditResults[key].hasOwnProperty("details.screenshot")){
                screenshot = auditResults[key].details.screenshot;
            }
            displayValue                       = auditResults[key].displayValue;
            score                              = auditResults[key].score;
            if (displayMode!="notApplicable"){
              OutputAuditName                  = key.replace("-"," ");
              htmlAdditionalOut                += '<li class="list-group-item" id="'+key+'">';
              htmlAdditionalOut                += lh.addSpan("label",((description) ? chevronDown : '')+OutputAuditName);
              if (displayValue!=undefined){
                  htmlAdditionalOut            += lh.addSpan("value",displayValue);
              }
              if (score){
                  speed                        =  lh.getSpeedClass(score);
                  htmlAdditionalOut            += lh.addSpan("score "+speed,score);
              }
              if (auditResults[key].description){  
                htmlAdditionalOut              += "<span class='description'>"+((auditResults[key].title)?"<b>"+auditResults[key].title+"</b>":"")+auditResults[key].description;
                  if (auditResults[key].hasOwnProperty("details.screenshot")){
                    htmlAdditionalOut          += screenshot;
                  }
                  htmlAdditionalOut            += "</span>";
              }
              htmlAdditionalOut                +=  '</li>';
            }
          });
          return htmlAdditionalOut;
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
      lh.createCharts = function (chartIn,typeIn,target,titleText) {
          var targetChart = target+"Chart";
          window[targetChart] = new Chart(chartIn, {
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
                },
                title:{
                  display:true,
                  text:titleText,
                }
              },
              responsive: true,
              maintainAspectRatio: false,
              scales: {

              }
            }
        });
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
