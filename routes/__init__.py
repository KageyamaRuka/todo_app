from flask import (
    redirect,
    session,
    url_for,
)
from models.user import User
from functools import wraps


def current_user():
    uid = session.get('uid', None)
    if uid is None:
        return None
    else:
        u = User.find_by(id=uid)
        return u


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        u = current_user()
        if u is None:
            return redirect(url_for("welcome.welcome"))
        else:
            return f(*args, **kwargs)
    return wrapper
