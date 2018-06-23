import os.path
import time
import json
import string
import secrets


def log(*args, **kwargs):
    dt = timestamp()
    with open('log.txt', 'a', encoding='utf-8') as f:
        print(dt, *args, file=f, **kwargs)


def timestamp():
    format = '%D %H:%M:%S'
    value = time.localtime(int(time.time()))
    ct = time.strftime(format, value)
    return ct


def json_body(ms):
    data = [m.json() for m in ms]
    header = 'HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n'
    body = json.dumps(data, ensure_ascii=False, indent=2)
    r = header + '\r\n' + body
    return r.encode(encoding='utf-8')


def randomStr(num):
    return ''.join(secrets.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(num))
