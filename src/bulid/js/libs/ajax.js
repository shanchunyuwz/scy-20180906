function ajax(opt) {
    // 默认参数
    var def = {
            type: "get",
            async: true,
            data: null,
            success: null,
            error: null
        },
        settings = extend({}, def, opt),
        data = typeof settings.data === "string" ? settings.data : format(settings.data);
    // 四大步
    var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                settings.success && settings.success(xhr.responseText)
            } else {
                settings.error && settings.error()
            }
        }
    };
    if (settings.type === "get") {
        xhr.open(settings.type, settings.url + "?" + data, settings.async);
        xhr.send(null);
    } else {
        xhr.open(settings.type, settings.url, settings.async);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urllencoded,charset=utf-8');
        xhr.send(data);
    };

}
// 合并参数
function extend() {
    for (var i = 0; i < arguments.length; i++) {
        for (var k in arguments[i]) {
            arguments[0][k] = arguments[i][k]
        }
    }
    return arguments[0]
}
// 格式化参数
function format(obj) {
    var arr = [];
    for (var k in obj) {
        arr.push(k + "k" + obj[k])
    }
    return arr.join("&")
}