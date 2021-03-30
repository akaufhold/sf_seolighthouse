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
          console.log(json);
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
              OutputAuditName   = key.replace("-"," ");
              OutputAuditsHtml += '<li class="list-group-item" id="'+key+'">';
              OutputAuditsHtml +=     '<span class="label">';
              if (auditResults[key].description){
                  OutputAuditsHtml += chevronDown;
              }
              OutputAuditsHtml +=         OutputAuditName;
              OutputAuditsHtml +=     '</span>';
              if (auditResults[key].displayValue!=undefined){
                  OutputAuditsHtml +=     '<span class="value">';
                  OutputAuditsHtml +=         auditResults[key].displayValue;
                  OutputAuditsHtml +=     '</span>';
              }
              if (auditResults[key].score){
                OutputAuditsHtml +=     '<span class="score ';
                if (auditResults[key].score < 0.5){OutputAuditsHtml += 'slow';}
                else if (auditResults[key].score < 0.9){OutputAuditsHtml += 'average';}
                else if (auditResults[key].score <= 1){OutputAuditsHtml += 'fast';}
                OutputAuditsHtml +=     '">'+auditResults[key].score;
                OutputAuditsHtml +=     '</span>';
              }
              if (auditResults[key].description){  
                  OutputAuditsHtml += "<span class='description'>"+((auditResults[key].title)?"<b>"+auditResults[key].title+"</b>":"")+auditResults[key].description;
                  if (auditResults[key].hasOwnProperty("details.screenshot")){
                    console.log(auditResults[key]+""+auditResults[key].details.screenshot);
                      OutputAuditsHtml += auditResults[key].details.screenshot
                  }
                  OutputAuditsHtml += "</span>";
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
        }else{
          /* ERROR HANDLING */
          var errorMessage = json.error.message;
          $(".progressBar").find(".counterContainer").removeClass("progress").addClass("error"); 
          $(".progressBar").find(".counterContainer").find(".counterAmount").css({width:"100%"});
          $(".progressBar").find(".errorMessage").append(": "+errorMessage.substring(0, 130));
        }
      });
} 
var chevronDown;
$(function(){ 
    requirejs(['TYPO3/CMS/Backend/Icons'], function(Icons) {
      // Get a single icon
      Icons.getIcon('actions-chevron-down', Icons.sizes.small).done(function(icon) {
        chevronDown = icon;
      });
    });
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
    });
    $(".list-lighthouse").on("click","li",function(){
      var listItem = $(this);
      $(".list-lighthouse").find("li").removeClass("active");
      if (!$(listItem).hasClass("active")){
        $(listItem).addClass("active");
      }
    });
});  
  