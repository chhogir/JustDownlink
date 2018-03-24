# -*- coding: utf-8 -*-
import scrapy
from datetime import datetime
from MovieSpider.items import MeijuttItemLoader, MeijuttItem
from scrapy.http import Request
from MovieSpider.utils.common import get_md5
from scrapy.xlib.pydispatch import dispatcher  # scrapy 分发器
from scrapy import signals  # scrapy 信号量
from urllib import parse  # python2使用  import urlparse


class MeijuttSpider(scrapy.Spider):
    name = 'meijutt'
    allowed_domains = ['www.meijutt.com']
    start_urls = [
        "http://www.meijutt.com/file/list1.html",
        "http://www.meijutt.com/file/list2.html",
        "http://www.meijutt.com/file/list3.html",
        "http://www.meijutt.com/file/list4.html",
        "http://www.meijutt.com/file/list5.html",
        "http://www.meijutt.com/file/list6.html",
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
        "LOG_FILE": "./logs/meijutt.log",
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

        movie_nodes = response.css('a.B.font_16::attr(href)').extract()
        for movie_url in movie_nodes:
            yield Request(url=parse.urljoin(response.url, movie_url), callback=self.parse_detail)

        # 提取下一页并交给scrapy进行下载
        next_url = response.xpath(
            '//a[contains(text(),"下一页")]/@href').extract_first()
        if next_url:
            yield Request(url=parse.urljoin(response.url, next_url), callback=self.parse)

    def parse_detail(self, response):

        item_loader = MeijuttItemLoader(item=MeijuttItem(), response=response)

        movie_title = response.xpath('//div[@class="info-title"]')
        title = movie_title.xpath("h1/text()").extract_first("").strip()
        title_detail = title + \
            movie_title.xpath("text()").extract_first("").strip()

        item_loader.add_value("title", title)
        item_loader.add_value("title_detail", title_detail)

        item_loader.add_value("url", response.url)
        item_loader.add_value("url_object_id", get_md5(response.url))

        download_url = []
        download_links = response.xpath('//strong[@class="down_part_name"]')
        download_link_1 = download_links.xpath('a[contains(text(),"字幕")]')
        # download_link_2 = download_links.xpath('a[contains(text(),"第")')
        # download_link_2 = download_links.xpath('a[starts-with(text(),"第")')
        download_link_2 = download_links.xpath('a[re:test(text(), "第\d+?集")]')

        download_link_3 = response.xpath('//div[@class="wp-list"]/ul/li')

        if len(download_link_1) > 0:
            download_url.append("电驴下载链接 &nbsp;&nbsp;:")
            for download_link in download_link_1:
                download_link_title = download_link.xpath(
                    'text()').extract_first("")
                download_link_url = download_link.xpath(
                    '@href').extract_first("")
                url = download_link_title.strip() + "&nbsp;&nbsp;:<br><br>" + download_link_url
                download_url.append(url)

        if len(download_link_2) > 0:
            download_url.append("磁力下载链接 &nbsp;&nbsp;:")
            for download_link in download_link_2:
                download_link_title = download_link.xpath(
                    'text()').extract_first("")
                download_link_url = download_link.xpath(
                    '@href').extract_first("")
                url = download_link_title.strip() + "&nbsp;&nbsp;:<br><br>" + download_link_url
                download_url.append(url)

        if len(download_link_3) > 0:
            download_url.append("百度网盘下载 &nbsp;&nbsp;:")
            for download_link in download_link_3:
                download_link_title = download_link.xpath(
                    'strong/text()').extract_first("")
                download_link_url = download_link.xpath(
                    'a/@href').extract_first("")
                download_link_passwd = download_link.xpath(
                    'span/text()').extract_first("")
                url = download_link_title.strip() + "&nbsp;&nbsp;:<br><br>" + \
                    download_link_url + "&nbsp;&nbsp;" + download_link_passwd.strip()
                download_url.append(url)

        item_loader.add_value('download_url', download_url)
        item_loader.add_value("crawl_time", datetime.now())

        movie_item = item_loader.load_item()

        if len(download_url) > 1:
            return movie_item
