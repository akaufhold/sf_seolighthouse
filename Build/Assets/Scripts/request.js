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
      var auditsHtml            = new DocumentFragment();
      var performanceAudits     = new DocumentFragment();
      var additionalAudits      = new DocumentFragment();

      /* BOOTSTRAP VERSION */
      var bsversion = $.fn.tooltip.Constructor.VERSION.charAt(0);
      /* LIGHTHOUSE */
      var auditName,categoryUrl; 
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
            $(this).toggleClass("active"); 
            categoryUrl =  lh.getCategoryList();
            lh.addCategoriesToTargetUrl(categoryUrl);
        });
        
        lh.showAddionalAudits();
        lh.performanceMenu();
      };

      lh.performanceMenu = function(){
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
      }

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

      /* ERROR HANDLING */
      lh.errorHandling = function(errorMessage){
        lh.pbReset();
        lh.setPbStatus("error");
        $(pb).find(".errorMessage").append(": "+errorMessage.substring(0, 130));
        lh.fetchLighthouseData(lh.getTargetUrl());
      }

      /* SET TOTAL TIME 4 PROGRESS BAR */
      lh.setTotalTime = function(timer){
        let curTimer = (timer/1000).toFixed(2)+' s';
        if (!$(cc).find(".totalTime").length){
          let curCounter = document.createElement('span');
          curCounter.className = "totalTime";
          curCounter.appendChild(document.createTextNode(curTimer));
          $(cc).find(".counterTitle").append(curCounter);
        }   
        else
          $(cc).find(".totalTime").html(curTimer);
      }

      /* HTML SPAN OUTPUT */
      lh.addSpan = function(cssClass,value){
        var span = document.createElement('span');
        var classes = String(cssClass).split(' ');
        classes.forEach(element => {
          span.classList.add(element);
        });
        span.appendChild(document.createTextNode(value));
        return span;
      }

      /* CSS CLASS FOR SPEED STATUS COLOR */
      lh.getSpeedClass = function(scoreIn){
        var speedOut;
        if (scoreIn < 0.5){speedOut = 'slow';} 
        else if (scoreIn < 0.9){speedOut = 'average';} 
        else if (scoreIn <= 1){speedOut = 'fast';}
        return speedOut;
      }

      /* ESCAPING SPECIALS CHARS */
      lh.htmlEnc = function(string){
        return string.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&#34;');
      }

      /* GETTING DEPTH OF OBJECT */
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
              
              var auditsListHtml = document.createElement("ul"); 
              auditsListHtml.classList.add('list-lighthouse', 'list-score', 'list-main', 'list-group');

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

                  //console.log(lh.getMainAudits(curCategory,auditCategories,catIt,lhCategoryListLength));
                  /* OVERALL AUDIT PROPERTIES */
                  auditsListHtml.appendChild(lh.getMainAudits(curCategory,auditCategories,catIt,lhCategoryListLength));

                  /* PERFORMANCE AUDIT PROPERTIES */
                  if (category=="PERFORMANCE"){
                      lh.createCharts(window.pac,"bar","audits");
                      var performanceAuditsList  = document.createElement("ul"); 
                      performanceAuditsList.classList.add('list-lighthouse', 'list-lighthouse-'+curCategory, 'list-group');
                      performanceAuditsList.appendChild(lh.getPerformanceAudits(mainAuditsPerformance,auditResults));
                      performanceAudits.appendChild(performanceAuditsList);
                      $(".list-performance-audits").append(performanceAudits);
                      $(".performance,.performanceAudits,.performanceHeadline,.performanceListHeader").css({display:"block"});
                      $(".performanceAuditCharts").css({display:"none"});

                  }
                  /* ADDTIONAL AUDIT PROPERTIES*/
                  additionalAudits.append(lh.getAdditionalAudits(auditResults,auditCategories,curCategory));
                  $(".list-Addtional-Audits").append(additionalAudits);
                  
                  $(".newLighthouseStatistics").css({display:"block"});
              });

              auditsHtml.appendChild(auditsListHtml);
              $(".list-audits").html("");
              $(".list-audits").append(auditsHtml);
              $(".list-Addtional-Audits").append(lh.getScreenshots(auditScreenshots));
              lh.setTotalTime(lighthouse.timing.total);
              lh.activeListClick();
            }else{
              /* ERROR HANDLING */
              lh.errorHandling(json.error.message);
            }
          });
      } 

      /* GET MAIN AUDITS */
      lh.getMainAudits = function(auditItem,auditResult,mainIteration,mainCounter){
          var speed, score, color;
          var htmlAuditsOut = new DocumentFragment();
          $(mainAudits).each(function(key,value){
            if (value[0]==auditItem){
              //auditsHtml        = "";
              var htmlAuditsListOut = document.createElement("li");
              score                 = auditResult[auditItem].score;
              speed                 = lh.getSpeedClass(score);
              color                 = lh.getSpeedColor(score);
              auditName             = auditResult[auditItem].title.replace("-"," ");
              htmlAuditsListOut.classList.add('list-group-item', 'list-'+auditItem);
              htmlAuditsListOut.appendChild(lh.addSpan("label",auditName));
              htmlAuditsListOut.appendChild(lh.addSpan("score "+speed,score));
              htmlAuditsOut.appendChild(htmlAuditsListOut);
              $("#"+value[1]).val(score);
            }
          })
          return htmlAuditsOut;
      }

      /* GET PERFORMANCE AUDITS */
      lh.getPerformanceAudits = function(auditItemList,auditResults){
          var speed, score, color, displayValue, chartVal;
          var mainCounter = 1;
          var htmlPerformanceOut = new DocumentFragment();
          auditItemList.forEach(function(value){
            auditName             = value[0].replace("-"," ");
            displayValue          = auditResults[value[0]].displayValue;
            score                 = auditResults[value[0]].score;
            speed                 = lh.getSpeedClass(score);
            color                 = lh.getSpeedColor(score);

            var htmlPerformanceListOut = document.createElement("li");
            htmlPerformanceListOut.classList.add('list-group-item', 'list-'+((value[1])?value[1]:''));
            htmlPerformanceListOut.appendChild(lh.addSpan("label",auditName));
            htmlPerformanceListOut.appendChild(lh.addSpan("value", displayValue));
            htmlPerformanceListOut.appendChild(lh.addSpan("score "+speed,score));
            $("#"+value[1]).val(parseFloat(displayValue.replace(',', '.')));
            $("#"+value[1]+"s").val(parseFloat(score)); 
            /* ADD CHARTS DATA TO ARRAY */
            chartVal = score*100;
            if (mainAuditsPerformance.length==mainCounter){
              lh.addDataSet(window.auditsChart,auditName,color,chartVal,((mainCounter==1) ? '1' : '0'),1);
            }else{
              lh.addDataSet(window.auditsChart,auditName,color,chartVal,((mainCounter==1) ? '1' : '0'),0);
            }
            mainCounter++;
            htmlPerformanceOut.appendChild(htmlPerformanceListOut);
          });
          return htmlPerformanceOut;
      }

      lh.getAdditionalAudits = function(auditRes,auditCats,curCat){
       /* ADDTIONAL AUDIT PROPERTIES*/
       var AAOut = new DocumentFragment();
       var AADiv = document.createElement("div"); 
       AADiv.classList.add('label', 'toggle', 'list-lighthouse','collapsed');
       AADiv.setAttribute('aria-expanded','false');
       AADiv.setAttribute('aria-controls','list-additional-'+curCat);
       
       if (bsversion==4){
        AADiv.setAttribute('data-toggle','collapse');
        AADiv.setAttribute('data-target','#list-additional-'+curCat);
       }
       else if (bsversion==5){
        AADiv.setAttribute('data-bs-toggle','collapse');
        AADiv.setAttribute('href','#list-additional-'+curCat);
        AADiv.setAttribute('role','button');
       }
       AADiv.appendChild(document.createTextNode(auditCats[curCat].title));
       AADiv.insertAdjacentHTML('beforeend',chevronDown);

       var AAList = document.createElement("ol"); 
       AAList.classList.add('list-group', 'list-lighthouse','collapse');
       AAList.id = 'list-additional-'+curCat;
       AAList.append(lh.getAdditionalAuditsList(auditRes,auditCats[curCat]));
       AAOut.append(AADiv);
       AAOut.append(AAList);

       return AAOut;
      }

      /* GET ADDITIONAL AUDITS */
      lh.getAdditionalAuditsList = function(auditResults,auditResultsInCategory){
        var additional = new DocumentFragment();
        var auditRefs = auditResultsInCategory['auditRefs'];
        var speed, score, displayValue, screenshot, type, displayMode, description, currentAudit;
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
            auditName                         = type.replace("-"," ");
            var additionalList                = document.createElement("li");
            additionalList.id                 = type;
            additionalList.classList.add('list-group-item');
            additionalList.appendChild(lh.addSpan("label",auditName));
            console.log(auditName);
            ((description) ? additionalList.children[0].insertAdjacentHTML('afterbegin',chevronDown): '') 

            if (displayValue!=undefined){
              additionalList.appendChild(lh.addSpan("value",displayValue));
            }
            if (score){
                speed                         =  lh.getSpeedClass(score);
                additionalList.appendChild(lh.addSpan("score "+speed,score));
            }
            if (currentAudit.description){  
              var additionalDescription       = lh.getAADDesc(currentAudit);
              if ((typeof currentAudit.details != "undefined") && (lh.getAAD(currentAudit.details))){
                additionalDescription.append(lh.getAAD(currentAudit.details));
              }
              additionalList.append(additionalDescription);
            }
            additional.append(additionalList);
          }
        });
        return additional;
      }

      /* GET DETAILS OF ADDITIONAL AUDITS */
      lh.getAAD = function(details){
        if ((details.type=="table") && (details.items.length)){
          //console.log(details);
          return lh.getAADTable(details); 
        } else {
          return false;
        }
      }

      lh.getAADDesc = function(currentAudit){
        var additionalDescription     = document.createElement("span"); 
        additionalDescription.classList.add('description');

        if (currentAudit.title){
          var additionalBold          = document.createElement("b");
          additionalBold.innerHTML    = lh.htmlEnc(JSON.stringify(currentAudit.title.toString()));
          additionalDescription.append(additionalBold);
        }
        additionalDescription.innerHTML += lh.htmlEnc(JSON.stringify(currentAudit.description.toString()));
        return additionalDescription;
      }

      /* GET DETAILS OF ADDITIONAL AUDITS FROM TYPE TABLE*/
      lh.getAADTable = function(details){
        let tbl     = document.createElement("table");
        tbl.classList.add('table', 'table-striped', 'table-hover');
        tbl.appendChild(lh.getAADTableHeadings(details.headings));
        tbl.appendChild(lh.getAADTableBodyContent(details.items,details.headings));
        return tbl;
      }

      /* GET HEADINGS OF ADDITIONAL AUDITS TABLE */
      lh.getAADTableHeadings = function(headings){
        let tbl         = new DocumentFragment();
        let tblHead     = document.createElement("thead");
        let tblHeadRow  = tblHead.insertRow();

        headings.forEach(function(headeritem,headerindex){
          if (typeof headeritem.text!=undefined){
            var tblHeadCell         = document.createElement('th');
            tblHeadCell.style.width = (100/headings.length)+'%';
            tblHeadCell.appendChild(document.createTextNode(headeritem.text));
            tblHeadRow.appendChild(tblHeadCell);
          }
        });
        tbl.appendChild(tblHead);
        return tbl;
      }

      /* GET TABLE BODY CONTENTS */
      lh.getAADTableBodyContent = function(detailItems,headings){
        let tableContent = new DocumentFragment();
        let tblBody      = document.createElement("tbody");
        var tblRow;
        //let tblRow       = tblBody.insertRow();
        if (headings.length){
          tblBody.append(lh.getAADTableRecursive(detailItems,headings));
        }else {
          tblBody.append(lh.getAADTableRecursive(detailItems,headings.length));
        }
        tableContent.appendChild(tblBody);
        //console.log(tableContent);
        return tableContent;
      }

      /* GET RECURSIVE TABLE BODY CONTENTS */
      lh.getAADTableRecursive = function(detailItems,headings){
        let detailTbl       = new DocumentFragment();

        console.log(detailItems);
        detailItems.forEach(function(item,indexDetail){
          //console.log(itemDetail);
          if (typeof item!=undefined){
            if ((item?.node) || (item?.relatedNode)) {
              var detailTblRow    = document.createElement("tr");
              var cell            = detailTblRow.insertCell();
            }
            /*if (item?.node){
              cell.appendChild(lh.getAADNodeWrapper(item?.node,"row"));
              detailTbl.append(cell);
            }
            if (item?.relatedNode){
              cell.appendChild(lh.getAADNodeWrapper(item.relatedNode),"row-sub");
              detailTbl.append(cell);
            }*/
            if ((!item?.node) && (!item?.relatedNode)){
              headings.forEach(function(headeritem,headerindex){
                console.log("--------------- HEADER -------------------");
                console.log(headeritem);
                if (item.hasOwnProperty("key")){
                  detailTbl.appendChild(lh.getAADTableCell(headeritem));
                }
              });
 
              let detail;
              // detailTbl  ='';
              // detailTbl += lh.getAADTableRows(item);
              // detailTbl += '<td>'+item+'</td>';
            }
          }
          /*if ((lh.determineDepthOfObject(item)>0) && (Array.isArray(item))){
            lh.getAADTableRecursive(item,headerKey);
          }
          if (item?.subItems?.items){
            lh.getAADTableRecursive(item.subItems.items);
          }*/
        });
        return detailTbl;
      }

      /* GET TABLE WRAP */
      lh.getAADTableWrapper = function(node,headCount){
        let TblCell   = document.createElement("td");
        TblCell.setAttribute('colspan',headCount);
        let TblTable  = TblCell.createElement("table");
        TblTable.appendChild(lh.getAADTableRows(node));
        return TblCell;
      }

      /* GET TABLE ROWS */
      lh.getAADTableRows = function(node){
        var tblRow, cell1, cell2;
        Object.entries(node).forEach(entry => {
          const [key, value] = entry;
          tblRow   = document.createElement("tr");
          cell1 = tblRow.insertCell();
          cell2 = tblRow.insertCell();
          cell1.appendChild(document.createTextNode(key));
          cell2.appendChild(document.createTextNode(value));
          tblRow.appendChild(cell1);
          tblRow.appendChild(cell2);
        });
        return tblRow;
      }

      /* GET TABLE CELLS */
      lh.getAADTableCell = function(node){
        var cell1 = document.createElement("td");
        cell1.appendChild(document.createTextNode(node));
        return cell1;
      }

      /* GET NODE WRAP */
      lh.getAADNodeWrapper = function(node,rowClass){
        var nodeProperties = [];
        nodeProperties.push(node.nodeLabel, node.path, node.selector, node.snippet);
        //console.log(nodeProperties);
        let tbl       = document.createElement('table');
        let tblBody   = document.createElement("tbody");
        let tblRow    = tblBody.insertRow();
        tblRow.classList.add(rowClass);
        
        //console.log(node);
        nodeProperties.forEach(function(nodeItem,indexNode){
          var tblCell = tblRow.insertCell();
          //console.log(nodeItem);
          tblCell.appendChild(document.createTextNode(nodeItem));
        })
        tbl.appendChild(tblBody);
        return tbl;
      }

      /*lh.getAADTableHeadings = function(headings){
        var out = '<thead>';
        headings.forEach(function(headeritem,headerindex){
          if (typeof headeritem.text!=undefined){
            out += '<th style="width:'+(100/headings.length)+'%">'+headeritem.text+'</th>';
          }
        });
        out += '</thead>';
        return out;
      }*/

      /* GET SCREENSHOTS WITH LOADING TIME */
      lh.getScreenshots = function(auditScreenshot){
        let screenLabel     = 'Screenshots';
        let screens         = auditScreenshot["details"]["items"];

        let screenFragment  = document.createDocumentFragment();
        let screenDiv       = document.createElement('div');
        let screenList      = document.createElement('ul');

        screenDiv.classList.add('label', 'toggle', 'list-lighthouse', 'collapsed');
        screenDiv.setAttribute('aria-expanded','false');
        screenDiv.setAttribute('aria-controls','list-screenshots');
        if (bsversion==4){
          screenDiv.setAttribute('data-toggle','collapse');
          screenDiv.setAttribute('data-target','#list-screenshots');
        } else if (bsversion==5){
          screenDiv.setAttribute('data-bs-toggle','collapse');
          screenDiv.setAttribute('href','#list-screenshots');
          screenDiv.setAttribute('role','button');
        }
        screenDiv.appendChild(document.createTextNode(screenLabel));
        screenDiv.insertAdjacentHTML('beforeend',chevronDown);
        
        screenList.id = 'list-screenshots';
        screenList.classList.add('list-group', 'list-screenshots', 'collapse');
        
        $(screens).each(function(key,screen){
          screenList.appendChild(lh.getScreenshotsListEntries(screen));
        });
        screenFragment.append(screenDiv);
        screenFragment.append(screenList);
        return screenFragment;
      }
      
      lh.getScreenshotsListEntries = function(screen){
        let screenListEntry     = document.createElement('li');
        let screenListEntryImg  = document.createElement('img');
        let screenData          = screen['data']; 
        let screenTime          = screen['timing'];

        screenListEntry.classList.add('list-group-item');
        screenListEntry.appendChild(document.createTextNode(screenTime+' ms'));
        screenListEntry.insertAdjacentHTML('beforeend','<br />');

        screenListEntryImg.classList.add('screenshot');
        screenListEntryImg.src=screenData;
        screenListEntry.appendChild(screenListEntryImg);
        return screenListEntry;
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
    }

    var lighthouseData = new LighthouseData();
    lighthouseData.init();
  });  
});
