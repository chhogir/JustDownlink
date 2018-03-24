# -*- coding: utf-8 -*-
import scrapy
from urllib import parse  # python2使用  import urlparse
from datetime import datetime
from MovieSpider.items import Dy2018ItemLoader, Dy2018Item
from scrapy.http import Request
from MovieSpider.utils.common import get_md5
from scrapy.xlib.pydispatch import dispatcher  # scrapy 分发器
from scrapy import signals  # scrapy 信号量


class Dy2018Spider(scrapy.Spider):
    name = 'dy2018'
    allowed_domains = ['www.dy2018.com']
    start_urls = [
        'https://www.dy2018.com/html/gndy/jddyy/',
        'https://www.dy2018.com/html/gndy/jddy/',
        'https://www.dy2018.com/html/bikan/',
        'https://www.dy2018.com/html/gndy/oumei/',
        'https://www.dy2018.com/html/gndy/rihan/',
        'https://www.dy2018.com/html/gndy/china/',
        'https://www.dy2018.com/20/',
        'https://www.dy2018.com/19/',
        'https://www.dy2018.com/18/',
        'https://www.dy2018.com/17/',
        'https://www.dy2018.com/16/',
        'https://www.dy2018.com/15/',
        'https://www.dy2018.com/14/',
        'https://www.dy2018.com/13/',
        'https://www.dy2018.com/12/',
        'https://www.dy2018.com/11/',
        'https://www.dy2018.com/10/',
        'https://www.dy2018.com/9/',
        'https://www.dy2018.com/8/',
        'https://www.dy2018.com/7/',
        'https://www.dy2018.com/6/',
        'https://www.dy2018.com/5/',
        'https://www.dy2018.com/4/',
        'https://www.dy2018.com/3/',
        'https://www.dy2018.com/2/',
        'https://www.dy2018.com/1/',
        'https://www.dy2018.com/0/',
    ]
    custom_settings = {
        # "COOKIES_ENABLED": True,
        "DOWNLOAD_DELAY": 3,
        "DOWNLOADER_MIDDLEWARES": {
            # 'MovieSpider.middlewares.RandomProxyMiddleware': 1,
            'MovieSpider.middlewares.RandomUserAgentMiddleware': 10,
        },
        "ITEM_PIPELINES": {
            'MovieSpider.pipelines.MysqlTwistedPipeline': 100,
            'MovieSpider.pipelines.ElasticsearchPipeline': 300,
        },
        # 请求超时
        "DOWNLOAD_TIMEOUT": 5,
        # 重新请求
        "RETRY_ENABLED": True,
        # 重试次数
        "RETRY_TIMES": 3,

        # 保存日志
        "LOG_FILE": "./logs/dy2018.log",
        "LOG_LEVEL": "INFO",
    }

    # 数据收集
    # 收集所有404的url、以及404页面数
    # 默认过滤404页面、重写
    # 信号设置
    handle_httpstatus_list = [404, 304, 403]

    def __init__(self, **kwargs):
        self.fail_urls = []
        dispatcher.connect(self.handle_spider_closed, signals.spider_closed)

    def handle_spider_closed(self, spider, reason):
        self.crawler.stats.set_value("failed_urls", ",".join(self.fail_urls))

    def parse(self, response):
        # 404页面
        if response.status in self.handle_httpstatus_list:
            self.fail_urls.append(response.url)
            # spider中crawler scrapy/statscol.py
            self.crawler.stats.inc_value("failed_url")

        movie_nodes = response.css(
            ".co_content8 ul a.ulink::attr(href)").extract()
        for movie_url in movie_nodes:
            # yield Request(url=parse.urljoin(response.url, movie_url), callback=self.parse_detail)
            yield Request(url=parse.urljoin(response.url, movie_url), callback=self.parse_detail)

        # 提取下一页并交给scrapy进行下载
        # next_url = response.css(".co_content8 div.x a::attr(href)").extract()[-2]
        next_url = response.xpath(
            '//a[contains(text(),"下一页")]/@href').extract_first()
        if next_url:
            yield Request(url=parse.urljoin(response.url, next_url), callback=self.parse)

    def parse_detail(self, response):

        item_loader = Dy2018ItemLoader(item=Dy2018Item(), response=response)

        item_loader.add_xpath(
            "title_detail", '//div[@class="title_all"]/h1/text()')
        item_loader.add_xpath("title", '//div[@class="title_all"]/h1/text()')

        item_loader.add_value("url", response.url)
        item_loader.add_value("url_object_id", get_md5(response.url))

        # download_url =  response.css("#Zoom table tbody tr td a::attr(href)").extract()
        # item_loader.add_value('download_url', download_url)

        download_url_list = response.xpath(
            '//a/text()').re(r'^(ftp.*)|(magnet.*)|(thunder.*)|(ed2k.*)|(.*?torrent)')
        download_url = []
        for url in download_url_list:
            if url:
                download_url.append(url.strip())

        item_loader.add_value('download_url', download_url)
        item_loader.add_value("crawl_time", datetime.now())

        movie_item = item_loader.load_item()

        if len(download_url) > 1:
            return movie_item
