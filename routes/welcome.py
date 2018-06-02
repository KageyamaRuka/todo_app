from flask import (
    render_template,
    request,
    redirect,
    session,
    url_for,
    Blueprint,
    make_response,
)
from models.user import User
from utils import log


main = Blueprint('welcome', __name__)


def current_user():
    uid = session.get('uid', -1)
    u = User.find_by(id=uid)
    return u


def check_login():
    u = current_user()
    if u is None:
        return redirect(url_for(".welcome"))
    else:
        pass


@main.route("/", methods=['GET'])
def welcome():
    u = current_user()
    if u is None:
        username = "游客"
    else:
        username = u.username
    template = render_template("welcome.html", username=username)
    r = make_response(template)
    r.set_cookie('cookie_name', 'RUA')
    return r


@main.route("/register")
def register():
    return render_template("register.html")


@main.route("/login", methods=['POST'])
def login():
    log(request.form)
    u = User.validate_login(request.form)
    if u is None:
        return render_template("welcome.html", username="游客", message="用户不存在")
    else:
        session["uid"] = u.id
        return redirect(url_for(".index"))


@main.route("/index")
def index():
    u = current_user()
    if u is None:
        return redirect(url_for(".welcome"))
    else:
        return render_template("index.html", username=u.username)
