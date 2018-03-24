# -*- coding: utf-8 -*-
import scrapy
from MovieSpider.utils.common import get_md5
from datetime import datetime
from MovieSpider.items import Yyj268ItemLoader, Yyj268Item
from scrapy.http import Request
import re

from scrapy.xlib.pydispatch import dispatcher  # scrapy 分发器
from scrapy import signals  # scrapy 信号量


class Yyj268Spider(scrapy.Spider):
    name = 'yyj268'
    allowed_domains = ['www.yyj268.com']
    start_urls = [
        'http://www.yyj268.com/',
        'http://www.yyj268.com/dianying',
        'http://www.yyj268.com/manhua',
        'http://www.yyj268.com/dianshiju',
        'http://www.yyj268.com/zixun',
    ]
    custom_settings = {
        # "COOKIES_ENABLED": True,
        "DOWNLOAD_DELAY": 1,
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
        "LOG_FILE": "./logs/yyj268.log",
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

        movie_nodes = response.css(".excerpt .focus a")
        for movie_node in movie_nodes:
            movie_url = movie_node.css('::attr(href)').extract_first("")
            yield Request(url=movie_url, callback=self.parse_detail)

        # 提取下一页并交给scrapy下载
        next_url = response.css("li.next-page a::attr(href)").extract_first("")
        if next_url:
            yield Request(url=next_url, callback=self.parse)

    def parse_detail(self, response):

        main_url = response.url
        match_url = re.match(r'http://www.yyj268.com/(\d+).html', main_url)

        title_detail = response.xpath(
            '//h1[@class="article-title"]/a/text()').extract_first("").strip()
        match_re = re.match(r'(.*?)百度.*', title_detail)
        if match_re:
            title = match_re.group(1).strip()
        else:
            title = title_detail

        if match_url:
            movie_url = "http://www.yyj268.com/download.php?id=" + \
                        match_url.group(1)
            yield Request(url=movie_url, meta={'main_url': main_url, 'title': title, 'title_detail': title_detail, }, callback=self.parse_download)

    def parse_download(self, response):

        main_url = response.meta.get("main_url", "")
        title_detail = response.meta.get("title_detail", "")
        title = response.meta.get("title", "")
        item_loader = Yyj268ItemLoader(item=Yyj268Item(), response=response)
        item_loader.add_value('title_url', response.url)
        item_loader.add_value('title_detail', title_detail)
        item_loader.add_value('title', title)

        item_loader.add_value("url", main_url)
        item_loader.add_value("url_object_id", get_md5(main_url))

        # pw = response.css("center p strong font span::text").extract_first()
        # match_pw = re.match('^(\d+).*', pw)

        download_url_1 = response.css(
            ".desc center font strong a::attr(href)").extract_first("")
        download_url_2 = response.css(
            "center p strong span::text").extract_first("").strip()

        download_url = ""
        if download_url_1 and download_url_2:
            download_url = download_url_1 + "&nbsp;&nbsp;:<br><br>" + download_url_2
        elif download_url_1:
            download_url = download_url_1
        elif download_url_2:
            download_url = download_url_2

        item_loader.add_value("download_url", download_url)
        item_loader.add_value("crawl_time", datetime.now())

        movie_item = item_loader.load_item()
        if download_url_1 or download_url_2:
            return movie_item
