# -*- coding: utf-8 -*-
import scrapy
from MovieSpider.utils.common import get_md5
from datetime import datetime
from MovieSpider.items import Mkv99ItemLoader, Mkv99Item
from scrapy.http import Request
from urllib import parse  # python2使用  import urlparse
from w3lib.html import remove_tags
from scrapy.xlib.pydispatch import dispatcher
from selenium import webdriver
from scrapy import signals
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from fake_useragent import UserAgent


class Mkv99Spider(scrapy.Spider):
    name = 'mkv99'
    allowed_domains = ['www.mkv99.net']
    start_urls = [
        'http://www.mkv99.net/vod-type-id-1-pg-1.html',
        'http://www.mkv99.net/vod-type-id-2-pg-1.html',
        'http://www.mkv99.net/vod-type-id-5-pg-1.html',
        'http://www.mkv99.net/vod-type-id-16-pg-1.html',
        'http://www.mkv99.net/vod-type-id-17-pg-1.html',
        'http://www.mkv99.net/vod-type-id-18-pg-1.html',
        'http://www.mkv99.net/vod-type-id-19-pg-1.html',
        'http://www.mkv99.net/vod-type-id-22-pg-1.html',
        'http://www.mkv99.net/vod-type-id-25-pg-1.html',
        'http://www.mkv99.net/vod-type-id-27-pg-1.html',
    ]
    custom_settings = {
        "COOKIES_ENABLED": True,
        "DOWNLOAD_DELAY": 5,
        "DOWNLOADER_MIDDLEWARES": {
            # 'MovieSpider.middlewares.RandomProxyMiddleware': 1,
            # 'MovieSpider.middlewares.RandomUserAgentMiddleware': 20,
            'MovieSpider.middlewares.PhantomJSMiddleware': 100,
        },
        "ITEM_PIPELINES": {
            # 'MovieSpider.pipelines.MysqlTwistedPipeline': 200,
            'MovieSpider.pipelines.ElasticsearchPipeline': 300,
        },
        # 请求超时
        "DOWNLOAD_TIMEOUT": 5,
        # 重新请求
        "RETRY_ENABLED": True,
        # 重试次数
        "RETRY_TIMES": 3,
        "CONCURRENT_REQUESTS": 8,

        # 保存日志
        "LOG_FILE": "./logs/mkv99.log",
        "LOG_LEVEL": "INFO",
    }

    # # 设置只打开一个chrome
    def __init__(self):

        # 设置 PhantomJS 配置
        dcap = dict(DesiredCapabilities.PHANTOMJS)
        # 从USER_AGENTS列表中随机选一个浏览器头，伪装浏览器
        ua = UserAgent()
        dcap["phantomjs.page.settings.userAgent"] = (ua.random)

        # 不载入图片，爬页面速度会快很多
        dcap["phantomjs.page.settings.loadImages"] = False

        # 设置代理
        # service_args = ['--proxy=127.0.0.1:9999','--proxy-type=socks5']
        service_args = []
        service_args.append('--load-images=no')  # 关闭图片加载
        service_args.append('--disk-cache=yes')  # 开启缓存
        service_args.append('--ignore-ssl-errors=true')  # 忽略https错误

        # 打开带配置信息的phantomJS浏览器
        self.browser = webdriver.PhantomJS(
            executable_path="/usr/local/phantomjs/bin/phantomjs", desired_capabilities=dcap, service_args=service_args)

        # 隐式等待5秒，可以自己调节
        self.browser.implicitly_wait(5)
        # 设置10秒页面超时返回，类似于requests.get()的timeout选项，driver.get()没有timeout选项
        # 以前遇到过driver.get(url)一直不返回，但也不报错的问题，这时程序会卡住，设置超时选项能解决这个问题。
        self.browser.set_page_load_timeout(10)
        # 设置10秒脚本超时时间
        self.browser.set_script_timeout(10)

        self.fail_urls = []

        super(Mkv99Spider, self).__init__()
        # 关闭信号映射：当spider关闭时、执行关闭chrome
        dispatcher.connect(self.spider_closed, signals.spider_closed)

    def spider_closed(self, spider):
        self.crawler.stats.set_value("failed_urls", ",".join(self.fail_urls))

        # 当爬虫退出时、关闭chrome
        print("爬虫  " + spider.name + "  结束，关闭PhantomJS。。。\n\n")
        self.browser.quit()

    # 数据收集
    # 收集所有404的url、以及404页面数
    # 默认过滤404页面、重写
    # 信号设置
    handle_httpstatus_list = [404, 304, 403]

    def parse(self, response):
        # 404页面
        if response.status in self.handle_httpstatus_list:
            self.fail_urls.append(response.url)
            # spider中crawler scrapy/statscol.py
            self.crawler.stats.inc_value("failed_url")

        movie_nodes = response.css(".typeMovieContent ul li a")
        for movie_node in movie_nodes:
            movie_url = movie_node.css('::attr(href)').extract_first("")
            yield Request(url=parse.urljoin(response.url, movie_url), callback=self.parse_detail)

        # 提取下一页并交给scrapy下载
        next_url = response.xpath(
            '//a[contains(text(),"下一页")]/@href').extract_first()
        if next_url:
            yield Request(url=parse.urljoin(response.url, next_url), callback=self.parse)

    def parse_detail(self, response):

        item_loader = Mkv99ItemLoader(item=Mkv99Item(), response=response)

        title_detail = response.css(".movieTitle h1").extract_first("")
        title_detail = remove_tags(title_detail).strip()
        item_loader.add_value('title_detail', title_detail)

        title = response.css(
            ".nvc dl dd a:last-child::text").extract_first("").strip()
        item_loader.add_value('title', title)

        item_loader.add_value("url", response.url)
        item_loader.add_value("url_object_id", get_md5(response.url))

        a_titles = response.css('.adds div span a::text').extract()
        a_hrefs = response.css('.adds div span a::attr(href)').extract()
        download_url = []
        for i in range(len(a_hrefs)):
            a = a_titles[i].strip() + "&nbsp;&nbsp;:<br><br>" + a_hrefs[i]
            download_url.append(a)

        item_loader.add_value('download_url', download_url)
        item_loader.add_value("crawl_time", datetime.now())

        movie_item = item_loader.load_item()

        if len(download_url) > 1:
            return movie_item
