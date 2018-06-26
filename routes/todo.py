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
from routes import current_user
from utils import (
    log,
    json_body,
)
import json


main = Blueprint('todo', __name__)


@main.route("/", methods=['GET'])
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
    log("user {}-{} add todo {}".format(u.id, u.username, t.json))
    return jsonify(t.json())


@main.route("/delete/<int:id>/")
def delete(id):
    u = current_user()
    t = Todo.delete(id)
    log("user {}-{} deleted todo {}".format(u.id, u.username, t.json))
    return jsonify(t.json())


@main.route("/update", methods=['POST'])
def update():
    form = json.loads(request.data.decode('utf-8'))
    log("request form is {} {}".format(form, type(form)))
    tid = form['id']
    t = Todo.update(int(tid), form)
    return jsonify(t.json())
