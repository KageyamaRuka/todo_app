from utils import timestamp
from models import Model


class Todo(Model):
    def __init__(self, form):
        self.id = None
        self.user_id = None
        self.title = form.get('title', '')
        self.completed = False
        self.ct = timestamp()
        self.ut = timestamp()

    @classmethod
    def update(cls, id, form):
        t = cls.find(id)
        valid_names = [
            'title',
            'completed'
        ]
        for key in form:
            if key in valid_names:
                setattr(t, key, form[key])
        t.ut = timestamp()
        t.save()
        return t

    @classmethod
    def complete(cls, id, completed=True):
        t = cls.find(id)
        t.completed = completed
        t.ut = timestamp()
        t.save()
        return t
