from flask import (
    render_template,
    request,
    redirect,
    session,
    url_for,
    Blueprint,
    make_response,
    jsonify,
)
from models.todo import Todo
from routes import (
    current_user,
    login_required,
)
from utils import (
    log,
)
import json


main = Blueprint('todo', __name__)


@main.route("/", methods=['GET'])
@login_required
def index():
    return render_template("todo/index.html")


@main.route("/todos", methods=['GET'])
def todos():
    u = current_user()
    ts = Todo.find_all(user_id=u.id)
    return jsonify([t.json() for t in ts])


@main.route("/add", methods=['POST'])
def add():
    form = json.loads(request.data.decode('utf-8'))
    t = Todo.new(form)
    u = current_user()
    t.user_id = u.id
    t.save()
    log(t.json())
    return jsonify(t.json())


@main.route("/delete/<string:id>/")
def delete(id):
    Todo.delete(id)
    return json.dumps({'success': True}), 200, {
        'ContentType': 'application/json'}


@main.route("/update", methods=['POST'])
def update():
    form = json.loads(request.data.decode('utf-8'))
    tid = form['id']
    t = Todo.update(tid, form)
    return jsonify(t.json())
