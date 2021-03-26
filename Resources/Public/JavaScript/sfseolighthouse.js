function fetchLighthouseData(targetUrl) {
    fetch(targetUrl)
      .then(response => response.json())
      .then(json => {
        if (!json.hasOwnProperty("error")){
          $(".progressBar").find(".counterContainer").removeClass("progress"); 
          $(".progressBar").find(".counterContainer").addClass("success"); 
          const lighthouse = json.lighthouseResult;
          const lighthouseMetrics = {
            'score':lighthouse.categories.performance.score,
            'fcp': lighthouse.audits['first-contentful-paint'].displayValue,            //First Contentful Paint
            'si': lighthouse.audits['speed-index'].displayValue,                        //Speed Index
            'tti': lighthouse.audits['interactive'].displayValue,                       //Time To Interactive
            'fmp': lighthouse.audits['first-meaningful-paint'].displayValue,            //First Meaningful Paint
            'fci': lighthouse.audits['first-cpu-idle'].displayValue,                    //First CPU Idle
            'eil': lighthouse.audits['estimated-input-latency'].displayValue,           //Estimated Input Latency
            'bi': lighthouse.environment['benchmarkIndex'],                             //Benchmark Index
          };
          $('.counterContainer').find(".counterTitle").append("<span class='totalTime'>"+(lighthouse.timing.total/1000).toFixed(2)+" s</span>");
          console.log(lighthouseMetrics);
          return lighthouse;
        }else{
          var errorMessage = json.error.message;
          $(".progressBar").find(".counterContainer").removeClass("progress"); 
          $(".progressBar").find(".counterContainer").addClass("error"); 
          $(".progressBar").find(".errorMessage").append(": "+errorMessage.substring(0, 70));
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
});  
  