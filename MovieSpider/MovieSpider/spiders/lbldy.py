# -*- coding: utf-8 -*-
import scrapy
from datetime import datetime
from MovieSpider.items import LbldyItemLoader, LbldyItem
from scrapy.http import Request
from MovieSpider.utils.common import get_md5
from scrapy.xlib.pydispatch import dispatcher  # scrapy 分发器
from scrapy import signals  # scrapy 信号量
from scrapy.http import FormRequest


class LbldySpider(scrapy.Spider):
    name = 'lbldy'
    allowed_domains = ['www.lbldy.com']
    start_urls = [
        "http://www.lbldy.com/movie/",
        "http://www.lbldy.com/television/",
        "http://www.lbldy.com/dongman/",
        "http://www.lbldy.com/video/",
        "http://www.lbldy.com/movie/dldy/",
        "http://www.lbldy.com/movie/gtdy/",
        "http://www.lbldy.com/movie/rhdy/",
        "http://www.lbldy.com/movie/omdy/",
        "http://www.lbldy.com/television/dljj/",
        "http://www.lbldy.com/television/gtjj/",
        "http://www.lbldy.com/television/rhjj/",
        "http://www.lbldy.com/television/omjj/",
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
        "LOG_FILE": "./logs/lbldy.log",
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

    # def start_requests(self):
    #     for url in self.start_urls:
    #         yield scrapy.FormRequest(url=url, formdata={'huoduan_verifycode': '666',})

    def parse(self, response):
        # 404页面
        if response.status in self.handle_httpstatus_list:
            self.fail_urls.append(response.url)
            # spider中crawler scrapy/statscol.py
            self.crawler.stats.inc_value("failed_url")

        movie_nodes = response.css("div.postlist h4 a::attr(href)").extract()
        for movie_url in movie_nodes:
            # yield Request(url=parse.urljoin(response.url, movie_url), callback=self.parse_detail)
            yield FormRequest(url=movie_url, formdata={'huoduan_verifycode': '666', }, callback=self.parse_detail)

        # 提取下一页并交给scrapy进行下载
        next_url = response.xpath(
            '//a[contains(text(),"下一页")]/@href').extract_first()
        if next_url:
            yield Request(url=next_url, callback=self.parse)

    def parse_detail(self, response):

        item_loader = LbldyItemLoader(item=LbldyItem(), response=response)

        item_loader.add_xpath("title_detail", '//div[@class="post"]/h2/text()')
        item_loader.add_xpath("title", '//div[@class="post"]/h2/text()')

        item_loader.add_value("url", response.url)
        item_loader.add_value("url_object_id", get_md5(response.url))

        download_links = response.xpath('//div[@id="download_link"]/p/a')
        download_url = []

        for download_link in download_links:
            download_link_title = download_link.xpath(
                'text()').extract_first("").strip()
            download_link_url = download_link.xpath('@href').extract_first("")
            url = download_link_title + " &nbsp;&nbsp;:<br><br>" + download_link_url
            download_url.append(url)

        item_loader.add_value('download_url', download_url)
        item_loader.add_value("crawl_time", datetime.now())

        movie_item = item_loader.load_item()

        if len(download_url) > 1:
            return movie_item
