# -*- coding: utf-8 -*-

from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from MovieSpider.utils.common import get_md5
from datetime import datetime
from MovieSpider.items import XunleicangItemLoader, XunleicangItem
from w3lib.html import remove_tags


class XunleicangSpider(CrawlSpider):
    name = 'xunleicang'
    allowed_domains = ['www.xunleicang.com']
    start_urls = ['http://www.xunleicang.com/']
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
        "CONCURRENT_REQUESTS": 10,

        # 保存日志
        "LOG_FILE": "./logs/xunleicang.log",
        "LOG_LEVEL": "INFO",
    }

    rules = (
        Rule(LinkExtractor(allow=r'vod-read-id-\d+.html'),
             callback='parse_detail', follow=True),
    )

    def parse_detail(self, response):

        item_loader = XunleicangItemLoader(
            item=XunleicangItem(), response=response)

        item_loader.add_css('title_detail', "div.pleft h3 a:last-child")
        item_loader.add_css('title', ".moviecont .bt h1::text")

        item_loader.add_value("url", response.url)
        item_loader.add_value("url_object_id", get_md5(response.url))

        download_url = []
        download_xls = response.xpath('//ul[@class="downurl"]/li/a')
        download_cls = response.xpath('//div[@id="cili"]/ul/li/a')

        for xl in download_xls:
            xl_title = remove_tags(xl.xpath('text()').extract_first(""))
            xl_url = xl.xpath('@href').extract_first("")
            download_url.append(xl_title.strip() +
                                "&nbsp;&nbsp;:<br><br>" + xl_url)

        for cl in download_cls:
            cl_title = remove_tags(cl.xpath('text()').extract_first(""))
            cl_url = cl.xpath('@href').extract_first("")
            download_url.append(cl_title.strip() +
                                "&nbsp;&nbsp;:<br><br>" + cl_url)

        item_loader.add_value('download_url', download_url)
        item_loader.add_value("crawl_time", datetime.now())

        movie_item = item_loader.load_item()

        if len(download_url) > 1:
            return movie_item
