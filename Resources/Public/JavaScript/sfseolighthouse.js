/* DECLARATION AUDIT OBJECTS */

const mainAudits        = [
          ["first-contentful-paint", "fcp"],
          ["speed-index", "si"],
          ["interactive", "tti"],
          ["largest-contentful-paint", "lcp"],
          ["total-blocking-time", "tbt"],
          ["cumulative-layout-shift", "cls"]
        ];
const environmentAudits = [
          ["benchmarkIndex", "bi"],
          ["dom-size", "ds"]
        ];
const individualAudits  = [
          ["Overall Score","os"]
        ];
function fetchLighthouseData(targetUrl) {
    fetch(targetUrl)
      .then(response => response.json())
      .then(json => {
        if (!json.hasOwnProperty("error")){
          const lighthouse = json.lighthouseResult;
          const auditResults = lighthouse.audits;
          var OutputAuditsHtml = "";
          var OutputAuditName;

          $(".progressBar").find(".counterContainer").removeClass("progress").addClass("success"); 
          $(".progressBar").find(".counterContainer").find(".counterAmount").css({width:"100%"});
          /* MAIN AUDIT PROPERTIES */
          mainAudits.forEach(function(value){
              OutputAuditName   = value[0].replace("-"," ");
              OutputAuditsHtml += '<li class="list-group-item" id="'+value[1]+'">';
              OutputAuditsHtml +=     '<span class="label">';
              OutputAuditsHtml +=         OutputAuditName;
              OutputAuditsHtml +=         '<input type="hidden" name="tx_sfseolighthouse_web_sfseolighthouselighthouse[newLighthouseStatistics]['+value[1]+']" value="'+lighthouse.audits[value[0]].displayValue+'"/>';
              OutputAuditsHtml +=     '</span>';
              OutputAuditsHtml +=     '<span class="value">';
              OutputAuditsHtml +=         auditResults[value[0]].displayValue;
              OutputAuditsHtml +=     '</span>';
              OutputAuditsHtml +=     '<span class="score ';
              if (auditResults[value[0]].score < 0.5){OutputAuditsHtml += 'slow';}
              else if (auditResults[value[0]].score < 0.9){OutputAuditsHtml += 'average';}
              else if (auditResults[value[0]].score <= 1){OutputAuditsHtml += 'fast';}
              OutputAuditsHtml +=     '">'+auditResults[value[0]].score;
              OutputAuditsHtml +=     '</span>';
              OutputAuditsHtml += '</li>';
          });
          $(".list-main").html(OutputAuditsHtml);
          OutputAuditsHtml = "";
          /* ADDTIONAL AUDIT PROPERTIES*/
          Object.keys(auditResults).sort().forEach(function(key){
            var displayMode = String(auditResults[key].scoreDisplayMode);
            if (displayMode!="notApplicable"){
              //console.log(String(auditResults[key].scoreDisplayMode));
              OutputAuditName   = key.replace("-"," ");
              OutputAuditsHtml += '<li class="list-group-item" id="'+key+'">';
              OutputAuditsHtml +=     '<span class="label">';
              OutputAuditsHtml +=         OutputAuditName;
              if (auditResults[key].description){
                  OutputAuditsHtml += '<i class="arrowDown"></i>';
              }
              OutputAuditsHtml +=     '</span>';
              OutputAuditsHtml +=     '<span class="value">';
              OutputAuditsHtml +=         auditResults[key].displayValue;
              OutputAuditsHtml +=     '</span>';
              OutputAuditsHtml +=     '<span class="score ';
              if (auditResults[key].score < 0.5){OutputAuditsHtml += 'slow';}
              else if (auditResults[key].score < 0.9){OutputAuditsHtml += 'average';}
              else if (auditResults[key].score <= 1){OutputAuditsHtml += 'fast';}
              OutputAuditsHtml +=     '">'+auditResults[key].score;
              OutputAuditsHtml +=     '</span>';
              if (auditResults[key].description){  
                  OutputAuditsHtml += "<span class='description'>"+((auditResults[key].title)?"<b>"+auditResults[key].title+"</b>":"")+auditResults[key].description+"</span>";
              }
              OutputAuditsHtml +=  '</li>';
            }
          });
          $(".list-additional").html(OutputAuditsHtml);
          $(".newLighthouseStatistics").css({display:"block"});
          if (!$('.counterContainer').find(".totalTime").length)
            $('.counterContainer').find(".counterTitle").append("<span class='totalTime'>"+(lighthouse.timing.total/1000).toFixed(2)+" s</span>");
          else
            $('.counterContainer').find(".totalTime").html((lighthouse.timing.total/1000).toFixed(2)+" s");
          console.log(json);
        }else{
          /* ERROR HANDLING */
          var errorMessage = json.error.message;
          $(".progressBar").find(".counterContainer").removeClass("progress").addClass("error"); 
          $(".progressBar").find(".counterContainer").find(".counterAmount").css({width:"100%"});
          $(".progressBar").find(".errorMessage").append(": "+errorMessage.substring(0, 130));
        }
          
        // See https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed#response
        // to learn more about each of the properties in the response object.
        /*const cruxMetrics = {
          "First Contentful Paint": json.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category,
          "First Input Delay": json.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category
        };
        console.log(cruxMetrics); */
      });
} 
 
$(function(){ 
    var url = [];
    $('.getLighthouseData').on('click', function(){
        /* PROGRESS BAR */
        $(".progressBar").find(".counterContainer").find(".counterAmount").css({width:"0%"});
        $(".progressBar").find(".counterContainer").removeClass("progress").removeClass("error").removeClass("success");
        $(".progressBar").find(".counterContainer").addClass("progress");
        $(".progressBar").find(".counterContainer").find(".counterTitle").find(".errorMessage").html("error");
        /* SETTING UP GET REQUEST */
        url['Mobile'] = $(this).data('mobile');
        url['Desktop'] = $(this).data('desktop');
        var device = $("input[name=device]").filter(":checked");
        var deviceVal = $(device).val();
        var format = 'html'; 
        if($(this).data('format')){
            format = jQuery(this).data('format');
        } 
        fetchLighthouseData(url[deviceVal]);
    });
    $("input[type=radio][name=device]").change(function(){
      var deviceName = $(this).val();
      var targetUrl = $(".getLighthouseData").data(deviceName);
    })
});  
  