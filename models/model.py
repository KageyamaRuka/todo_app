from pymongo import MongoClient
from utils import timestamp
mongo = MongoClient()


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
    new_id = doc.find_and_modify(**kwargs).get('seq')
    return new_id


class Mongo(object):
    __fields__ = [
        '_id',
        # (字段名, 类型, 值)
        ('id', int, -1),
        ('type', str, ''),
        ('deleted', bool, False),
        ('ct', int, 0),
        ('ut', int, 0),
    ]

    @classmethod
    def new(cls, form=None, **kwargs):
        """
        new 是给外部使用的函数
        """
        name = cls.__name__
        m = cls()
        fields = cls.__fields__.copy()
        # 去掉 _id 这个特殊的字段
        fields.remove('_id')
        # 把定义的数据写入空对象
        if form is None:
            form = {}
        for f in fields:
            k, t, v = f
            if k in form:
                setattr(m, k, t(form[k]))
            else:
                # 设置默认值
                setattr(m, k, v)
        # 处理额外的参数 kwargs, 未定义的数据输出错误
        for k, v in kwargs.items():
            if hasattr(m, k):
                setattr(m, k, v)
            else:
                raise KeyError
        # 写入默认数据
        m.id = next_id(name)
        m.type = name.lower()
        ts = timestamp()
        m.ct = ts
        m.ut = ts
        # 特殊 model 的自定义设置
        # m._setup(form)
        m.save()
        return m

    def save(self):
        name = self.__class__.__name__
        mongo.db[name].save(self.__dict__)
