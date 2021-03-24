function runLighthouse(targetUrl) {
    fetch(targetUrl)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        // See https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed#response
        // to learn more about each of the properties in the response object.
        /*const cruxMetrics = {
          "First Contentful Paint": json.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category,
          "First Input Delay": json.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category
        };*/
        const lighthouse = json.lighthouseResult;
        const lighthouseMetrics = {
          'First Contentful Paint': lighthouse.audits['first-contentful-paint'].displayValue,
          'Speed Index': lighthouse.audits['speed-index'].displayValue,
          'Time To Interactive': lighthouse.audits['interactive'].displayValue,
          'First Meaningful Paint': lighthouse.audits['first-meaningful-paint'].displayValue,
          'First CPU Idle': lighthouse.audits['first-cpu-idle'].displayValue,
          'Estimated Input Latency': lighthouse.audits['estimated-input-latency'].displayValue
        };
      });
}

$(function(){ 
    var url = [];
    $('.getLighthouseData').on('click', function(){
        url['Mobile'] = jQuery(this).data('mobile');
        url['Desktop'] = jQuery(this).data('desktop');

        var device = $("input[name=device]").filter(":checked");
        var deviceVal = $(device).val();
        var format = 'html'; 
        console.log(deviceVal);
        // if set use the format from the data attribute
        if($(this).data('format')){
            format = jQuery(this).data('format');
        }
        runLighthouse(url[deviceVal]);
        // send request
        /*jQuery.ajax({
        type: "GET",
        url: url[deviceVal],
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        },
        dataType: format,
        success: function (content) {
            // do something with your loaded content
            // remove old more-button
            // init new more-buttons
        }
        });*/


    });
});  
  