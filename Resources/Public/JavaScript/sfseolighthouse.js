function fetchLighthouseData(targetUrl) {
    fetch(targetUrl)
      .then(response => response.json())
      .then(json => {
        if (!json.hasOwnProperty("error")){
          $(".progressBar").find(".counterContainer").removeClass("progress"); 
          $(".progressBar").find(".counterContainer").addClass("success"); 
          $(".progressBar").find(".counterContainer").find(".counterAmount").css({width:"100%"});
          const lighthouse = json.lighthouseResult;
          $("#fcp").find("input").val(lighthouse.audits['first-contentful-paint'].displayValue);
          $("#fcp").find(".value").html(lighthouse.audits['first-contentful-paint'].displayValue);
          $("#si").find("input").val(lighthouse.audits['speed-index'].displayValue);
          $("#si").find(".value").html(lighthouse.audits['speed-index'].displayValue);
          $("#tti").find("input").val(lighthouse.audits['interactive'].displayValue);
          $("#tti").find(".value").html(lighthouse.audits['interactive'].displayValue);
          $("#fmp").find("input").val(lighthouse.audits['first-meaningful-paint'].displayValue);
          $("#fmp").find(".value").html(lighthouse.audits['first-meaningful-paint'].displayValue);
          $("#fci").find("input").val(lighthouse.audits['first-cpu-idle'].displayValue);
          $("#fci").find(".value").html(lighthouse.audits['first-cpu-idle'].displayValue);
          $("#eil").find("input").val(lighthouse.audits['estimated-input-latency'].displayValue);
          $("#eil").find(".value").html(lighthouse.audits['estimated-input-latency'].displayValue);

          const lighthouseMetrics = {
            'score':lighthouse.categories.performance.score,
            'bi': lighthouse.environment['benchmarkIndex'],                   
          };

          console.log(lighthouseMetrics);
          /*lighthouseMetrics.each(function(key,value){
              console.log(key);
          })*/
          $('.counterContainer').find(".counterTitle").append("<span class='totalTime'>"+(lighthouse.timing.total/1000).toFixed(2)+" s</span>");
          console.log(json);
          return lighthouse;
        }else{
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
        };*/

      });
} 
 
$(function(){ 
    var url = [];
    $('.getLighthouseData').on('click', function(){
        //$(".progressBar").find(".counterContainer").find(".counterAmount").css({width:"0%"});
        $(".progressBar").find(".counterContainer").removeClass("progress");
        $(".progressBar").find(".counterContainer").find(".counterTitle").find(".errorMessage").html("error");
        //console.log($(".progressBar").find(".counterAmount"));
        $(".progressBar").find(".counterContainer").addClass("progress");
        url['Mobile'] = $(this).data('mobile');
        url['Desktop'] = $(this).data('desktop');
        var device = $("input[name=device]").filter(":checked");
        var deviceVal = $(device).val();
        var format = 'html'; 
        if($(this).data('format')){
            format = jQuery(this).data('format');
        } 
        var lhm = fetchLighthouseData(url[deviceVal]);
    });
    $("input[type=radio][name=device]").change(function(){
      var deviceName = $(this).val();
      var targetUrl = $(".getLighthouseData").data(deviceName);

    })
});  
  