# -*- coding: utf-8 -*-
import scrapy
from datetime import datetime
from MovieSpider.items import BtbttItemLoader, BtbttItem
from scrapy.http import Request
from MovieSpider.utils.common import get_md5
from scrapy.xlib.pydispatch import dispatcher  # scrapy 分发器
from scrapy import signals  # scrapy 信号量
from urllib import parse  # python2使用  import urlparse
import re


class BtbttSpider(scrapy.Spider):
    name = 'btbtt'
    allowed_domains = ['www.btbtt.me']
    start_urls = [
        "http://www.btbtt.me/",
        "http://www.btbtt.me/forum-index-fid-951.htm",
        "http://www.btbtt.me/forum-index-fid-950.htm",
        "http://www.btbtt.me/forum-index-fid-1183.htm",
        "http://www.btbtt.me/forum-index-fid-981.htm",
        "http://www.btbtt.me/forum-index-fid-1106.htm",
        "http://www.btbtt.me/forum-index-fid-1193.htm",
    ]
    custom_settings = {
        # "COOKIES_ENABLED": True,
        "DOWNLOAD_DELAY": 3,
        "DOWNLOADER_MIDDLEWARES": {
            # 'MovieSpider.middlewares.RandomProxyMiddleware': 1,
            'MovieSpider.middlewares.RandomUserAgentMiddleware': 200,
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
        "LOG_FILE": "./logs/btbtt.log",
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

        movie_nodes = response.xpath(
            '//a[contains(@class,"subject_link")]/@href').extract()
        for movie_url in movie_nodes:
            yield Request(url=parse.urljoin(response.url, movie_url),
                          meta={"domain_url": response.url}, callback=self.parse_detail)
            # yield FormRequest(url=movie_url, formdata={'huoduan_verifycode': '666',}, callback=self.parse_detail)

        # 提取下一页并交给scrapy进行下载
        if_url = response.xpath('//div[@class="page"]')
        current_url = if_url.xpath(
            'a[@class="checked"]/@href').extract_first("")
        next_url = if_url.xpath('a/@href').extract()[-1]
        if current_url != next_url:
            yield Request(url=parse.urljoin(response.url, next_url), callback=self.parse)

    def parse_detail(self, response):

        item_loader = BtbttItemLoader(item=BtbttItem(), response=response)

        movie_title = response.xpath(
            '//div[@class="bg1 border post"]/h2').xpath('string(.)')
        title_detail = movie_title.extract_first("").strip()
        titles = movie_title.re(r'.*?\[.*?BT.*?\]\[(.*?)\]\[.*?')
        if len(titles) == 0:
            title = title_detail.replace("[", "").replace("]", "")
        else:
            title = titles[0].strip()

        item_loader.add_value("title_detail", title_detail)
        item_loader.add_value("title", title)

        item_loader.add_value("url", response.url)
        item_loader.add_value("url_object_id", get_md5(response.url))

        domain_url = response.meta.get("domain_url", "")
        download_url = []
        download_link_1 = response.xpath('//a[contains(text(),".torrent")]')
        if download_link_1:
            download_url.append("BT下载链接 &nbsp;&nbsp;:")
            for link in download_link_1:
                link_1_title = link.xpath("text()").extract_first("")
                link_1_url = domain_url + \
                    link.xpath("@href").extract_first(
                        "").replace("dialog", "download")
                link1 = link_1_title.strip() + "&nbsp;&nbsp;:<br><br>" + link_1_url
                download_url.append(link1)

        download_link_2_1 = response.xpath(
            '//a[contains(@href,"pan.baidu.com")]/../..')
        download_link_2_2 = " ".join(response.xpath(
            '//div[@class="bg1 border post"]//p').xpath("string(.)").extract())
        if download_link_2_1 or "pan.baidu.com" in download_link_2_2:
            download_url.append("网盘下载链接 &nbsp;&nbsp;:" + response.url)

        # download_link_2 = response.xpath('//a[contains(@href,"pan.baidu.com")]/../..')
        # download_link2_1 = response.xpath('//a[contains(@href,"pan.baidu.com")]/@href').extract()
        # link_2 = download_link_2.xpath('string(.)')
        # if "pan.baidu.com" in link_2:
        #     download_url.append("网盘下载链接 &nbsp;&nbsp;:<br><br>")
        #     match_re_1 = re.findall(r'(pan.baidu.com/s/\w+).*?(密码：\w{4})', link_2)
        #     for link in match_re_1:
        #         link2 = "  ".join(link)
        #         download_url.append(link2 + "&nbsp;&nbsp;<br><br>")
        #
        #     match_re_2 = re.findall(r'(pan.baidu.com/s/\w+).*?', link_2)
        #     for link in match_re_2:
        #         link2 = "  ".join(link)
        #         download_url.append(link2 + "&nbsp;&nbsp;<br><br>")
        # elif download_link2_1:
        #     for link in download_link2_1:
        #         download_url.append(link + "&nbsp;&nbsp;<br><br>")
        #     download_url.append("若需要密码，请访问更多下载链接页面")

        item_loader.add_value('download_url', download_url)
        item_loader.add_value("crawl_time", datetime.now())

        movie_item = item_loader.load_item()

        if len(download_url) > 1:
            return movie_item
