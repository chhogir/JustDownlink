# -*- coding: utf-8 -*-

# Define here the models for your spider middleware
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/spider-middleware.html

from scrapy import signals
from fake_useragent import UserAgent
# from tools.crawl_goubanjia_ip import GetIP
from tools.crawl_xici_ip import GetIP
from MovieSpider import settings
from scrapy.xlib.pydispatch import dispatcher
from scrapy.http import HtmlResponse
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities


class MoviespiderSpiderMiddleware(object):
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the spider middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_spider_input(self, response, spider):
        # Called for each response that goes through the spider
        # middleware and into the spider.

        # Should return None or raise an exception.
        return None

    def process_spider_output(self, response, result, spider):
        # Called with the results returned from the Spider, after
        # it has processed the response.

        # Must return an iterable of Request, dict or Item objects.
        for i in result:
            yield i

    def process_spider_exception(self, response, exception, spider):
        # Called when a spider or process_spider_input() method
        # (from other spider middleware) raises an exception.

        # Should return either None or an iterable of Response, dict
        # or Item objects.
        pass

    def process_start_requests(self, start_requests, spider):
        # Called with the start requests of the spider, and works
        # similarly to the process_spider_output() method, except
        # that it doesn’t have a response associated.

        # Must return only requests (not items).
        for r in start_requests:
            yield r

    def spider_opened(self, spider):
        spider.logger.info('Spider opened: %s' % spider.name)


class RandomUserAgentMiddleware(object):
    # site-packages/scrapy/downloadermiddlewares/useragent.py
    # 随机更换user-agent
    # 注意from_XXX 方法
    # 使用fake_useragent
    def __init__(self, crawler):
        super(RandomUserAgentMiddleware, self).__init__()
        self.ua = UserAgent()
        self.ua_type = crawler.settings.get('RANDOM_UA_TYPE', "random")
        # 设置ua类型
        # self.user_agent_list = crawler.settings.get("USER_AGENT_LIST",[])

    @classmethod
    def from_crawler(cls, crawler):
        return cls(crawler)

    def process_request(self, request, spider):
        '''
         :param request:
         :param spider:
         :return:
         Gets random UA based on the type setting (random, firefox…)
        '''

        def get_ua():
            return getattr(self.ua, self.ua_type)

        # r = get_ua()
        # request.headers.setdefault('User-Agent', self.ua.random)
        request.headers.setdefault('User-Agent', get_ua())


class RandomProxyMiddleware(object):
    # 动态设置代理ip
    # 西刺代理 www.xicidaili.com
    # request.meta["proxy"] = "http://123.56.109.24:808/"
    def process_request(self, request, spider):
        get_ip = GetIP()
        request.meta["proxy"] = get_ip.get_random_ip()


# 爬取动态网页数据
class PhantomJSMiddleware(object):
    # def __init__(self):
    #
    #     # 参照：https://www.jianshu.com/p/9d408e21dc3a
    #
    #     # 设置 PhantomJS 配置
    #     dcap = dict(DesiredCapabilities.PHANTOMJS)
    #     #从USER_AGENTS列表中随机选一个浏览器头，伪装浏览器
    #     ua = UserAgent()
    #     dcap["phantomjs.page.settings.userAgent"] = (ua.random)
    #
    #     # 不载入图片，爬页面速度会快很多
    #     dcap["phantomjs.page.settings.loadImages"] = False
    #
    #
    #     # 设置代理
    #     # service_args = ['--proxy=127.0.0.1:9999','--proxy-type=socks5']
    #     service_args=[]
    #     service_args.append('--load-images=no')  ##关闭图片加载
    #     service_args.append('--disk-cache=yes')  ##开启缓存
    #     service_args.append('--ignore-ssl-errors=true') ##忽略https错误
    #
    #     #打开带配置信息的phantomJS浏览器
    #     self.driver = webdriver.PhantomJS(executable_path="D:/Program Files/phantomjs-2.1.1-windows/bin/phantomjs.exe",desired_capabilities=dcap,service_args=service_args)
    #
    #     # 隐式等待5秒，可以自己调节
    #     self.driver.implicitly_wait(5)
    #     # 设置10秒页面超时返回，类似于requests.get()的timeout选项，driver.get()没有timeout选项
    #     # 以前遇到过driver.get(url)一直不返回，但也不报错的问题，这时程序会卡住，设置超时选项能解决这个问题。
    #     self.driver.set_page_load_timeout(10)
    #     # 设置10秒脚本超时时间
    #     self.driver.set_script_timeout(10)
    #
    #     dispatcher.connect(self.spider_closed, signals.spider_closed)

    def process_request(self, request, spider):
        print("\n" + request.url + "\t页面正在加载中。。。")
        spider.browser.get(request.url)
        import time
        time.sleep(1)
        print("访问:{0}".format(request.url))
        return HtmlResponse(url=spider.browser.current_url, body=spider.browser.page_source, encoding="utf-8",
                            request=request)

        # 设置信号量、当爬虫借宿后、关闭浏览器
        # def spider_closed(self, spider, reason):
        #     print ("\t爬虫结束、关闭PhantomJS。。。\n\n")
        #     self.driver.quit()
