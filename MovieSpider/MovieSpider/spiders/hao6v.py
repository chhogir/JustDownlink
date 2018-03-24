# -*- coding: utf-8 -*-
import scrapy
from datetime import datetime
from MovieSpider.items import Hao6vItemLoader, Hao6vItem
from scrapy.http import Request
from MovieSpider.utils.common import get_md5
from scrapy.xlib.pydispatch import dispatcher  # scrapy 分发器
from scrapy import signals  # scrapy 信号量


class Hao6vSpider(scrapy.Spider):
    name = 'hao6v'
    allowed_domains = ['www.hao6v.com']
    start_urls = [
        "http://www.hao6v.com/dy/",
        "http://www.hao6v.com/gydy/",
        "http://www.hao6v.com/zydy/",
        "http://www.hao6v.com/gq/",
        "http://www.hao6v.com/jddy/",
        "http://www.hao6v.com/dlz/",
        "http://www.hao6v.com/rj/",
        "http://www.hao6v.com/mj/",
        "http://www.hao6v.com/zy/",
        "http://www.hao6v.com/s/gangtaidianying/",
        "http://www.hao6v.com/s/jingdiandianying/",
        "http://www.hao6v.com/3D/",
        "http://www.hao6v.com/s/shoujiMP4dianying/",
        "http://www.hao6v.com/s/xiju/",
        "http://www.hao6v.com/s/dongzuo/",
        "http://www.hao6v.com/s/aiqing/",
        "http://www.hao6v.com/s/kehuan/",
        "http://www.hao6v.com/s/qihuan/",
        "http://www.hao6v.com/s/shenmi/",
        "http://www.hao6v.com/s/huanxiang/",
        "http://www.hao6v.com/s/kongbu/",
        "http://www.hao6v.com/s/zhanzheng/",
        "http://www.hao6v.com/s/maoxian/",
        "http://www.hao6v.com/s/jingsong/",
        "http://www.hao6v.com/s/juqingpian/",
        "http://www.hao6v.com/s/zhuanji/",
        "http://www.hao6v.com/s/lishi/",
        "http://www.hao6v.com/s/jilu/",
        "http://www.hao6v.com/s/yindudianying/",
        "http://www.hao6v.com/s/guochandianying/",
        "http://www.hao6v.com/s/xijudianying/",
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
        "LOG_FILE": "./logs/hao6v.log",
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

        movie_nodes = response.css("ul.list li a::attr(href)").extract()
        for movie_url in movie_nodes:
            # yield Request(url=parse.urljoin(response.url, movie_url), headers=self.headers, callback=self.parse_detail)
            yield Request(url=movie_url, callback=self.parse_detail)

        # 提取下一页并交给scrapy进行下载
        # next_url = response.css(".co_content8 div.x a::attr(href)").extract()[-2]
        next_url = response.xpath(
            '//a[contains(text(),"下一页")]/@href').extract_first()
        if next_url:
            yield Request(url=next_url, callback=self.parse)

    def parse_detail(self, response):

        item_loader = Hao6vItemLoader(item=Hao6vItem(), response=response)

        item_loader.add_xpath(
            "title_detail", '//div[@class="col6"]/div[@class="box"]/h1/text()')
        item_loader.add_xpath(
            "title", '//div[@class="col6"]/div[@class="box"]/h1/text()')

        item_loader.add_value("url", response.url)
        item_loader.add_value("url_object_id", get_md5(response.url))

        download_url_titles = response.xpath(
            '//div[@id="endText"]/table/tbody/tr/td/a/text()').extract()
        download_url_urls = response.xpath(
            '//div[@id="endText"]/table/tbody/tr/td/a/@href').extract()

        download_url = []
        for i in range(len(download_url_urls)):
            if download_url_urls[i]:
                url = download_url_titles[i].strip() + \
                    " &nbsp;&nbsp;:<br><br>" + download_url_urls[i]
                download_url.append(url)

        item_loader.add_value('download_url', download_url)
        item_loader.add_value("crawl_time", datetime.now())

        movie_item = item_loader.load_item()

        if len(download_url) > 1:
            return movie_item
