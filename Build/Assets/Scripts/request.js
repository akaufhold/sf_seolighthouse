import '../Scss/backend.scss';
import Chart from 'chart.js/auto';

requirejs(['jquery'], function ($) {
  require(['moment', 'chart.js','roughjs'], function(moment, chart) {
    
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

      /* TEST-AUDITS FOR DEBUGGING */
      var auditDebug = 'layout shift-elements';

      /* BOOTSTRAP VERSION */
      var bsversion = $.fn.tooltip.Constructor.VERSION.charAt(0);
      /* LIGHTHOUSE */
      var auditName,categoryUrl; 
      /* DECLARATION AUDIT CONSTANTS */
      const mainAudits        = [
        ['accessibility', 'acs'],
        ['best-practices', 'bps'],
        ['performance', 'pes'],
        ['pwa', 'pwas'],
        ['seo', 'seos']
      ];
      const mainAuditsPerformance        = [
        ['first-contentful-paint', 'fcp',0.15,'rgba(255, 159, 64, 1)'],
        ['speed-index', 'si',0.15,'rgba(255, 99, 132, 1)'],
        ['interactive', 'tti',0.25,'rgba(255, 205, 86, 1)'],
        ['largest-contentful-paint', 'lcp',0.15,'rgba(75, 192, 192, 1)'],
        ['total-blocking-time', 'tbt',0.25,'rgba(54, 162, 235, 1)'],
        ['cumulative-layout-shift', 'cls',0.05,'rgba(153, 102, 255, 1)']
      ];
      /* PROGRESS BAR */
      var pb = $('.progressBar');
      var cc = $('.progressBar').find('.counterContainer');

      lh.init = function () {
        categoryUrl =  lh.getCategoryList();
        lh.addCategoriesToTargetUrl(categoryUrl);
        //console.log(mainAudits);
        $('.getLighthouseData').on('click', function(){
            /* PREFILL TARGET INPUT */
            $('#target').val($('.newLighthouseStatistics').attr('id'));

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
        $('input[type=radio][name=device]').change(function(){
            $('.tx_sfseolighthouse').find('.custom-radio').find('label').removeClass('active');
            $(this).parents('.custom-radio').find('label').addClass('active');
            deviceUrl = lh.getDeviceUrl(lh.getDevice());
            lh.setTargetUrl(deviceUrl);
            categoryUrl =  lh.getCategoryList();
            lh.addCategoriesToTargetUrl(categoryUrl);
        });

        /* CATEGORY CLICK EVENT */  
        $('.categoriesCheck').find('.custom-check').find('label').click(function(){
            var curVal = $(this).parents('.custom-check').find('.form-check-input').val();
            if (curVal == 'all'){
                $('.form-check-label').removeClass('active');
            }
            else{
                $('input[value="all"]').parents('.custom-check').find('.form-check-label').removeClass('active');
            }
            $(this).toggleClass('active'); 
            categoryUrl =  lh.getCategoryList();
            lh.addCategoriesToTargetUrl(categoryUrl);
        });
        
        lh.showAddionalAudits();
        lh.performanceMenu();
      };

      /* function for sorting json object through child keys */
      lh.sortKeys = function(o) {
        if (Array.isArray(o)) {
            return o.map(lh.sortKeys)
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
                        result[key] = lh.sortKeys(o[key]);
                        return result
                    }, {})
                }
            }();
            if (typeof _ret === 'object') return _ret.v
        }
        return o
      };

      lh.checkAudit = function(condition){
        //console.log('Input: '+condition+' / Aktuelles Audit:'+auditName);
        return ((auditName==condition)?true:false);
      }

      lh.performanceMenu = function(){
        $('.performanceMenu').find('a').click(function(){
          var idTarget = $(this).attr('id').split('show')[1].charAt(0).toLowerCase()+$(this).attr('id').split('show')[1].substring(1);
          $('.performanceAudits').css({display:'none'});
          if (idTarget=='performanceAuditCharts'){
              $('.performanceListHeader').css({display:'none'});
          }else{
              $('.performanceListHeader').css({display:'block'});
          }
          $('.'+idTarget).css({display:'block'});
        }) 
      }

      lh.showAddionalAudits = function(){
        $('.auditButtons').find('a').click(function(){
          var idTarget = $(this).attr('id').split('show')[1].charAt(0).toLowerCase()+$(this).attr('id').split('show')[1].substring(1);
          $('.'+idTarget).css({display:'block'});
        })
      }

      lh.activeListClick = function(){
        $('.list-lighthouse').on('click','li',function(){
            var listItem = $(this);
            $('.list-lighthouse').find('li').removeClass('active');
            if (!$(listItem).hasClass('active')){
                $(listItem).addClass('active');
            }
        });
      }

      /* GET CATEGORY URL PARAMS */
      lh.getCategoryList = function(){
        var targetCategory = '';
        var category = $('.categoriesCheck').find('.form-check-label.active');
        
        $(category).each(function(key,label){
            var val = $(label).parents('.custom-check').find('.category').val().toUpperCase();
            if (val!='ALL'){
                $('.saveCharts').css({display:'none'});
                targetCategory += val;
                targetCategory += (((key+1)!=category.length)?',':'');
            }
            else{
              var allCategory = $('.categoriesCheck').find('.form-check-label').not('.active');
              $('.saveCharts').css({display:'block'});
              $(allCategory).each(function(key,label){
                val = $(label).parents('.custom-check').find('.category').val().toUpperCase();
                targetCategory += val;
                targetCategory += (((key+1)!=allCategory.length)?',':'');
              });
            }
        });
        return targetCategory;
      }

      /* ADD CATEGORY TO URL */
      lh.addCategoriesToTargetUrl = function(categoriesUrl){
          var curTargetUrl =''; 
          var categoryUrl = categoriesUrl.split(',');
          $(categoryUrl).each(function(key,category){
              curTargetUrl = lh.addUrlParam(curTargetUrl,'category',category);
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
          return $('.targetUrl')[0].innerText;
      }

      /* SET TARGET URL */
      lh.setTargetUrl = function(targetUrlInput){
          $('.targetUrl').html(targetUrlInput);
      }

      /* GET DEVICE */
      lh.getDevice = function(){  
          return $('.deviceRadio').find('.active').parents('.custom-radio').find('.device').val();
      }

      /* GET URL DEPENDING ON DEVICE */
      lh.getDeviceUrl = function(deviceTarget){
          return $('.getLighthouseData').data(deviceTarget);
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
          $(cc).find('.counterAmount').css({width:'0%'});
          $(cc).removeClass('progress').removeClass('error').removeClass('success');
          $(cc).find('.counterTitle').find('.errorMessage').html('error');
      }

      /* SET PROGRESS BAR STATUS */
      lh.setPbStatus = function(status){
          $(cc).addClass(status);
          if ((status=='success') || (status=='error'))
              $(cc).find('.counterAmount').css({width:'100%'});
      }
      
      /* CHANGE FIRST LETTER FROM STRING */
      lh.firstLetterUp = function(stringIn){
        return stringIn.charAt(0).toUpperCase() + stringIn.slice(1).toLowerCase();
      }

      /* ERROR HANDLING */
      lh.errorHandling = function(errorMessage){
        lh.pbReset();
        lh.setPbStatus('error');
        $(pb).find('.errorMessage').append(': '+errorMessage.substring(0, 130));
        lh.fetchLighthouseData(lh.getTargetUrl());
      }

      /* SET TOTAL TIME 4 PROGRESS BAR */
      lh.setTotalTime = function(timer){
        let curTimer = (timer/1000).toFixed(2)+' s';
        if (!$(cc).find('.totalTime').length){
          let curCounter = document.createElement('span');
          curCounter.className = 'totalTime';
          curCounter.appendChild(document.createTextNode(curTimer));
          $(cc).find('.counterTitle').append(curCounter);
        }   
        else
          $(cc).find('.totalTime').html(curTimer);
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
        lh.setPbStatus('progress');

        /* ONLY FOR TESTING !!!!!!!!!!!!!!!*/
        targetUrl = 'https://webpacktest.ddev.site/typo3conf/ext/sf_seolighthouse/Resources/Public/Json/runPagespeed.json';

        /* FETCH LIGHTHOUSE DATA */
        fetch(targetUrl)
          .then(response => response.json())
          .then(json => {
            if (!json.hasOwnProperty('error')){
              const lighthouse      = json.lighthouseResult, 
                    auditResults    = lighthouse.audits,
                    auditScreenshots= auditResults['screenshot-thumbnails'],
                    auditCategories = lighthouse.categories;
              var   lhCategoryList  = lh.getCategoryList().split(',');
              var   lhCategoryListLength = $(lhCategoryList).length;

              lh.pbReset();
              lh.setPbStatus('success');
              $('.list-audits,.list-Addtional-Audits,.list-performance-audits').html('');
              /* SET DEVICE HIDDEN FIELD */
              $('#device').val(lh.firstLetterUp(lh.getDevice()));
              console.log(auditResults);
              var auditsListHtml = document.createElement('ul'); 
              auditsListHtml.classList.add('list-lighthouse', 'list-score', 'list-main', 'list-group');

              $(lhCategoryList).each(function(catIt,category){
                  catIt++;
                  var curCategory   = category.toLowerCase().replace('_','-');
                  var curChart      = 'oac'+curCategory.substring(0,3);
                  var overallScore  = lighthouse.categories[curCategory].score;

                  /* CREATE CHARTS OUTPUT */
                  var missingScore  = 1-overallScore;
                  var speedColor    = lh.getSpeedColor(overallScore);
                  lh.createCharts(window[curChart],'pie',curCategory,curCategory+' Score');

                  lh.addDataSet(window[curCategory+'Chart'],'Score',speedColor,overallScore*100,1,0);
                  lh.addDataSet(window[curCategory+'Chart'],'','rgba(255, 255, 255, 1)',missingScore*100,0,1);

                  //console.log(lh.getMainAudits(curCategory,auditCategories,catIt,lhCategoryListLength));
                  /* OVERALL AUDIT PROPERTIES */
                  auditsListHtml.appendChild(lh.getMainAudits(curCategory,auditCategories,catIt,lhCategoryListLength));

                  /* PERFORMANCE AUDIT PROPERTIES */
                  if (category=='PERFORMANCE'){
                      lh.createCharts(window.pac,'bar','audits');
                      var performanceAuditsList  = document.createElement('ul'); 
                      performanceAuditsList.classList.add('list-lighthouse', 'list-lighthouse-'+curCategory, 'list-group');
                      performanceAuditsList.appendChild(lh.getPerformanceAudits(mainAuditsPerformance,auditResults));
                      performanceAudits.appendChild(performanceAuditsList);
                      $('.list-performance-audits').append(performanceAudits);
                      $('.performance,.performanceAudits,.performanceHeadline,.performanceListHeader').css({display:'block'});
                      $('.performanceAuditCharts').css({display:'none'});

                  }
                  /* ADDTIONAL AUDIT PROPERTIES*/
                  additionalAudits.append(lh.getAdditionalAudits(auditResults,auditCategories,curCategory));
                  $('.list-Addtional-Audits').append(additionalAudits);
                  
                  $('.newLighthouseStatistics').css({display:'block'});
              });

              auditsHtml.appendChild(auditsListHtml);
              $('.list-audits').html('');
              $('.list-audits').append(auditsHtml);
              $('.list-Addtional-Audits').append(lh.getScreenshots(auditScreenshots));
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
              //auditsHtml        = '';
              var htmlAuditsListOut = document.createElement('li');
              score                 = auditResult[auditItem].score;
              speed                 = lh.getSpeedClass(score);
              color                 = lh.getSpeedColor(score);
              auditName             = auditResult[auditItem].title.replace('-',' ');
              htmlAuditsListOut.classList.add('list-group-item', 'list-'+auditItem);
              htmlAuditsListOut.appendChild(lh.addSpan('label',auditName));
              htmlAuditsListOut.appendChild(lh.addSpan('score '+speed,score));
              htmlAuditsOut.appendChild(htmlAuditsListOut);
              $('#'+value[1]).val(score);
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
            auditName             = value[0].replace('-',' ');
            displayValue          = auditResults[value[0]].displayValue;
            score                 = auditResults[value[0]].score;
            speed                 = lh.getSpeedClass(score);
            color                 = lh.getSpeedColor(score);

            var htmlPerformanceListOut = document.createElement('li');
            htmlPerformanceListOut.classList.add('list-group-item', 'list-'+((value[1])?value[1]:''));
            htmlPerformanceListOut.appendChild(lh.addSpan('label',auditName));
            htmlPerformanceListOut.appendChild(lh.addSpan('value', displayValue));
            htmlPerformanceListOut.appendChild(lh.addSpan('score '+speed,score));
            $('#'+value[1]).val(parseFloat(displayValue.replace(',', '.')));
            $('#'+value[1]+'s').val(parseFloat(score)); 
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

      /* ADDTIONAL AUDIT PROPERTIES*/
      lh.getAdditionalAudits = function(auditRes,auditCats,curCat){
       var AAOut = new DocumentFragment();
       var AADiv = document.createElement('div'); 
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

       var AAList = document.createElement('ol'); 
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
        auditRefs = lh.sortKeys(auditRefs);
        
        Object.keys(auditRefs).sort().forEach(function(key){
          type                               = auditResultsInCategory.auditRefs[key].id;
          currentAudit                       = auditResults[type];
          description                        = currentAudit.description;
          displayMode                        = String(currentAudit.scoreDisplayMode);

          if (currentAudit.hasOwnProperty('details.screenshot')){
            screenshot = currentAudit.details.screenshot;
          }
          displayValue                       = currentAudit.displayValue;
          if (currentAudit.score!=null){
            score                            = currentAudit.score;
          }

          //js error when including not applicable audits => maybe string too long 
          if (displayMode!='notApplicable'){ 
            auditName                         = type.replace('-',' ');
              //console.log(auditName);
            var additionalList                = document.createElement('li');
            additionalList.id                 = type;
            additionalList.classList.add('list-group-item');
            additionalList.appendChild(lh.addSpan('label',auditName));
            
            /*if (lh.checkAudit(auditDebug)){
              console.log(auditName);
              console.log(currentAudit.details);
            }*/

            ((description) ? additionalList.children[0].insertAdjacentHTML('afterbegin',chevronDown): '') 

            if (displayValue!=undefined){
              additionalList.appendChild(lh.addSpan('value',displayValue));
            }
            if (score){
                speed                         =  lh.getSpeedClass(score);
                additionalList.appendChild(lh.addSpan('score '+speed,score));
            }
            if (currentAudit.description){  
              var additionalDescription       = lh.getAADDesc(currentAudit);
              if ((typeof currentAudit.details != 'undefined') && (lh.getAAD(currentAudit.details))){
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
        if (details?.items?.length){
          switch (details.type) {
            case 'table': 
              return lh.getAADTable(details,'table');
            case 'criticalrequestchain':
              return lh.getCriticalChains(details);
            case 'opportunity':   
              return lh.getAADTable(details,'opportunity');
            case 'debugdata':   
              //return lh.getCriticalChains(details);
            default:
              console.log(auditName);
              console.log('Other Types: '+details.type);
            return false;
            break;
          }
        }
      }

      lh.getAADDesc = function(currentAudit){
        var additionalDescription     = document.createElement('span'); 
        additionalDescription.classList.add('description');
        if (currentAudit.title){
          var additionalBold          = document.createElement('b');
          additionalBold.innerHTML    = lh.htmlEnc(JSON.stringify(currentAudit.title.toString()));
          additionalDescription.append(additionalBold);
        }
        additionalDescription.innerHTML += lh.htmlEnc(JSON.stringify(currentAudit.description.toString()));
        return additionalDescription;
      }

      /* GET DETAILS OF ADDITIONAL AUDITS FROM TYPE TABLE*/
      lh.getAADTable = function(details,type){
        let tbl     = document.createElement('table');
        tbl.classList.add('table','table-striped', 'table-hover');
        if (type=='opportunity'){tbl.classList.add('table-opportunity');}
        tbl.appendChild(lh.getAADTableHeadings(details.headings,type));
        tbl.appendChild(lh.getAADTableBodyContent(details.items,details.headings,type));
        return tbl;
      }

      /* GET HEADINGS OF ADDITIONAL AUDITS TABLE */
      lh.getAADTableHeadings = function(headings,type){
        let tbl         = new DocumentFragment();
        let tblHead     = document.createElement('thead');
        let tblHeadRow  = tblHead.insertRow();

        headings.forEach(function(headeritem,headerindex){
          var tblHeadLabel = '';
          if (typeof headeritem.text!=='undefined'){
            tblHeadLabel =  headeritem.text;
          } else if (typeof headeritem.label!=='undefined'){
            tblHeadLabel =  headeritem.label;
          }
          var tblHeadCell         = document.createElement('th');
          //tblHeadCell.style.width = (100/headings.length)+'%';
          tblHeadCell.appendChild(document.createTextNode(tblHeadLabel));
          tblHeadRow.appendChild(tblHeadCell);
        });
        tbl.appendChild(tblHead);
        return tbl;
      }

      /* GET TABLE BODY CONTENTS */
      lh.getAADTableBodyContent = function(detailItems,headings,type){
        let tableContent = new DocumentFragment();
        let tblBody      = document.createElement('tbody');
        if (headings.length){
          tblBody.append(lh.getAADTableRecursive(detailItems,headings,false,'',type));
        }else {
          tblBody.append(lh.getAADTableRecursive(detailItems,headings.length,false,'',type));
        }
        tableContent.appendChild(tblBody);
        //console.log(tableContent);
        return tableContent;
      }

      /* GET TABLE ROW TYPE */
      lh.getAADTableRowType = function(item){
        var itemType;
        if (item.node){
          itemType = 'node';
        }
        else if (item.relatedNode){
          //console.log(item);
          itemType =  'related';
        }
        else {itemType = ''}
        return itemType;
      }


      /* GET RECURSIVE TABLE BODY CONTENTS */
      lh.getAADTableRecursive = function(detailItems,headings,isSub,cssClass,type){
        let detailTbl       = new DocumentFragment();
        /*if (lh.checkAudit(auditDebug)){
          console.log(detailItems);
          console.log(type);
        }*/
        detailItems.forEach(function(item,indexDetail){
          if (typeof item!=undefined){
            var detailTblRow = document.createElement('tr');
            if (headings){
              /* OUTPUT TABLE CELLS IN ORDER FROM TABLE HEADINGS */
              headings.forEach(function(headeritem,headerindex){
                var orderedVal;
                var headerKey  = headeritem.key;
                var detailType = headeritem.itemType;
                if (type=='opportunity'){
                  detailType = headeritem.valueType;
                }
                if ((isSub) && (headeritem.hasOwnProperty('subItemsHeading'))){
                  headerKey = headeritem.subItemsHeading.key;
                  if (headeritem.subItemsHeading.hasOwnProperty('itemType')){
                    detailType = headeritem.subItemsHeading.itemType;
                  }
                }
                orderedVal = item[headerKey];
                if ((headeritem.key=='entity') && (!isSub)){
                  headerKey = headeritem.subItemsHeading.key;
                  orderedVal = item.entity[headerKey];
                }
                if (orderedVal) {
                  switch (headerKey){
                    case 'node':
                      cssClass = 'row-main';
                      detailTblRow.appendChild(lh.getAADTableCellNode(item?.node,'70%'));
                    break;
                    case 'related':
                      cssClass = 'row-sub';
                      detailTblRow.appendChild(lh.getAADTableCellNode(item?.relatedNode,'70%'));
                    break;
                    default:
                      detailTblRow.appendChild(lh.getAADTableCell(orderedVal,detailType));
                    break;
                  }
                  ((isSub)?detailTblRow.classList.add(cssClass):'');
                } else {
                  detailTblRow.insertCell();
                }
                detailTbl.append(detailTblRow);
              });
              if (item.hasOwnProperty('subItems')){
                detailTbl.appendChild(lh.getAADTableRecursive(item.subItems.items,headings,true,'row-sub',type));
              }
            }
          }
        });
        return detailTbl;
      }

      /* GET TABLE WRAP */
      lh.getAADTableWrapper = function(detailItems,headings){
        let tblCell   = document.createElement('td');
        let tbl       = document.createElement('table');
        let headCount = headings.length;
        tblCell.setAttribute('colspan',headCount);
        tbl.appendChild(lh.getAADTableRows(detailItems,headings));
        tblCell.append(tbl);
        return tblCell;
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
      lh.getAADTableCell = function(node,type){
        var cell1 = document.createElement('td');
        cell1.appendChild(lh.getAADTableCellFormattedOut(node,type));
        return cell1;
      }

      /* FORMATS TABLE CELL CONTENT DEPENDING ON OBJECT CONTENT TYPE */
      lh.getAADTableCellFormattedOut = function(node,type){
        var label, calcOut, linkHref;
        var formatOut = new DocumentFragment();
        ((node!=='null' && node!=='undefined')?label = node:'');
        ((node?.text)?label = node.text:'');
        ((label!='') && (node?.url)?(label = node.url,linkHref=node.url):linkHref = label);

        switch (type) {
          case 'text':
            formatOut=document.createTextNode(label);
            break;
          case 'bytes':
            calcOut = (parseInt(label)/1024).toFixed(2)+' kB';
            formatOut=document.createTextNode(calcOut);
            break;
          case 'ms':
            calcOut = (parseInt(label)).toFixed(2)+' ms';
            formatOut=document.createTextNode(calcOut);
            break;
          case 'numeric':
            calcOut = label.toFixed(7);
            formatOut=document.createTextNode(calcOut);
            break;
          case 'link':
            formatOut = lh.createLink(label,linkHref);
            break;
          case 'url':
            formatOut = lh.createLink(label,linkHref);
            break;
          default:
            formatOut=document.createTextNode(label);
            break;
        }
        return formatOut;
      }

      /* GET NODE WRAP */
      lh.getAADTableCellNode = function(node,colWidth){
        //console.log(node);
        var tblCell = document.createElement('td');
        tblCell.style.width= colWidth; 
        tblCell.setAttribute('title', node.path);
        tblCell.setAttribute('data-path', node.path);
        tblCell.setAttribute('data-selector', node.selector);
        tblCell.setAttribute('data-snippet', node.snippet);

        var nodeLabel = document.createElement('div');
        nodeLabel.appendChild(document.createTextNode(node.nodeLabel));
        var nodeCode = document.createElement('div');
        nodeCode.appendChild(document.createTextNode(node.snippet));
        nodeCode.classList.add('lh-node__snippet');

        tblCell.append(nodeLabel);
        tblCell.append(nodeCode);

        return tblCell;
      }

      /* CRITICAL CHAIN */
      lh.getCriticalChains = function(details){
        let detailChains   = new DocumentFragment();
        details.forEach(function(childItem,childIndex){
          var divChain = document.createElement('div');
          divChain.appendChild(document.createTextNode(childItem.request.url));
          var timeSpan = document.createElement('span');
          timeSpan.appendChild(document.createTextNode(childItem.request.endTime - childItem.request.startTime));
          var sizeSpan = document.createElement('span');
          sizeSpan.appendChild(document.createTextNode(childItem.request.transferSize));
          divChain.appendChild(timeSpan);
          divChain.appendChild(sizeSpan);
          detailChains.append(divChain);
          getCriticalChains(childItem.children);
        });
        return detailChains;
      }

      /* CREATE LINK IN DOM */
      lh.createLink = function(label,href){
        var link = document.createElement('a');
        link.setAttribute('href', href);
        link.setAttribute('target', "_blank");
        link.appendChild(document.createTextNode(lh.shortenString(label)));
        return link;
      }

      /* RETURN SHORTENED STRING */
      lh.shortenString = function(string){
        if (string.length>50)
          return '…'+string.slice(string.length - 50);
        else
          return string;
      }

      /* FILTER HOST FROM URL */
      lh.filterHost = function(url){
        let regexDomain = window.url;
        var relativeUrl = url.replace(regexDomain,'');
        console.log(url);
        console.log(relativeUrl);
        return relativeUrl;
      }

      /* GET SCREENSHOTS WITH LOADING TIME */
      lh.getScreenshots = function(auditScreenshot){
        let screenLabel     = 'Screenshots';
        let screens         = auditScreenshot['details']['items'];

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
      
      /* GET SINGLE SCREENSHOTS AS LIST ENTRIES */
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

      /* CREATE CHARTS */
      lh.createCharts = function (chartIn,typeIn,target,titleText) {
          var targetChart = target+'Chart';
          if(typeof window[targetChart] !== 'undefined'){
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

      /* ADD DATASETS TO CHARTS */
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
