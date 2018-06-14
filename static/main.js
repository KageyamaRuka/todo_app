var log = function() {
    console.log.apply(console, arguments)
}

var e = function(sel) {
    return document.querySelector(sel)
}

var ajax = function(method, path, data, responseCallback) {
    var r = new XMLHttpRequest()
    // 设置请求方法和请求地址
    r.open(method, path, true)
    // 设置发送的数据的格式为 application/json
    // 这个不是必须的
    r.setRequestHeader('Content-Type', 'application/json')
    // 注册响应函数
    r.onreadystatechange = function() {
        if (r.readyState === 4) {
            // r.response 存的就是服务器发过来的放在 HTTP BODY 中的数据
            responseCallback(r.response)
        }
    }
    // 把数据转换为 json 格式字符串
    data = JSON.stringify(data)
    // 发送请求
    r.send(data)
}


var apiTodoAll = function(callback) {
    var path = '/todo/todos'
    ajax('GET', path, '', callback)
}


var apiTodoAdd = function(form, callback) {
    var path = '/todo/add'
    ajax('POST', path, form, callback)
}


var apiTodoDelete = function(id, callback) {
    var path = '/todo/delete/' + id
    ajax('GET', path, '', callback)
}


var apiTodoUpdate = function(form, callback) {
    var path = '/todo/update'
    ajax('POST', path, form, callback)
}


var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
}


var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}

var apiWeiboDelete = function(id, callback) {
    var path = '/api/weibo/delete?id=' + id
    ajax('GET', path, '', callback)
}

var apiWeiboUpdate = function(form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}

var apiCommentAdd = function(form, callback) {
    var path = '/api/comment/add'
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function(id, callback) {
    var path = '/api/comment/delete?id=' + id
    ajax('GET', path, '', callback)
}