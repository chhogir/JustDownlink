# -*- coding: utf-8 -*-
import scrapy
from scrapy.http import Request
from urllib import parse  # python2使用  import urlparse
from MovieSpider.settings import SQL_DATETIME_FORMAT, SQL_DATE_FORMAT
from datetime import datetime
from MovieSpider.items import Ygdy8Item, MovieItemLoader
from MovieSpider.utils.common import get_md5
from scrapy.xlib.pydispatch import dispatcher  # scrapy 分发器
from scrapy import signals  # scrapy 信号量


class Ygdy8Spider(scrapy.Spider):
    name = 'ygdy8'
    allowed_domains = ['ygdy8.com']
    start_urls = [
        "http://www.ygdy8.com/html/gndy/china/index.html",
        "http://www.ygdy8.com/html/gndy/dyzz/index.html",
        "http://www.ygdy8.com/html/gndy/jddy/index.html",
        "http://www.ygdy8.com/html/gndy/rihan/index.html",
        "http://www.ygdy8.com/html/gndy/oumei/index.html",
        "http://www.ygdy8.com/html/tv/tvzz/index.html",
        "http://www.ygdy8.com/html/tv/rihantv/index.html",
        "http://www.ygdy8.com/html/tv/rihantv/riju/index.html",
        "http://www.ygdy8.com/html/tv/rihantv/riju/index.html",
        "http://www.ygdy8.com/html/tv/oumeitv/index.html",
        "http://www.ygdy8.com/html/tv/gangtai/index.html",
        "http://www.ygdy8.com/html/tv/hepai/index.html",
        "http://www.ygdy8.com/html/tv/hytv/index.html",
        "http://www.ygdy8.com/html/zongyi2013/index.html",
        "http://www.ygdy8.com/html/zongyi2013/taiwanzongyi/index.html",
        "http://www.ygdy8.com/html/zongyi2013/daluzongyi/index.html",
        "http://www.ygdy8.com/html/zongyi2013/tiyujiemu/index.html",
        "http://www.ygdy8.com/html/zongyi2013/qitazongyi/index.html",
        "http://www.ygdy8.com/html/dongman/index.html",
        "http://www.ygdy8.com/html/dongman/new/index.html",
        "http://www.ygdy8.com/html/dongman/ss/index.html",
        "http://www.ygdy8.com/html/dongman/qitadongman/index.html",
        "http://www.ygdy8.com/html/dongman/gcdh/index.html",
        "http://www.ygdy8.com/html/dongman/haizeiwangqu/index.html",
        "http://www.ygdy8.com/html/dongman/hy/index.html",
        "http://www.ygdy8.com/html/3gp/index.html",
        "http://www.ygdy8.com/html/3gp/3gpmovie/index.html",
        "http://www.ygdy8.com/html/2009zongyi/index.html",
        "http://www.ygdy8.com/html/2009zongyi/tiyujiemu/index.html",
        "http://www.ygdy8.com/html/2009zongyi/taiwanzongyi/index.html",
        "http://www.ygdy8.com/html/2009zongyi/daluzongyi/index.html",
        "http://www.ygdy8.com/html/2009zongyi/hanguozongyi/index.html",
    ]
    # headers = {
    #     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
    #     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    #     'Accept-Encoding': 'gzip, deflate'
    # }

    custom_settings = {
        # "COOKIES_ENABLED": True,
        "DOWNLOAD_DELAY": 3,
        "DOWNLOADER_MIDDLEWARES": {
            'MovieSpider.middlewares.RandomUserAgentMiddleware': 10,
            # 'MovieSpider.middlewares.RandomProxyMiddleware': 100,
            # 'scrapy.contrib.downloadermiddleware.useragent.UserAgentMiddleware': None,
            # 'scrapy.contrib.downloadermiddleware.httpproxy.HttpProxyMiddleware': None,
        },
        "ITEM_PIPELINES": {
            # 'MovieSpider.pipelines.MysqlPipeline': 3,
            # 'MovieSpider.pipelines.JsonWithEncodingPipeline': 3,
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
        "LOG_FILE": "./logs/ygdy8.log",
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
            # yield Request(url=parse.urljoin(response.url, movie_url), headers=self.headers, callback=self.parse_detail)
            yield Request(url=parse.urljoin(response.url, movie_url), callback=self.parse_detail)

        # 提取下一页并交给scrapy进行下载
        # next_url = response.css(".co_content8 div.x a::attr(href)").extract()[-2]
        next_url = response.xpath(
            '//a[contains(text(),"下一页")]/@href').extract_first()
        if next_url:
            yield Request(url=parse.urljoin(response.url, next_url), callback=self.parse)

    def parse_detail(self, response):

        item_loader = MovieItemLoader(item=Ygdy8Item(), response=response)
        # 通过CSS选择器提取字段
        item_loader.add_value('url', response.url)
        item_loader.add_value('url_object_id', get_md5(response.url))

        item_loader.add_css(
            'title_detail', ".bd3r .co_area2 .title_all h1 font::text")
        item_loader.add_css(
            'title', ".bd3r .co_area2 .title_all h1 font::text")

        download_url = response.css(
            "#Zoom table tbody tr td a::attr(href)").extract()

        item_loader.add_value('download_url', download_url)
        item_loader.add_value('thunder_url', download_url)

        # item_loader.add_value("crawl_time", datetime.now().strftime(SQL_DATETIME_FORMAT))

        # title_detail = response.css(".bd3r .co_area2 .title_all h1 font::text").extract_first("")
        # match_re = re.match(r'.*?《(.*?)》.*',title_detail)
        # if match_re:
        #      title = match_re.group(1)
        # ftp_url = response.css("#Zoom table tbody tr td a::attr(href)").extract_first("")

        item_loader.add_value("crawl_time", datetime.now())
        movie_item = item_loader.load_item()

        if len(download_url) > 1:
            return movie_item
