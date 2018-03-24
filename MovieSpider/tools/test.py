# -*- coding:utf-8 -*-
__author__ = "東飛"
__date__ = "2018-1-25"
from selenium import webdriver
from scrapy.selector import Selector
import codecs
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

# phantomjs、无界面浏览器、效率高、多进程情况小phantomjs性能下降严重

dcap = dict(DesiredCapabilities.PHANTOMJS)
dcap["phantomjs.page.settings.loadImages"] = False
service_args=[]
service_args.append('--load-images=no')  ##关闭图片加载
service_args.append('--disk-cache=yes')  ##开启缓存
service_args.append('--ignore-ssl-errors=true') ##忽略https错误

browser = webdriver.PhantomJS(executable_path="/usr/local/phantomjs/bin/phantomjs",desired_capabilities=dcap,service_args=service_args)
browser.get("https://www.80s.tw/movie/16012")
response = browser.page_source
# print(response)

# t_selector = Selector(text=response)
# f = codecs.open("C:/Users/29485/Desktop/1.html","w","utf-8")
# f.write(response)
# f.close()

# price = t_selector.xpath('//a[contains(@title,"第")]').extract()
# print(''.join(price))
browser.quit()

# f = open("C:/Users/29485/Desktop/1.html",'rb')
# response = f.read().decode('utf-8')
# t_selector = Selector(text=response)
# price = t_selector.xpath('//a[contains(@title,"第")]').extract()
# print(''.join(price))
