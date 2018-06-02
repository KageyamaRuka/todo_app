from flask import session
from models.user import User


def current_user():
    uid = session.get('uid', '')
    u = User.find_by(id=int(uid))
    return u
