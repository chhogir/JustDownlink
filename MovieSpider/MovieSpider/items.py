# -*- coding: utf-8 -*-
import re
# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy
# from datetime import datetime
from scrapy.loader import ItemLoader
from scrapy.loader.processors import MapCompose, TakeFirst, Join
from MovieSpider.utils.get_realUrl import real2Thunder
from w3lib.html import remove_tags
from MovieSpider.models.es_types import Dy2018Type

from elasticsearch_dsl.connections import connections

es = connections.create_connection(
    Dy2018Type._doc_type.using, hosts=["xxx.xxx.xxx.xxx"])


# import redis
# redis_cli = redis.StrictRedis()

def gen_suggests(index, info_tuple):
    # 根据字符串生成搜索建议数组
    used_words = set()
    suggests = []
    for text, weight in info_tuple:
        if text:
            # 调用es的analyze接口分析字符串
            words = es.indices.analyze(index=index, analyzer="ik_max_word", params={
                                       'filter': ["lowercase"]}, body=text)
            anylyzed_words = set(
                [r["token"] for r in words["tokens"] if len(r["token"]) > 1])
            new_words = anylyzed_words - used_words
        else:
            new_words = set()

        if new_words:
            suggests.append({"input": list(new_words), "weight": weight})

    return suggests


class MoviespiderItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass


def return_value(value):
    if value:
        return re.sub(r'[\t\r\n\s]', '', value)
    else:
        return ''


def get_title(title_detail):
    match_re = re.match(r'.*?《(.*?)》.*', title_detail)
    if match_re:
        title = match_re.group(1).strip()
    else:
        title = title_detail.strip()
    return title


class MovieItemLoader(ItemLoader):
    # 自定义ItemLoader
    default_output_processor = TakeFirst()


def saves(self, sourcename):
    dy2018 = Dy2018Type()
    dy2018.sourcename = sourcename
    dy2018.title = self['title']
    dy2018.title_detail = self['title_detail']
    dy2018.url = self['url']
    dy2018.meta.id = self['url_object_id']
    dy2018.download_url = self['download_url']
    dy2018.crawl_time = self['crawl_time']

    dy2018.suggest = gen_suggests(
        Dy2018Type._doc_type.index, ((dy2018.title_detail, 10), (dy2018.title, 7)))

    dy2018.save()


# 阳光电影
class Ygdy8Item(scrapy.Item):
    # MapCompose接收title的值、作为参数传入函数处理
    title = scrapy.Field(
        input_processor=MapCompose(get_title),
    )
    title_detail = scrapy.Field()
    url = scrapy.Field()
    url_object_id = scrapy.Field()
    crawl_time = scrapy.Field()
    download_url = scrapy.Field(
        input_processor=MapCompose(return_value),
        output_processor=Join("<br><br>"),
    )

    thunder_url = scrapy.Field(
        input_processor=MapCompose(real2Thunder),
        output_processor=Join(","),
    )

    def get_insert_sql(self):
        insert_sql = """
            insert into ygdy8(title,title_detail, url, url_object_id,crawl_time,download_url,sourcename)
            VALUES (%s, %s, %s, %s, %s, %s, '阳光电影')
            ON DUPLICATE KEY UPDATE
            download_url=VALUES(download_url),
            crawl_time=VALUES(crawl_time)
        """
        # 参数，tuple
        params = (
            self["title"], self["title_detail"],
            self["url"], self["url_object_id"],
            self["crawl_time"], self["download_url"]
        )
        return insert_sql, params

    def save_to_es(self):
        saves(self, "阳光电影")

        return


# 电影天堂
class Dy2018ItemLoader(ItemLoader):
    # 自定义ItemLoader
    default_output_processor = TakeFirst()


class Dy2018Item(scrapy.Item):
    # MapCompose接收title的值、作为参数传入函数处理
    title = scrapy.Field(
        input_processor=MapCompose(get_title),
    )
    title_detail = scrapy.Field()
    url = scrapy.Field()
    url_object_id = scrapy.Field()
    crawl_time = scrapy.Field()
    download_url = scrapy.Field(
        input_processor=MapCompose(return_value),
        output_processor=Join("<br><br>"),
    )

    def get_insert_sql(self):
        insert_sql = """
            insert into dy2018(title,title_detail, url, url_object_id,crawl_time,download_url,sourcename)
            VALUES (%s, %s, %s, %s, %s, %s, '电影天堂')
            ON DUPLICATE KEY UPDATE
            download_url=VALUES(download_url),
            crawl_time=VALUES(crawl_time)
        """
        # 参数，tuple
        params = (
            self["title"], self["title_detail"],
            self["url"], self["url_object_id"],
            self["crawl_time"], self["download_url"]
        )
        return insert_sql, params

    def save_to_es(self):
        saves(self, "电影天堂")

        return


# 迅雷仓
class XunleicangItemLoader(ItemLoader):
    # 自定义ItemLoader
    default_output_processor = TakeFirst()


class XunleicangItem(scrapy.Item):
    # MapCompose接收title的值、作为参数传入函数处理
    title = scrapy.Field()
    title_detail = scrapy.Field(
        input_processor=MapCompose(remove_tags),
    )
    url = scrapy.Field()
    url_object_id = scrapy.Field()
    crawl_time = scrapy.Field()
    download_url = scrapy.Field(
        input_processor=MapCompose(return_value),
        output_processor=Join("<br><br>"),
    )

    def get_insert_sql(self):
        insert_sql = """
            insert into xunleicang(title,title_detail, url, url_object_id,crawl_time,download_url,sourcename)
            VALUES (%s, %s, %s, %s, %s, %s, '迅雷仓')
            ON DUPLICATE KEY UPDATE
            download_url=VALUES(download_url),
            crawl_time=VALUES(crawl_time)
        """
        # 参数，tuple
        params = (
            self["title"], self["title_detail"],
            self["url"], self["url_object_id"],
            self["crawl_time"], self["download_url"]
        )
        return insert_sql, params

    def save_to_es(self):
        saves(self, "迅雷仓")

        return


# 韩粉基地
class Yyj268ItemLoader(ItemLoader):
    # 自定义ItemLoader
    default_output_processor = TakeFirst()


class Yyj268Item(scrapy.Item):
    # MapCompose接收title的值、作为参数传入函数处理
    title = scrapy.Field()
    title_detail = scrapy.Field(
        input_processor=MapCompose(remove_tags),
    )
    title_url = scrapy.Field()
    url = scrapy.Field()
    url_object_id = scrapy.Field()
    crawl_time = scrapy.Field()
    download_url = scrapy.Field(
        input_processor=MapCompose(return_value),
        output_processor=Join("<br><br>"),
    )

    def get_insert_sql(self):
        insert_sql = """
            insert into yyj268(title,title_detail, url, url_object_id,crawl_time,download_url,title_url, sourcename)
            VALUES (%s, %s, %s, %s, %s, %s, %s, '韩粉基地')
            ON DUPLICATE KEY UPDATE
            download_url=VALUES(download_url),
            crawl_time=VALUES(crawl_time)
        """
        # 参数，tuple
        params = (
            self["title"], self["title_detail"],
            self["url"], self["url_object_id"],
            self["crawl_time"], self["download_url"],
            self["title_url"]
        )
        return insert_sql, params

    def save_to_es(self):
        saves(self, "韩粉基地")

        return


# 久久美剧
class Mkv99ItemLoader(ItemLoader):
    # 自定义ItemLoader
    default_output_processor = TakeFirst()


class Mkv99Item(scrapy.Item):
    # MapCompose接收title的值、作为参数传入函数处理
    title = scrapy.Field()
    title_detail = scrapy.Field()
    url = scrapy.Field()
    url_object_id = scrapy.Field()
    crawl_time = scrapy.Field()
    download_url = scrapy.Field(
        input_processor=MapCompose(return_value),
        output_processor=Join("<br><br>"),
    )

    def get_insert_sql(self):
        insert_sql = """
            insert into mkv99(title,title_detail, url, url_object_id,crawl_time,download_url, sourcename)
            VALUES (%s, %s, %s, %s, %s, %s, '久久美剧')
            ON DUPLICATE KEY UPDATE
            download_url=VALUES(download_url),
            crawl_time=VALUES(crawl_time)
        """
        # 参数，tuple
        params = (
            self["title"], self["title_detail"],
            self["url"], self["url_object_id"],
            self["crawl_time"], self["download_url"]
        )
        return insert_sql, params

    def save_to_es(self):
        saves(self, "久久美剧")

        return


# 6V电影网
class Hao6vItemLoader(ItemLoader):
    # 自定义ItemLoader
    default_output_processor = TakeFirst()


class Hao6vItem(scrapy.Item):
    # MapCompose接收title的值、作为参数传入函数处理
    title = scrapy.Field(
        input_processor=MapCompose(get_title),
    )
    title_detail = scrapy.Field()
    url = scrapy.Field()
    url_object_id = scrapy.Field()
    crawl_time = scrapy.Field()
    download_url = scrapy.Field(
        input_processor=MapCompose(return_value),
        output_processor=Join("<br><br>"),
    )

    def get_insert_sql(self):
        insert_sql = """
            insert into hao6v(title,title_detail, url, url_object_id,crawl_time,download_url,sourcename)
            VALUES (%s, %s, %s, %s, %s, %s, '6V电影网')
            ON DUPLICATE KEY UPDATE
            download_url=VALUES(download_url),
            crawl_time=VALUES(crawl_time)
        """
        # 参数，tuple
        params = (
            self["title"], self["title_detail"],
            self["url"], self["url_object_id"],
            self["crawl_time"], self["download_url"]
        )
        return insert_sql, params

    def save_to_es(self):
        saves(self, "6V电影网")

        return


# LOL电影天堂
class LoldyttwItemLoader(ItemLoader):
    # 自定义ItemLoader
    default_output_processor = TakeFirst()


class LoldyttwItem(scrapy.Item):
    # MapCompose接收title的值、作为参数传入函数处理
    title = scrapy.Field()
    title_detail = scrapy.Field()
    url = scrapy.Field()
    url_object_id = scrapy.Field()
    crawl_time = scrapy.Field()
    download_url = scrapy.Field(
        input_processor=MapCompose(return_value),
        output_processor=Join("<br><br>"),
    )

    def get_insert_sql(self):
        insert_sql = """
            insert into loldyttw(title,title_detail, url, url_object_id,crawl_time,download_url,sourcename)
            VALUES (%s, %s, %s, %s, %s, %s, 'LOL电影天堂')
            ON DUPLICATE KEY UPDATE
            download_url=VALUES(download_url),
            crawl_time=VALUES(crawl_time)
        """
        # 参数，tuple
        params = (
            self["title"], self["title_detail"],
            self["url"], self["url_object_id"],
            self["crawl_time"], self["download_url"]
        )
        return insert_sql, params

    def save_to_es(self):
        saves(self, "LOL电影天堂")

        return


# 龙部落
class LbldyItemLoader(ItemLoader):
    # 自定义ItemLoader
    default_output_processor = TakeFirst()


class LbldyItem(scrapy.Item):
    # MapCompose接收title的值、作为参数传入函数处理
    title = scrapy.Field(
        input_processor=MapCompose(get_title),
    )

    title_detail = scrapy.Field()
    url = scrapy.Field()
    url_object_id = scrapy.Field()
    crawl_time = scrapy.Field()
    download_url = scrapy.Field(
        input_processor=MapCompose(return_value),
        output_processor=Join("<br><br>"),
    )

    def get_insert_sql(self):
        insert_sql = """
            insert into lbldy(title,title_detail, url, url_object_id,crawl_time,download_url,sourcename)
            VALUES (%s, %s, %s, %s, %s, %s, '龙部落')
            ON DUPLICATE KEY UPDATE
            download_url=VALUES(download_url),
            crawl_time=VALUES(crawl_time)
        """
        # 参数，tuple
        params = (
            self["title"], self["title_detail"],
            self["url"], self["url_object_id"],
            self["crawl_time"], self["download_url"]
        )
        return insert_sql, params

    def save_to_es(self):
        saves(self, "龙部落")

        return


# 美剧天堂
class MeijuttItemLoader(ItemLoader):
    # 自定义ItemLoader
    default_output_processor = TakeFirst()


class MeijuttItem(scrapy.Item):
    # MapCompose接收title的值、作为参数传入函数处理
    title = scrapy.Field(
        input_processor=MapCompose(get_title),
    )
    title_detail = scrapy.Field()
    url = scrapy.Field()
    url_object_id = scrapy.Field()
    crawl_time = scrapy.Field()
    download_url = scrapy.Field(
        input_processor=MapCompose(return_value),
        output_processor=Join("<br><br>"),
    )

    def get_insert_sql(self):
        insert_sql = """
            insert into meijutt(title,title_detail, url, url_object_id,crawl_time,download_url,sourcename)
            VALUES (%s, %s, %s, %s, %s, %s, '美剧天堂')
            ON DUPLICATE KEY UPDATE
            download_url=VALUES(download_url),
            crawl_time=VALUES(crawl_time)
        """
        # 参数，tuple
        params = (
            self["title"], self["title_detail"],
            self["url"], self["url_object_id"],
            self["crawl_time"], self["download_url"]
        )
        return insert_sql, params

    def save_to_es(self):
        saves(self, "美剧天堂")

        return


# 电影首发站
class DysfzItemLoader(ItemLoader):
    # 自定义ItemLoader
    default_output_processor = TakeFirst()


class DysfzItem(scrapy.Item):
    # MapCompose接收title的值、作为参数传入函数处理
    title = scrapy.Field()
    title_detail = scrapy.Field()
    url = scrapy.Field()
    url_object_id = scrapy.Field()
    crawl_time = scrapy.Field()
    download_url = scrapy.Field(
        input_processor=MapCompose(return_value),
        output_processor=Join("<br><br>"),
    )

    def get_insert_sql(self):
        insert_sql = """
            insert into dysfz(title,title_detail, url, url_object_id,crawl_time,download_url,sourcename)
            VALUES (%s, %s, %s, %s, %s, %s, '电影首发站')
            ON DUPLICATE KEY UPDATE
            download_url=VALUES(download_url),
            crawl_time=VALUES(crawl_time)
        """
        # 参数，tuple
        params = (
            self["title"], self["title_detail"],
            self["url"], self["url_object_id"],
            self["crawl_time"], self["download_url"]
        )
        return insert_sql, params

    def save_to_es(self):
        saves(self, "电影首发站")
        return


# BT之家
class BtbttItemLoader(ItemLoader):
    # 自定义ItemLoader
    default_output_processor = TakeFirst()


class BtbttItem(scrapy.Item):
    # MapCompose接收title的值、作为参数传入函数处理
    title = scrapy.Field()
    title_detail = scrapy.Field()
    url = scrapy.Field()
    url_object_id = scrapy.Field()
    crawl_time = scrapy.Field()
    download_url = scrapy.Field(
        input_processor=MapCompose(return_value),
        output_processor=Join("<br><br>"),
    )

    def get_insert_sql(self):
        insert_sql = """
            insert into btbtt(title,title_detail, url, url_object_id,crawl_time,download_url,sourcename)
            VALUES (%s, %s, %s, %s, %s, %s, 'BT之家')
            ON DUPLICATE KEY UPDATE
            download_url=VALUES(download_url),
            crawl_time=VALUES(crawl_time)
        """
        # 参数，tuple
        params = (
            self["title"], self["title_detail"],
            self["url"], self["url_object_id"],
            self["crawl_time"], self["download_url"]
        )
        return insert_sql, params

    def save_to_es(self):
        saves(self, "BT之家")
        return
