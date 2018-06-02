from flask import Flask
from routes.welcome import main as welcome
from routes.user import main as user
from routes.todo import main as todo
from utils import log

app = Flask(__name__)
app.secret_key = 'deepdarkfantasy'


app.register_blueprint(todo, url_prefix='/todo')
app.register_blueprint(user, url_prefix='/user')
app.register_blueprint(welcome)
app.config['JSON_AS_ASCII'] = False
log(app.view_functions)


if __name__ == '__main__':
    config = dict(
        debug=True,
        host='0.0.0.0',
        port=5000,
    )
    app.run(**config)
