# -*- coding:utf-8 -*-
__author__ = "東飛"
__date__ = "2018-1-28"

from elasticsearch_dsl import DocType, Date, Keyword, Text, Completion
from elasticsearch_dsl.connections import connections
from elasticsearch_dsl.analysis import CustomAnalyzer as _CustomAnalyzer

connections.create_connection(hosts=["xxx.xxx.xxx.xxx"])


# 设置搜索建议字段
class CustomAnalyzer(_CustomAnalyzer):
    def get_analysis_definition(self):
        return {}


ik_analyzer = CustomAnalyzer("ik_max_word", filter=["lowercase"])


class Dy2018Type(DocType):
    # 自动补全
    suggest = Completion(analyzer=ik_analyzer)

    title = Text(analyzer="ik_max_word")
    title_detail = Text(analyzer="ik_max_word")
    url = Keyword()
    url_object_id = Keyword()
    crawl_time = Date()
    download_url = Text(index="no")
    sourcename = Text()

    class Meta:
        index = "movies"
        doc_type = "dy2018"


if __name__ == '__main__':
    Dy2018Type.init()
