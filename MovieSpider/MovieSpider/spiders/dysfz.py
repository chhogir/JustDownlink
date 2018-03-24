# -*- coding: utf-8 -*-
import scrapy
from datetime import datetime
from MovieSpider.items import DysfzItemLoader, DysfzItem
from scrapy.http import Request
from MovieSpider.utils.common import get_md5
from scrapy.xlib.pydispatch import dispatcher  # scrapy 分发器
from scrapy import signals  # scrapy 信号量


class DysfzSpider(scrapy.Spider):
    name = 'dysfz'
    allowed_domains = ['www.dysfz.cc']
    start_urls = [
        "http://www.dysfz.cc",
        "http://www.dysfz.cc/tv/",
        "http://www.dysfz.cc/cartoon/",
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
        "LOG_FILE": "./logs/dysfz.log",
        "LOG_LEVEL": "INFO",
    }

    # 数据收集
    # 收集所有404的url、以及404页面数
    # 默认过滤404页面、重写
    # 信号设置
    handle_httpstatus_list = [404, 304]

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
            "ul.movie-list.reset li h2 a::attr(href)").extract()
        for movie_url in movie_nodes:
            yield Request(url=movie_url, callback=self.parse_detail)
            # yield FormRequest(url=movie_url, formdata={'huoduan_verifycode': '666',}, callback=self.parse_detail)

        # 提取下一页并交给scrapy进行下载
        next_url = response.xpath(
            '//a[contains(text(),"下一页")]/@href').extract_first()
        if next_url:
            yield Request(url=next_url, callback=self.parse)

    def parse_detail(self, response):

        item_loader = DysfzItemLoader(item=DysfzItem(), response=response)

        movie_title = response.xpath('//div[@class="main shadow"]/h1/text()')
        title_detail = movie_title.extract_first("")
        titles = movie_title.re(r'^(.*?)【.*')
        item_loader.add_value("title_detail", title_detail.strip())
        if titles:
            title = titles[0].strip()
        else:
            title = title_detail.strip()
        item_loader.add_value("title", title)

        item_loader.add_value("url", response.url)
        item_loader.add_value("url_object_id", get_md5(response.url))

        download_links = response.xpath(
            '//div[@class="detail"]/p[contains(text(), "资源列表")]/following-sibling::p')
        download_url = ["资源列表&nbsp;&nbsp;:"]

        for download_link in download_links:
            download_link_title = download_link.xpath(
                'string(.)').extract_first("").strip()
            download_link_url = download_link.xpath(
                'a/@href').extract_first("")
            if download_link_url != download_link_title:
                url = download_link_title.strip() + "&nbsp;&nbsp;:<br><br>" + download_link_url
                download_url.append(url)
            else:
                download_url.append(download_link_url)

        item_loader.add_value('download_url', download_url)
        item_loader.add_value("crawl_time", datetime.now())

        movie_item = item_loader.load_item()

        if len(download_url) > 2:
            return movie_item
