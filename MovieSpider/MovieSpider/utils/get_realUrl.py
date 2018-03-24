# -*- coding:utf-8 -*-
__author__ = "東飛"
__date__ = "2018-1-18"
# 真实ftp、迅雷、QQ旋风下载地址之间的转换
import base64
import re

'''''
原理:
迅雷下载地址："thunder://"+Base64编码("AA"+"真实地址"+"ZZ")
QQ旋风下载地址:"qqdl://"+Base64编码("真实地址")
'''

#############
# 常量定义区 #
#############
THUNDER_HEADER = "thunder://"
THUNDER_PREFIX = "AA"
THUNDER_SUFFIX = "ZZ"
QQ_HEADER = "qqdl://"
ERROR = "传入的URL有误，请检查！"

# 判断url是否有效
def checkUrl(func):
    def wrapper(url):
        if re.match(r"(http|https|ftp|ed2k|thunder|qqdl)://", url):
            return func(url)
        else:
            return ERROR
    return wrapper

@checkUrl
def real2QQ(url):
    url = base64.b64encode(url.encode("utf-8"))
    url = QQ_HEADER + url.decode("utf-8")
    return url

@checkUrl
def qq2Real(url):
    url = url[len(QQ_HEADER):]
    url = base64.b64decode(url.encode("utf-8"))
    url = url.decode("utf-8")
    return url

@checkUrl
def real2Thunder(url):
    url = THUNDER_PREFIX + url + THUNDER_SUFFIX
    url = base64.b64encode(url.encode("utf-8"))
    url = THUNDER_HEADER + url.decode("utf-8")
    return url

@checkUrl
def thunder2Real(url):
    url = url[len(THUNDER_HEADER):]
    url = base64.b64decode(url.encode("utf-8"))
    url = url.decode("utf-8")
    url = url[len(THUNDER_PREFIX):-len(THUNDER_SUFFIX)]
    return url

@checkUrl
def qq2Thunder(url):
    return real2Thunder(qq2Real(url))

@checkUrl
def thunder2QQ(url):
    return real2QQ(thunder2Real(url))


if __name__ == "__main__":
    # 测试用，SuperGirl第一季第2集下载地址：
    url_1 = r'ftp://ygdy8:ygdy8@yg72.dydytt.net:8129/[阳光电影www.ygdy8.net].伏地魔：传人的起源.HD.720p.中英双字幕.mkv'
    print(real2Thunder(url_1))