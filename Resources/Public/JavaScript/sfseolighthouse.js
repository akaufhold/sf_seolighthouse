$('.getLighthouseData').on('click', function(){
    var url = jQuery(this).data('url');
    var format = 'html';

    // if set use the format from the data attribute
    if(jQuery(this).data('format')){
        format = jQuery(this).data('format');
    }

    // send request
    jQuery.ajax({
    type: "POST",
    url: url,
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    },
    dataType: format,
    data: data,
    success: function (content) {
        // do something with your loaded content
        // remove old more-button
        // init new more-buttons
    }
    });
});

 