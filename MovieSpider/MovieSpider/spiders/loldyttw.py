# -*- coding: utf-8 -*-
import scrapy
from urllib import parse  # python2使用  import urlparse
from datetime import datetime
from MovieSpider.items import LoldyttwItemLoader, LoldyttwItem
from scrapy.http import Request
from MovieSpider.utils.common import get_md5
from scrapy.xlib.pydispatch import dispatcher  # scrapy 分发器
from scrapy import signals  # scrapy 信号量
from w3lib.html import remove_tags


class LoldyttwSpider(scrapy.Spider):
    name = 'loldyttw'
    allowed_domains = ['www.loldyttw.com', 'www.loldyttw.net']

    start_urls = [
        "http://www.loldyttw.net/Dongzuopian/chart",
        "http://www.loldyttw.net/Kehuanpian/chart",
        "http://www.loldyttw.net/Kongbupian/chart",
        "http://www.loldyttw.net/Xijupian/chart",
        "http://www.loldyttw.net/Aiqingpian/chart",
        "http://www.loldyttw.net/Juqingpian/chart",
        "http://www.loldyttw.net/Zhanzhengpian/chart",
        "http://www.loldyttw.net/Dongman/chart",
        "http://www.loldyttw.net/Zongyi/chart",
        "http://www.loldyttw.net/Daluju/chart",
        "http://www.loldyttw.net/Meiju/chart",
        "http://www.loldyttw.net/Hanju/chart",
        "http://www.loldyttw.net/Gangju/chart",
        "http://www.loldyttw.net/Taiju/chart",
        "http://www.loldyttw.net/Riju/chart",
        "http://www.loldyttw.net/Outaiju/chart",
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
        "CONCURRENT_REQUESTS": 8,

        # 保存日志
        "LOG_FILE": "./logs/loldyttw.log",
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

        movie_nodes = response.css(".box3_mid .img a::attr(href)").extract()
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

        item_loader = LoldyttwItemLoader(
            item=LoldyttwItem(), response=response)

        title_detail = response.xpath(
            '//div[@class="lm"]/h1/a/text()').extract_first("").strip()
        item_loader.add_value("title_detail", title_detail)
        item_loader.add_value("title", title_detail)

        item_loader.add_value("url", response.url)
        item_loader.add_value("url_object_id", get_md5(response.url))

        download_url = []

        download_xl_cls = response.css('ul.downurl li a')
        for xl_cl in download_xl_cls:
            xl_cl_title = remove_tags(xl_cl.css('::text').extract_first(""))
            xl_cl_url = xl_cl.css('::attr(href)').extract_first("")
            download_url.append(
                xl_cl_title.strip() + "&nbsp;&nbsp;:<br><br>" + xl_cl_url)

        download_bts = response.xpath('//div[@id="bt"]/ul/li/a')
        for bt in download_bts:
            bt_title = remove_tags(bt.xpath('text()').extract_first(""))
            bt_url = bt.xpath('@href').extract_first("")
            download_url.append(bt_title.strip() +
                                "&nbsp;&nbsp;:<br><br>" + bt_url)

        item_loader.add_value('download_url', download_url)
        item_loader.add_value("crawl_time", datetime.now())

        movie_item = item_loader.load_item()

        if len(download_url) > 1:
            return movie_item
