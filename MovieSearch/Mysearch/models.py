# -*- coding:utf-8 -*-
__author__ = "東飛"
__date__ = "2018-1-28"
from django.db import models
from elasticsearch_dsl import DocType, Date,  Keyword, Text, Completion

from elasticsearch_dsl.connections import connections
connections.create_connection(hosts=["localhost"])
# Create your models here.




from elasticsearch_dsl.analysis import CustomAnalyzer as _CustomAnalyzer
# 设置搜索建议字段
class CustomAnalyzer(_CustomAnalyzer):
    def get_analysis_definition(self):
        return {}

# ik_analyzer = CustomAnalyzer("ik_max_word",filter=["lowercase"])
ik_analyzer = CustomAnalyzer("ik_max_word")

class Dy2018Type(DocType):

    suggest = Completion(analyzer=ik_analyzer) #自动补全

    title = Text( analyzer="ik_max_word" )
    title_detail = Text( analyzer="ik_max_word")
    url = Keyword()
    url_object_id = Keyword()
    crawl_time = Date()
    download_url = Text(index="no")
    source = Text()

    class Meta:
        index = "movies"
        doc_type = "dy2018"

if __name__ == '__main__':

    Dy2018Type.init()
