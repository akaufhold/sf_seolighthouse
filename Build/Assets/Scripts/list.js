import '../Scss/backend.scss';

requirejs(['jquery'], function ($) {
    $(".outputControl").find(".custom-control").find("label").click(function(){
        $(".outputControl").find(".custom-radio").find("label").removeClass("active");
        $(this).addClass("active");
    });

    $("input[type=radio][name=valueType]").change(function(){
        var target  = $(this).val().toLowerCase();
        var classRow    = "row-"+target;
        $(".recordlist").find("tr").removeClass("active");
        $("."+classRow).addClass("active");
    });

})