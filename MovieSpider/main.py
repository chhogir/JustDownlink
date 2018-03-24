 # -*- coding:utf-8 -*-
__author__ = "東飛"
__date__ = "2017-11-29"
from scrapy.cmdline import  execute
import  sys
import  os
print(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
# execute(["scrapy","crawl","dy2018"])
# execute(["scrapy","crawl","ygdy8"])
# execute(["scrapy","crawl","xunleicang"])
# execute(["scrapy","crawl","yyj268"])
# execute(["scrapy","crawl","mkv99"])
# execute(["scrapy","crawl","hao6v"])
# execute(["scrapy","crawl","loldyttw"])
# execute(["scrapy","crawl","lbldy"])
# execute(["scrapy","crawl","meijutt"])
# execute(["scrapy","crawl","dysfz"])
execute(["scrapy","crawl","btbtt"])
