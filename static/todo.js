var timeString = function(timestamp) {
    t = new Date(timestamp * 1000)
    t = t.toLocaleTimeString()
    return t
}

var todoTemplate = function(todo) {
    var title = todo.title
    var id = todo.id
    var ct = todo.ut
    var ut = todo.ut
    var completed = todo.completed
    // data-xx 是自定义标签属性的语法
    // 通过这样的方式可以给任意标签添加任意属性
    // 假设 d 是 这个 div 的引用
    // 这样的自定义属性通过  d.dataset.xx 来获取
    // 在这个例子里面, 是 d.dataset.id
    var t = `   
        <tr class="todo-cell" data-id="${id}">
            <th class='todo-id' scope="row">${id}</th>
            <td class='todo-title'>${title}</td>
            <td class='todo-ct'>${ct}</td>
            <td class='todo-ut'>${ut}</td>
            <td class='todo-completed'>${completed}</td>
            <td>
                <button class="todo-delete btn btn-danger">Delelte</button>
                <button class="todo-edit btn btn-primary">Edit</button>
            </td>
        </tr>
    `
    return t
}

var insertTodo = function(todo) {
    var todoCell = todoTemplate(todo)
    var todoList = e('.todo-list')
    todoList.insertAdjacentHTML('beforeend', todoCell)
}

var insertEditForm = function(cell) {
    var form = `
        <div class='todo-edit-form'>
            <input class="todo-edit-input form-control">
            <button class='todo-update btn btn-primary'>Update</button>
        </div>
    `
    cell.insertAdjacentHTML('beforeend', form)
}

var loadTodos = function() {
    apiTodoAll(function(r) {
        var todos = JSON.parse(r)
        for (var i = 0; i < todos.length; i++) {
            var todo = todos[i]
            insertTodo(todo)
        }
    })
}

var bindEventTodoAdd = function() {
    var b = e('#id-button-add')
    b.addEventListener('click', function() {
        var input = e('#id-input-todo')
        var title = input.value
        var form = {
            'title': title,
        }
        apiTodoAdd(form, function(r) {
            var todo = JSON.parse(r)
            insertTodo(todo)
        })
    })
}

var bindEventTodoDelete = function() {
    var todoList = e('.todo-list')
    todoList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('todo-delete')) {
            var todoCell = self.parentElement.parentElement
            var todo_id = todoCell.dataset.id
            apiTodoDelete(todo_id, function(r) {
                todoCell.remove()
            })
        }
    })
}

var bindEventTodoEdit = function() {
    var todoList = e('.todo-list')
    todoList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('todo-edit')) {
            var todoCell = self.parentElement.parentElement
            var todoTitle = todoCell.querySelector('.todo-title')
            todoTitle.remove()
            insertEditForm(todoCell)
        }
    })
}


var bindEventTodoUpdate = function() {
    var todoList = e('.todo-list')
    todoList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('todo-update')) {
            log('点击了 update ')
            //
            var editForm = self.parentElement
            // querySelector 是 DOM 元素的方法
            // document.querySelector 中的 document 是所有元素的祖先元素
            var input = editForm.querySelector('.todo-edit-input')
            var title = input.value
            // 用 closest 方法可以找到最近的直系父节点
            var todoCell = self.closest('.todo-cell')
            var todo_id = todoCell.dataset.id
            var form = {
                'id': todo_id,
                'title': title,
            }
            apiTodoUpdate(form, function(r) {
                log('更新成功', todo_id)
                var todo = JSON.parse(r)
                var selector = '#todo-' + todo.id
                var todoCell = e(selector)
                var titleSpan = todoCell.querySelector('.todo-title')
                titleSpan.innerHTML = todo.title
                //                todoCell.remove()
            })
        }
    })
}

var bindEvents = function() {
    bindEventTodoAdd()
    bindEventTodoDelete()
    bindEventTodoEdit()
    bindEventTodoUpdate()
}

var __main = function() {
    bindEvents()
    loadTodos()
}

__main()
