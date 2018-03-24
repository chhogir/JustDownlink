# -*- coding:utf-8 -*-
__author__ = "東飛"
__date__ = "2017-12-2"
import hashlib
import re

# 定义md5方法
def get_md5(url):
    # python3 str就是Unicode类型
    if isinstance(url,str):
        url = url.encode("utf-8")
    m = hashlib.md5()
    m.update(url)
    return m.hexdigest()