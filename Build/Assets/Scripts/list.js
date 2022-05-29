import '../Scss/backend.scss';

requirejs(['jquery'], function ($) {
    $(".outputControl").find(".custom-control").find("label").click(function(){
        $(".outputControl").find(".custom-radio").find("label").removeClass("active");
        $(this).addClass("active");
    });

    $("input[type=radio][name=valueType]").change(function(){
        let target  = $(this).val().toLowerCase();
        let classRow    = "row-"+target;
        $(".recordlist").find("tr").removeClass("active");
        $("."+classRow).addClass("active");
    });

})