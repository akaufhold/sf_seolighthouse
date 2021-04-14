requirejs(['jquery'], function ($) {
    $(".outputControl").find(".custom-control").find("label").click(function(){
        $(".outputControl").find(".custom-radio").find("label").removeClass("active");
        $(this).addClass("active");
    });

    $("input[type=radio][name=valueType]").change(function(){
        var deviceName = $(this).val();
        console.log(deviceName);
        var classRow = ((deviceName=="Score")?"row-score":"row-vals");
        $(".recordlist").find("tr").removeClass("active");
        $("."+classRow).addClass("active");
    });

})