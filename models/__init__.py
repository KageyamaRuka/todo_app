from utils import (
    log,
    timestamp,
)
from pymongo import MongoClient

mongo = MongoClient()


class Model(object):
    __fields__ = [
        '_id',
        ('id', str, -1),
        ('type', str, ''),
        ('deleted', str, 'false'),
        ('ct', str, 0),
        ('ut', str, 0),
    ]

    @staticmethod
    def next_id(name):
        query = {
            'name': name,
        }
        update = {
            '$inc': {
                'seq': 1
            }
        }
        kwargs = {
            'query': query,
            'update': update,
            'upsert': True,
            'new': True,
        }
        doc = mongo.db['data_id']
        new_id = str(doc.find_and_modify(**kwargs).get('seq'))
        return new_id

    @classmethod
    def new(cls, form=None, **kwargs):
        name = cls.__name__
        if form is None:
            form = {}
        m = cls._new_from_dict(form, **kwargs)
        m.id = m.next_id(name)
        ts = timestamp()
        m.ct = ts
        m.ut = ts
        m.type = name.lower()
        m.save()
        return m

    def save(self):
        name = self.__class__.__name__
        mongo.db[name].save(self.__dict__)

    @classmethod
    def all(cls):
        return cls._find()

    @classmethod
    def _new_from_dict(cls, dic, **kwargs):
        m = cls()
        fields = cls.__fields__.copy()
        fields.remove('_id')
        for f in fields:
            k, t, v = f
            if k in dic:
                setattr(m, k, t(dic[k]))
            else:
                setattr(m, k, v)

        for k, v in kwargs.items():
            if hasattr(m, k):
                setattr(m, k, v)
            else:
                raise KeyError

        return m

    @classmethod
    def _new_with_bson(cls, bson):
        m = cls._new_from_dict(bson)
        setattr(m, '_id', bson['_id'])
        return m

    @classmethod
    def _find(cls, **kwargs):
        name = cls.__name__
        kwargs['deleted'] = 'false'
        ds = mongo.db[name].find(kwargs)
        l = [cls._new_with_bson(d) for d in ds]
        return l

    @classmethod
    def find_all(cls, **kwargs):
        return cls._find(**kwargs)

    @classmethod
    def find_by(cls, **kwargs):
        return cls.find_one(**kwargs)

    @classmethod
    def find(cls, id):
        return cls.find_one(id=id)

    @classmethod
    def find_one(cls, **kwargs):
        l = cls._find(**kwargs)
        if len(l) > 0:
            return l[0]
        else:
            return None

    @classmethod
    def insert(cls, query_form, update_form, force=False):
        ms = cls.find_one(**query_form)
        if ms is None:
            query_form.update(**update_form)
            ms = cls.new(query_form)
        else:
            ms.update(update_form, force=force)
        return ms

    @classmethod
    def update(cls, id, form, force=False):
        log("update_form is {}".format(form))
        s = cls.find(id)
        for k, v in form.items():
            if force or hasattr(s, k):
                setattr(s, k, v)
        s.ut = timestamp()
        s.save()
        return s

    @classmethod
    def delete(cls, id):
        name = cls.__name__
        query = {
            'id': id,
        }
        update = {
            '$set': {
                'deleted': True
            }

        }
        mongo.db[name].update_one(query, update)

    def blacklist(self):
        b = [
            '_id',
            'type',
        ]
        return b

    def json(self):
        _dict = self.__dict__
        d = {k: v for k, v in _dict.items() if k not in self.blacklist()}
        return d

    def data_count(self, cls):
        name = cls.__name__
        # TODO, 这里应该用 type 替代
        fk = '{}_id'.format(self.__class__.__name__.lower())
        query = {
            fk: self.id,
        }
        count = mongo.db[name]._find(query).count()
        return count

    def __repr__(self):
        name = self.__class__.__name__
        properties = ('{0} = {1}'.format(k, v)
                      for k, v in self.__dict__.items())
        return '<{0}: \n  {1}\n>'.format(name, '\n  '.join(properties))

# def save(data, path):
#     s = json.dumps(data, indent=2, ensure_ascii=False)
#     with open(path, 'w+', encoding='utf-8') as f:
#         f.write(s)


# def load(path):
#     with open(path, 'r', encoding='utf-8') as f:
#         s = f.read()
#         return json.loads(s)


# class Model(object):
#     @classmethod
#     def db_path(cls):
#         classname = cls.__name__
#         path = 'data/{}.txt'.format(classname)
#         return path

#     @classmethod
#     def _new_from_dict(cls, d):
#         m = cls({})
#         for k, v in d.items():
#             setattr(m, k, v)
#         return m

#     @classmethod
#     def new(cls, form):
#         m = cls(form)
#         m.id = None
#         m.save()
#         return m

#     @classmethod
#     def all(cls):
#         path = cls.db_path()
#         models = load(path)
#         ms = [cls._new_from_dict(m) for m in models]
#         return ms

#     @classmethod
#     def find_all(cls, **kwargs):
#         ms = []
#         k, v = '', ''
#         for key, value in kwargs.items():
#             k, v = key, value
#         all = cls.all()
#         for m in all:
#             if getattr(m, k) == v:
#                 ms.append(m)
#         return ms

#     @classmethod
#     def find_by(cls, **kwargs):
#         k, v = '', ''
#         for key, value in kwargs.items():
#             k, v = key, value
#         all = cls.all()
#         for m in all:
#             if getattr(m, k) == v:
#                 return m
#         return None

#     @classmethod
#     def find(cls, id):
#         return cls.find_by(id=id)

#     def save(self):
#         models = self.all()
#         if self.id is None:
#             if len(models) == 0:
#                 self.id = 1
#             else:
#                 m = models[-1]
#                 self.id = m.id + 1
#             models.append(self)
#         else:
#             index = -1
#             for i, m in enumerate(models):
#                 if m.id == self.id:
#                     index = i
#                     models[index] = self
#                     break
#         l = [m.__dict__ for m in models]
#         path = self.db_path()
#         save(l, path)

#     @classmethod
#     def delete(cls, id):
#         models = cls.all()
#         index = -1
#         for i, m in enumerate(models):
#             if m.id == id:
#                 index = i
#                 break

#         if index == -1:
#             pass
#         else:
#             obj = models.pop(index)
#             l = [m.__dict__ for m in models]
#             path = cls.db_path()
#             save(l, path)
#             return obj

#     def json(self):
#         d = self.__dict__.copy()
#         return d

#     def __repr__(self):
#         classname = self.__class__.__name__
#         properties = ['{}: ({})'.format(k, v)
#                       for k, v in self.__dict__.items()]
#         s = '\n'.join(properties)
#         return '< {}\n{} \n>\n'.format(classname, s)
