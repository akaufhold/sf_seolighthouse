requirejs(['jquery'], function ($) {
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
          ["first-contentful-paint", "fcp"],["speed-index", "si"],["interactive", "tti"],["largest-contentful-paint", "lcp"],["total-blocking-time", "tbt"],["cumulative-layout-shift", "cls"]
      ];
      const environmentAudits = [
          ["benchmarkIndex", "bi"],["dom-size", "ds"]
      ];
      const individualAudits  = [
          ["Overall Score","os"]
      ];
      /* DECLARATION VARS */
      var me = this;
      var OutputAuditName;
      var OutputAuditsHtml;
      var url = [];
      var pb = $(".progressBar");
      var cc = $(".progressBar").find(".counterContainer");

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
                format = jQuery(this).data('format');
            } 
            /* CALL LIGHTHOUSE REQUEST */
            me.fetchLighthouseData(me.getDevice(thisis));
        });

        $("input[type=radio][name=device]").change(function(){
          var deviceName = $(this).val();
          var targetUrl = $(".getLighthouseData").data(deviceName.toLowerCase());
          $(".targetUrl").html(targetUrl);
        });
          
        $(".list-lighthouse").on("click","li",function(){
          var listItem = $(this);
          $(".list-lighthouse").find("li").removeClass("active");
          if (!$(listItem).hasClass("active")){
            $(listItem).addClass("active");
          }
        });
    };

    me.fetchLighthouseData = function(targetUrl) {
      fetch(targetUrl)
        .then(response => response.json())
        .then(json => {
          if (!json.hasOwnProperty("error")){
            OutputAuditsHtml = "";
            var speed, score, displayValue, screenshot, displayMode;
            const lighthouse = json.lighthouseResult;
            const auditResults = lighthouse.audits;
            me.pbReset();
            me.setPbStatus("success");
            /* MAIN AUDIT PROPERTIES */
            mainAudits.forEach(function(value){
                displayValue      = auditResults[value[0]].displayValue;
                score             = auditResults[value[0]].score;
                if (score < 0.5){speed = 'slow';} 
                else if (score < 0.9){speed = 'average';} 
                else if (score <= 1){speed = 'fast';}
                OutputAuditName   = value[0].replace("-"," ");
                OutputAuditsHtml += '<li class="list-group-item" id="list-'+value[1]+'">';
                OutputAuditsHtml +=     me.addSpan("label",OutputAuditName);
                OutputAuditsHtml +=     me.addSpan("value", displayValue);
                OutputAuditsHtml +=     me.addSpan("score "+speed,score);
                OutputAuditsHtml += '</li>';
                $("#"+value[1]).val(parseFloat(displayValue.replace(',', '.')));
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
                    if (score < 0.5){speed = 'slow';} else if (score < 0.9){speed = 'average';} else if (score <= 1){speed = 'fast';}
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
            console.log(json);
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
        var output  = '<span class="'+htmlClass+'">';
        output      +=    value;
        output      += '</span>';
        return output;
    }
  }

  $(document).ready(function () {
      var lighthousedata = new LighthouseData();
      lighthousedata.init();
  });
});