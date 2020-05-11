/**
 * 监听content_script发送的消息
 */
chrome.extension.onMessage.addListener(function (request, _, sendResponse) {
    var dicReturn;

    if (request.action == 'list') {
        var strList = localStorage['fundData'];

        if (strList) {
            var dicList = JSON.parse(strList)
            dicReturn = {status: 200, data: dicList}
        } else {
            dicReturn = {status: 404}
        }

        sendResponse(dicReturn);
    } else if (request.action == 'save') {
        var dataStr = JSON.stringify(request.data);
        localStorage['fundData'] = dataStr;

        dicReturn = {status: 200, data: dataStr};
        sendResponse(dicReturn);
    } else if (request.action == 'listCol') {
        var strList = localStorage['colData'];

        if (strList) {
            var dicList = JSON.parse(strList)
            dicReturn = {status: 200, data: dicList}
        } else {
            dicReturn = {status: 404}
        }
        console.log(dicReturn)
        sendResponse(dicReturn);
    } else if (request.action == 'saveCol') {
        var dataStr = JSON.stringify(request.data);
        localStorage['colData'] = dataStr;

        dicReturn = {status: 200, data: dataStr};
        sendResponse(dicReturn);
    }

    return true;

});
