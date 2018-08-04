from utils import timestamp
from models import Model


class Todo(Model):
    __fields__ = Model.__fields__ + [
        ('user_id', str, ''),
        ('title', str, ''),
        ('completed', bool, False)
    ]

    @classmethod
    def complete(cls, id, completed=True):
        t = cls.find(id)
        t.completed = completed
        t.ut = timestamp()
        t.save()
        return t
