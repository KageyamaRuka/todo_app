
var timeString = function(timestamp) {
    t = new Date(timestamp * 1000)
    t = t.toLocaleTimeString()
    return t
}

var commentsTemplate = function(comments) {
    var html = ''
    for (var i = 0; i < comments.length; i++) {
        var c = comments[i]
        var t = `
            <div class='comment-content' id='${c.id}'>
                ${c.content}
                <button class="comment-delete">删除</button>
            </div>
        `
        html += t
    }
    return html
}

var WeiboTemplate = function(Weibo) {
    var content = Weibo.content
    var id = Weibo.id
    var comments = commentsTemplate(Weibo.comments)
    var t = `
        <div class='weibo-cell' id='weibo-${id}' data-id=${id}>
            <div class='weibo-content'>
                [WEIBO]: ${content}
            </div>
            <button class="weibo-delete">删除</button>
            <button class="weibo-edit">编辑</button>
            <div class="comment-list">
                ${comments}
            </div>
            <div class="comment-form">
                <input type="hidden" class="WeiboId" value="">
                <input class="comment-content">
                <br>
                <button class="comment-add">添加评论</button>
            </div>
        </div>
    `
    return t
}

var insertWeibo = function(Weibo) {
    var WeiboCell = WeiboTemplate(Weibo)
    var WeiboList = e('.weibo-list')
    WeiboList.insertAdjacentHTML('beforeend', WeiboCell)
}

var insertEditForm = function(cell) {
    var form = `
        <div class='Weibo-edit-form'>
            <input class="Weibo-edit-input">
            <button class='Weibo-update'>更新</button>
        </div>
    `
    cell.insertAdjacentHTML('afterbegin', form)
}

var removeEditForm = function(cell) {
    var f = cell.querySelector('.Weibo-edit-form')
    f.remove()
}

var loadWeibos = function() {
    apiWeiboAll(function(r) {
        var Weibos = JSON.parse(r)
        for (var i = 0; i < Weibos.length; i++) {
            var Weibo = Weibos[i]
            insertWeibo(Weibo)
        }
    })
}

var bindEventWeiboAdd = function() {
    var b = e('#id-button-add-weibo')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function() {
        var input = e('#id-input-weibo')
        var content = input.value
        log('click add', content)
        var form = {
            'content': content,
        }
        input.value = ''
        apiWeiboAdd(form, function(r) {
            var Weibo = JSON.parse(r)
            insertWeibo(Weibo)
        })
    })
}

var bindEventWeiboDelete = function() {
    var WeiboList = e('.weibo-list')
    WeiboList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('weibo-delete')) {
            var WeiboCell = self.parentElement
            var WeiboId = WeiboCell.dataset.id
            apiWeiboDelete(WeiboId, function(r) {
                log('删除成功', WeiboId)
                WeiboCell.remove()
            })
        }
    })
}

var bindEventWeiboEdit = function() {
    var WeiboList = e('.weibo-list')
    WeiboList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('weibo-edit')) {
            var WeiboCell = self.parentElement
            var WeiboContent = WeiboCell.querySelector('.weibo-content')
            WeiboContent.style.display = 'none'
            insertEditForm(WeiboCell)
        }
    })
}

var bindEventWeiboUpdate = function() {
    var WeiboList = e('.weibo-list')
    WeiboList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('Weibo-update')) {
            log('点击了 update')
            //
            var editForm = self.parentElement
            // querySelector 是 DOM 元素的方法
            // document.querySelector 中的 document 是所有元素的祖先元素
            var input = editForm.querySelector('.Weibo-edit-input')
            var content = input.value
            // 用 closest 方法可以找到最近的直系父节点
            var WeiboCell = self.closest('.weibo-cell')
            log(WeiboCell)
            var WeiboId = WeiboCell.dataset.id
            var form = {
                'id': WeiboId,
                'content': content,
            }
            apiWeiboUpdate(form, function(r) {
                log('更新成功', WeiboId)
                log(r)
                var Weibo = JSON.parse(r)
                var selector = '#weibo-' + Weibo.id
                var WeiboCell = e(selector)
                removeEditForm(WeiboCell)
                var content = WeiboCell.querySelector('.weibo-content')
                content.innerHTML = '[WEIBO]: ' + Weibo.content
                content.style.display = 'block'

                //                WeiboCell.remove()
            })
        }
    })
}

var bindEventCommentAdd = function() {
    var WeiboList = e('.weibo-list')
    WeiboList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('comment-add')) {
            log('点击了添加评论')
            var commentForm = self.parentElement
            var input = commentForm.querySelector('.comment-content')
            var content = input.value
            var WeiboCell = self.closest('.weibo-cell')
            var WeiboId = WeiboCell.dataset.id
            var form = {
                'weibo_id': WeiboId,
                'content': content,
            }
            input.value = ''
            apiCommentAdd(form, function(r) {
                // 收到返回的数据, 插入到页面中
                var Comment = JSON.parse(r)
                log(Comment)
                insertComment(Comment)
            })
        }
    })
}

var bindEventCommentDelete = function() {
    var WeiboList = e('.weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    WeiboList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('comment-delete')) {
            // 删除这个 Weibo
            var comment = self.parentElement
            var id = comment.id
            apiCommentDelete(id, function(r) {
                log('删除成功', id)
                comment.remove()
            })
        }
    })
}

var insertComment = function(Comment) {
    var comment = commentsTemplate([Comment])
    log("Comment template is ", comment)
    // 插入 Weibo-list
    var WeiboCell = e('#weibo-' + Comment.weibo_id)
    var commentList = WeiboCell.querySelector('.comment-list')
    commentList.insertAdjacentHTML('beforeend', comment)
}

var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
    bindEventCommentAdd()
    bindEventCommentDelete()
}

var __main = function() {
    bindEvents()
    loadWeibos()
}

__main()
