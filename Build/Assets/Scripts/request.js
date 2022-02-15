import '../Scss/backend.scss';
import Chart from 'chart.js/auto';

/* function for sorting json object through child keys */
function sortKeys(o) {
  if (Array.isArray(o)) {
      return o.map(sortKeys)
  } else if (o instanceof Object) {
      var _ret = function() {
          var numeric = [];
          var nonNumeric = [];
          Object.keys(o).forEach(function(key) {
              if (/^(0|[1-9][0-9]*)$/.test(key)) {
                  numeric.push(+key)
              } else {
                  nonNumeric.push(key)
              }
          });
          return {
              v: numeric.sort(function(a, b) {
                  return a - b
              }).concat(nonNumeric.sort()).reduce(function(result, key) {
                  result[key] = sortKeys(o[key]);
                  return result
              }, {})
          }
      }();
      if (typeof _ret === "object") return _ret.v
  }
  return o
};

requirejs(['jquery'], function ($) {
  require(["moment", "chart.js","roughjs"], function(moment, chart) {
    
    /* REQUIRED ICONS */
    var chevronDown,
        chartsBar;
    requirejs(['TYPO3/CMS/Backend/Icons'], function(Icons) {
      Icons.getIcon('actions-chevron-down', Icons.sizes.small).done(function(icon) {
        chevronDown = icon;
      });
      Icons.getIcon('content-widget-chart-bar', Icons.sizes.default).done(function(icon) {
        chartsBar = icon;
      });
    });

    var LighthouseData = function () {
      var lh = this;
      /* BOOTSTRAP VERSION */
      var bsversion = $.fn.tooltip.Constructor.VERSION.charAt(0);
      /* LIGHTHOUSE */
      var OutputAuditName,
          OutputAuditsHtml,
          OutputPerformanceAuditsHtml,
          OutputAdditionalAuditsHtml,
          categoryUrl;
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
        
        lh.showAddionalAudits();

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
      };

      lh.showAddionalAudits = function(){
        $(".auditButtons").find("a").click(function(){
          var idTarget = $(this).attr("id").split("show")[1].charAt(0).toLowerCase()+$(this).attr("id").split("show")[1].substring(1);
          $("."+idTarget).css({display:"block"});
        })
      }

      lh.activeListClick = function(){
        $(".list-lighthouse").on("click","li",function(){
            var listItem = $(this);
            $(".list-lighthouse").find("li").removeClass("active");
            if (!$(listItem).hasClass("active")){
                $(listItem).addClass("active");
            }
        });
      }

      /* GET CATEGORY URL PARAMS */
      lh.getCategoryList = function(){
        var targetCategory = "";
        var category = $(".categoriesCheck").find(".form-check-label.active");
        
        $(category).each(function(key,label){
            var val = $(label).parents(".custom-check").find(".category").val().toUpperCase();
            if (val!="ALL"){
                $(".saveCharts").css({display:"none"});
                targetCategory += val;
                targetCategory += (((key+1)!=category.length)?",":"");
            }
            else{
              var allCategory = $(".categoriesCheck").find(".form-check-label").not(".active");
              $(".saveCharts").css({display:"block"});
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
          let speedOut;
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
      /* SET PROGRESS BAR STATUS */
      lh.setPbStatus = function(status){
          $(cc).addClass(status);
          if ((status=="success") || (status=="error"))
              $(cc).find(".counterAmount").css({width:"100%"});
      }
      /* CHANGE FIRST LETTER FROM STRING */
      lh.firstLetterUp = function(stringIn){
        return stringIn.charAt(0).toUpperCase() + stringIn.slice(1).toLowerCase();
      }
      /* FETCH API REQUEST */
      lh.fetchLighthouseData = function(targetUrl) {
        /* PROGRESS BAR */
        lh.pbReset();
        lh.setPbStatus("progress");

        /* ONLY FOR TESTING !!!!!!!!!!!!!!!*/
        targetUrl = "https://webpacktest.ddev.site/typo3conf/ext/sf_seolighthouse/Resources/Public/Json/runPagespeed.json";

        /* FETCH LIGHTHOUSE DATA */
        fetch(targetUrl)
          .then(response => response.json())
          .then(json => {
            if (!json.hasOwnProperty("error")){
              const lighthouse      = json.lighthouseResult, 
                    auditResults    = lighthouse.audits,
                    auditScreenshots= auditResults['screenshot-thumbnails'],
                    auditCategories = lighthouse.categories;
              var   lhCategoryList  = lh.getCategoryList().split(",");
              var   lhCategoryListLength = $(lhCategoryList).length;

              lh.pbReset();
              lh.setPbStatus("success");
              $(".list-audits,.list-Addtional-Audits,.list-performance-audits").html("");
              /* SET DEVICE HIDDEN FIELD */
              $("#device").val(lh.firstLetterUp(lh.getDevice()));
              OutputAuditsHtml  = '<ul class="list-lighthouse list-score list-main list-group">';

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

                  /* OVERALL AUDIT PROPERTIES */
                  OutputAuditsHtml    += lh.getMainAudits(curCategory,auditCategories,catIt,lhCategoryListLength);

                  /* PERFORMANCE AUDIT PROPERTIES */
                  if (category=="PERFORMANCE"){
                      lh.createCharts(window.pac,"bar","audits");
                      OutputPerformanceAuditsHtml  = ''; 
                      OutputPerformanceAuditsHtml  += '<ul class="list-lighthouse list-lighthouse-'+curCategory+' list-group">'+lh.getPerformanceAudits(mainAuditsPerformance,auditResults)+'</ul>';
                      $(".list-performance-audits").append(OutputPerformanceAuditsHtml);
                      $(".performance,.performanceAudits,.performanceHeadline,.performanceListHeader").css({display:"block"});
                      $(".performanceAuditCharts").css({display:"none"});
                  }
                  /* ADDTIONAL AUDIT PROPERTIES*/
                  OutputAdditionalAuditsHtml  =  '';
                  OutputAdditionalAuditsHtml  += '<div class="label toggle list-lighthouse collapsed" aria-expanded="false" aria-controls="list-additional-'+curCategory+'" ';
                  
                  if (bsversion==4)
                    OutputAdditionalAuditsHtml     += 'data-toggle="collapse" data-target="#list-additional-'+curCategory+'"';
                  else if (bsversion==5)
                    OutputAdditionalAuditsHtml     +='data-bs-toggle="collapse" href="#list-additional-'+curCategory+'" role="button"';
                  
                  OutputAdditionalAuditsHtml  +='>'+auditCategories[curCategory].title+chevronDown+'</div>';
                  OutputAdditionalAuditsHtml  += '<ol class="collapse list-lighthouse list-group" id="list-additional-'+curCategory+'">';
                  OutputAdditionalAuditsHtml  +=    lh.getAdditionalAudits(auditResults,auditCategories[curCategory]);
                  OutputAdditionalAuditsHtml  += '</ol>';
                  $(".list-Addtional-Audits").append(OutputAdditionalAuditsHtml);
                  
                  $(".newLighthouseStatistics").css({display:"block"});
              })
              OutputAuditsHtml  += "</ul>";
              $(".list-audits").html("");
              $(".list-audits").append(OutputAuditsHtml);
              $(".list-Addtional-Audits").append(lh.getScreenshots(auditScreenshots));
              lh.setTotalTime(lighthouse.timing.total);
              lh.activeListClick();
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
          $(cc).find(".counterTitle").append('<span class="totalTime">'+(timer/1000).toFixed(2)+' s</span>');
        else
          $(cc).find(".totalTime").html((timer/1000).toFixed(2)+' s');
      }

        /* GET MAIN AUDITS */
      lh.getMainAudits = function(auditItem,auditResult,mainIteration,mainCounter){
          var speed, score, color;
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
              $("#"+value[1]).val(score);
            }
          })
          return htmlAuditsOut;
      }
      /* GET PERFORMANCE AUDITS */
      lh.getPerformanceAudits = function(auditItemList,auditResults){
          var speed, score, color, displayValue, chartVal;
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
 
      lh.determineDepthOfObject = function(object) {
        let depth = 0;
        if (object.children) {
          object.children.forEach(x => {
            let temp = this.determineDepthOfObject(x);
            if (temp > depth) {
              depth = temp;
            }
          })
        }
        return depth + 1;
      }

      /* GET ADDITIONAL AUDITS */
      lh.getAdditionalAudits = function(auditResults,auditResultsInCategory){
        var speed, score, displayValue, screenshot, type, displayMode, description, currentAudit;
        var htmlAdditionalOut = "";
        var auditRefs = auditResultsInCategory['auditRefs'];
        auditRefs = sortKeys(auditRefs);

        Object.keys(auditRefs).sort().forEach(function(key){
          type                               = auditResultsInCategory.auditRefs[key].id;
          currentAudit                       = auditResults[type];
          description                        = currentAudit.description;
          displayMode                        = String(currentAudit.scoreDisplayMode);

          if (currentAudit.hasOwnProperty("details.screenshot")){
               screenshot = currentAudit.details.screenshot;
          }
          displayValue                       = currentAudit.displayValue;
          if (currentAudit.score!=null){
            score                            = currentAudit.score;
          }

          //js error when including not applicable audits => maybe string too long 
          if (displayMode!="notApplicable"){ 
            OutputAuditName                  = type.replace("-"," ");
            htmlAdditionalOut                += '<li class="list-group-item" id="'+type+'">';
            htmlAdditionalOut                += lh.addSpan("label",((description) ? chevronDown : '')+OutputAuditName);
            if (displayValue!=undefined){
                htmlAdditionalOut            += lh.addSpan("value",displayValue);
            }
            if (score){
                speed                        =  lh.getSpeedClass(score);
                htmlAdditionalOut            += lh.addSpan("score "+speed,score);
            }
            if (currentAudit.description){  
              htmlAdditionalOut                 += '<span class="description">';
              if (currentAudit.title){
                htmlAdditionalOut               += "<b>";
                htmlAdditionalOut               += JSON.stringify(currentAudit.title.toString());
                htmlAdditionalOut               += "</b>";
              }
              htmlAdditionalOut                 += currentAudit.description;
              
              if (typeof currentAudit.details != "undefined"){
                htmlAdditionalOut               += lh.getAAD(currentAudit.details);
              }
              htmlAdditionalOut                 += '</span>';
            }
            htmlAdditionalOut                +=  '</li>';
          }
        });
        return htmlAdditionalOut;
      }

      /* GET DETAILS OF ADDITIONAL AUDITS */
      lh.getAAD = function(details){
        if (details.type=="table"){
          //console.log(lh.getAADTable(details));
          return lh.getAADTable(details);
        }
      }

      /* GET DETAILS OF ADDITIONAL AUDITS FROM TYPE TABLE*/
      lh.getAADTable = function(details){
        var out = '<table>';
        if (details.items.length){
          out += '<tr>';
          out += lh.getAADTableHeadings(details.headings);
          out += '</tr>';
          out += lh.getAADTableRecursive(details.items);
        }
        out += '</table>';
        return out;
      }

      /* GET HEADINGS OF ADDITIONAL AUDITS TABLE*/
      lh.getAADTableHeadings = function(headings){
        var out = '';
        headings.forEach(function(headeritem,headerindex){
          if (typeof headeritem.text!=undefined){
            out += '<th style="width:'+(100/headings.length)+'%">'+headeritem.text+'</th>';
          }
        });
        return out;
      }

      /* GET RECURSIVE TABLE CONTENTS */
      lh.getAADTableRecursive = function(detailItems){
        var index=0;
        var detailItemsOutput ='<tr>';
        //console.log(detailItems);
        detailItems.forEach(function(item,index){
          if ((lh.determineDepthOfObject(item)>0) && (Array.isArray(item))){
            lh.getAADTableRecursive(item);
          }
          else if (item?.subItems?.items){
            lh.getAADTableRecursive(item.subItems.items);
          }
          else if (typeof item!=undefined){
            if (item?.node){
              //detailItemsOutput += lh.getAADNodeTableWrap(item?.node);
            }
            else if (item?.relatedNode){
              //detailItemsOutput += lh.getAADNodeTableWrap(item?.relatedNode);
            }
            else {
              detailItemsOutput += lh.getAADNodeTableWrap(item);
              //detailItemsOutput += '<td>'+item+'</td>';
            }
          }
        });
        detailItemsOutput += '</tr>';
        return detailItemsOutput;
      }

      /* GET TABLE WRAPS */
      lh.getAADNodeTableWrap = function(node){
        return '<td colspan=""><table width="100%">'+lh.getAADNodeTableRows(node)+'</table></td>';
      }

      /* GET TABLE ROWS */
      lh.getAADNodeTableRows = function(node){
        var out='';
        Object.entries(node).forEach(entry => {
          const [key, value] = entry;
          console.log(key+" "+value);
          out += '<tr><td>'+key+'</td><td>'+value+'</td></tr>';
        });
        return out;
      }

      /* GET SCREENSHOTS WITH LOADING TIME */
      lh.getScreenshots = function(auditScreenshot){
        var screens = auditScreenshot["details"]["items"];
        //console.log(screens);
        var screenData;
        var screenTime;
        var screenOutput  ='<div class="label toggle list-lighthouse collapsed" aria-expanded="false" aria-controls="list-screenshots"';
        if (bsversion==4)
          screenOutput     +='data-toggle="collapse" data-target="#list-screenshots"';
        else if (bsversion==5)
          screenOutput     +='data-bs-toggle="collapse" href="#list-screenshots" role="button"';
        screenOutput     +='>Screenshots'+chevronDown+'</div>';
        screenOutput     +='<ul id="list-screenshots" class="collapse list-screenshots list-group">';
        $(screens).each(function(key,screen){
            screenData = screen['data'];
            screenTime = screen['timing'];
            screenOutput+='<li class="list-group-item">'+screenTime+' ms<br /><img class="screenshot" src="'+screenData+'"/></li>';
        })
        screenOutput+='</ul>';
        return screenOutput;
      }

      /* HTML SPAN OUTPUT */
      lh.addSpan = function(cssClass,value){
        var htmlOut  = '<span class="'+cssClass+'">';
        htmlOut      +=    value;
        htmlOut      += '</span>';
        return htmlOut;
      }

      /* CSS CLASS FOR SPEED STATUS COLOR */
      lh.getSpeedClass = function(scoreIn){
        var speedOut;
        if (scoreIn < 0.5){speedOut = 'slow';} 
        else if (scoreIn < 0.9){speedOut = 'average';} 
        else if (scoreIn <= 1){speedOut = 'fast';}
        return speedOut;
      }
      
      /* CHARTS */
      lh.createCharts = function (chartIn,typeIn,target,titleText) {
          var targetChart = target+"Chart";
          if(typeof window[targetChart] !== "undefined"){
            window[targetChart].destroy();
          }
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

      lh.getBootstrapVersion = function () {
        var deferred = $.Deferred();
      
        var script = $('script[src*="bootstrap"]');
        if (script.length == 0) {
          return deferred.reject();
        }
      
        var src = script.attr('src');
        $.get(src).done(function(response) {
          var matches = response.match(/(?!v)([.\d]+[.\d])/);
          if (matches && matches.length > 0) {
            version = matches[0];
            deferred.resolve(version);
          }
        });
      
        return deferred;
      };
    }

    var lighthouseData = new LighthouseData();
    lighthouseData.init();
  });  
});
