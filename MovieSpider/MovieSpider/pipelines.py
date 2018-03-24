# -*- coding: utf-8 -*-
from scrapy.exporters import JsonItemExporter
from datetime import datetime, date
from twisted.enterprise import adbapi
# 光标移动至单词、单击进入函数定义
import MySQLdb
import MySQLdb.cursors
import codecs
import json
from MovieSpider.models.es_types import Dy2018Type


# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html


class MoviespiderPipeline(object):
    def process_item(self, item, spider):
        return item


# 解决json.dumps不能序列化datetime类型的问题
class MyDatetimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        else:
            return json.JSONEncoder.default(self, obj)


# 注意使自定义的pipeline生效、需要在settings.py中设置
# 将数据保存在json文件中
# 自定义json文件的导出
class JsonWithEncodingPipeline(object):
    # 初始化时打开文件，使用codecs包、与普通open()函数最大的区别在于文件的编码
    def __init__(self):
        self.file = codecs.open(
            'dbs/movieExporter.json', 'w', encoding='utf-8')
        self.file.write("[\n")

    # 处理item，写入article.json 文件中
    def process_item(self, item, spider):
        # item类似于dict、要将其转换为dict
        # 注意ensure_ascii设置为false、否则存储中文或其他字符显示出错
        # lines = json.dumps(dict(item),ensure_ascii=False)+'\n'

        # 疑问：pipeline的执行顺序
        lines = json.dumps(dict(item), cls=MyDatetimeEncoder,
                           ensure_ascii=False) + '\n'
        self.file.write(lines + ",")
        print(item['crawl_time'])
        return item

    # 关闭文件
    def spider_closed(self, spider):
        self.file.write("\n]")
        self.file.close()


# scrpay本身也提供了一种写入json的机制，可以很方便的将item导出为各种数据
# from scrapy.exporters import JsonItemExporter
# 调用scrapy 提供的json exporter导出json文件
class JsonExporterPipeline(object):
    def __init__(self):
        self.file = open("dbs/movieExporter.json", 'wb')
        self.exporter = JsonItemExporter(
            self.file, encoding='utf-8', ensure_ascii=False)
        self.exporter.start_exporting()

    def start_exporting(self):
        self.file.write(b"[\n")
        self._beautify_newline()

    def finish_exporting(self):
        self._beautify_newline()
        self.file.write(b"\n]")

    def process_item(self, item, spider):
        self.exporter.export_item(item)
        return item

    def close_spider(self, spider):
        self.exporter.finish_exporting()
        self.file.close()


# 数据保存至数据库
class MysqlPipeline(object):
    # 采用同步的机制写入mysql
    # 连接数据库、引入包Mysqldb
    # 注意设置encoding=utf8不能写为utf-8
    def __init__(self):
        self.conn = MySQLdb.connect(host='127.0.0.1', user='root', password='root', database='movies', port=3308,
                                    charset="utf8", use_unicode=True)
        self.cursor = self.conn.cursor()

    def process_item(self, item, spider):
        insert_sql = """
            insert into ygdy8(title,title_detail, url, url_object_id, crawl_time,ftp_url,thunder_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        self.cursor.execute(insert_sql,
                            (
                                item["title"], item["title_detail"], item["url"], item["url_object_id"],
                                item["crawl_time"],
                                item["ftp_url"], item["thunder_url"]))
        self.conn.commit()

        return item


class MysqlTwistedPipeline(object):
    def __init__(self, dbpool):
        self.dbpool = dbpool

    @classmethod
    def from_settings(cls, settings):
        dbparms = dict(
            host=settings["MYSQL_HOST"],
            port=settings["MYSQL_PORT"],
            user=settings["MYSQL_USER"],
            passwd=settings["MYSQL_PASSWORD"],
            db=settings["MYSQL_DBNAME"],
            charset="utf8",
            cursorclass=MySQLdb.cursors.DictCursor,
            use_unicode=True,
            cp_reconnect=True,
        )
        # 注意调用的是adb.ConnectionPool()、而不是adb.Connection()
        dbpool = adbapi.ConnectionPool("MySQLdb", **dbparms)
        return cls(dbpool)

    def process_item(self, item, spider):
        # 使用twisted将mysql插入变成异步插入
        query = self.dbpool.runInteraction(self.do_insert, item)
        # 处理异常
        query.addErrback(self.handle_error, item, spider)

        return item

    def handle_error(self, failure, item, spider):
        # 处理异步插入的异常
        print(failure)

    def do_insert(self, cursor, item):
        #  执行具体的插入
        #  根据不同的item 构建不同的sql语句并插入到mysql中
        # 方法一
        # if item.__class__.__name__ == "JobBoleArticleItem"
        # 方法二
        # 利用Django中的model模式、写一个专门实现get_insert_sql()的函数

        insert_sql, params = item.get_insert_sql()
        cursor.execute(insert_sql, params)

        # insert_sql = """
        #     insert into article(title, url, create_date, fav_nums)
        #     VALUES (%s, %s, %s, %s)
        # """
        # cursor.execute(insert_sql, (item["title"], item["url"], item["create_date"], item["fav_nums"]))

        # 已自动提交，不需要再提交了


# 将数据保存至elasticsearch
class ElasticsearchPipeline(object):
    # 将item转换为es数据
    def process_item(self, item, spider):
        item.save_to_es()

        return item
