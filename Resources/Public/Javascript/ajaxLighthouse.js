function getLighthouseData(selectFieldObj) {
    $.ajax({
        url: actionsPathFromViewHelperSetInTheView,
        data:{
            "tx_yourextkey_yourplugin[uid]":selectFieldObj.value
        },
        success:function (data) {
            // do something with your json
            alert('Load was performed.');
        }
    });
}