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
            <td class='todo-title'>
                <div>
                    <p>${title}</p>
                </div>
            </td>
            <td class='todo-ct'>${ct}</td>
            <td class='todo-ut'>${ut}</td>
            <td class='todo-completed'>${completed}</td>
            <td>
                <button class="todo-delete btn btn-danger">Delelte</button>
                <button class="todo-edit btn btn-warning">Edit</button>
                <button class="todo-complete btn btn-success">Complete</button>
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

var insertUpdateBtn = function(cell) {
    var btn = `
    <input id='id-input-edit'>
    <button class="todo-update btn btn-info">Update</button>
    `
    cell.insertAdjacentHTML('beforeend', btn)
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
        input.value = ''
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
            var div = todoTitle.querySelector('div')
            insertUpdateBtn(div)
            self.disable = true
        }
    })
}


var bindEventTodoUpdate = function() {
    var todoList = e('.todo-list')
    todoList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('todo-update')) {
            var div = self.parentElement
            var input = div.querySelector('#id-input-edit')
            var newTitle = input.value
            var todoCell = self.closest('.todo-cell')
            var todo_id = todoCell.dataset.id
            input.remove()
            self.remove()
            var form = {
                'id': todo_id,
                'title': newTitle,
            }
            apiTodoUpdate(form, function(r) {
                var todo = JSON.parse(r)
                log(todo)
                var p = todoCell.querySelector('.todo-title').querySelector('div').querySelector('p')
                var ut = todoCell.querySelector('.todo-ut')
                var editbtn = todoCell.querySelector('.todo-edit')
                editbtn.style.visibility = ''
                p.innerHTML = todo.title
                ut.innerHTML = todo.ut
            })
        }
    })
}

var bindEventTodoComplete = function() {
    var todoList = e('.todo-list')
    todoList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('todo-complete')) {
            log('btn complete clicked!')
            var todoCell = self.closest('.todo-cell')
            var todo_id = todoCell.dataset.id
            var form = {
                'id': todo_id,
                'completed': true,
            }
            apiTodoUpdate(form, function(r) {
                var todo = JSON.parse(r)
                log(todo)
                var c = todoCell.querySelector('.todo-completed')
                var ut = todoCell.querySelector('.todo-ut')
                c.innerHTML = todo.completed
                ut.innerHTML = todo.ut
            })
        }
    })
}

var bindEvents = function() {
    bindEventTodoAdd()
    bindEventTodoDelete()
    bindEventTodoEdit()
    bindEventTodoUpdate()
    bindEventTodoComplete()
}

var __main = function() {
    bindEvents()
    loadTodos()
}

__main()
