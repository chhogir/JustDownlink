import json
import redis
from django.shortcuts import render
from django.views.generic.base import View
from Mysearch.models import Dy2018Type
from django.http import HttpResponse
from elasticsearch import Elasticsearch
from datetime import datetime
from django.db import connection
from django.http import HttpResponseRedirect


client = Elasticsearch(hosts=["127.0.0.1"])
# redis_cli = redis.StrictRedis(password='root')
redis_cli = redis.StrictRedis()


# Create your views here.

class IndexView(View):
    # 首页
    def get(self, request):
        topn_search = redis_cli.zrevrangebyscore("search_keywords_set", "+inf", "-inf", start=0, num=5)
        return render(request, "index.html", {"topn_search": topn_search})


class AboutView(View):
    # 关于
    def get(self, request):
        return render(request, "about.html")


class ContactView(View):
    # 联系
    def get(self, request):
        name = request.GET.get('name', '')
        email = request.GET.get('email', '')
        message = request.GET.get('message', '')
        dt = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        sql = "INSERT INTO moviesearch(name,email,message,time) VALUES('%s','%s','%s','%s')" % (
        name, email, message, dt)
        if name != '' and email != '':
            cursor = connection.cursor()
            try:
                cursor.execute(sql)
                cursor.close()
                connection.commit()
            except Exception as e:
                connection.rollback()
            finally:
                connection.close()
            return HttpResponseRedirect("?success") #跳转到success界面

        return render(request, "contact.html")


# Create your views here.
class SearchSuggest(View):
    def get(self, request):
        key_words = request.GET.get('s', '')
        re_datas = []
        if key_words:
            s = Dy2018Type.search()
            s = s.suggest('my_suggest', key_words, completion={
                "field": "suggest", "fuzzy": {
                    "fuzziness": 2
                },
                "size": 10
            })
            suggestions = s.execute_suggest()
            for match in suggestions.my_suggest[0].options:
                source = match._source
                re_datas.append(source["title_detail"])
        return HttpResponse(json.dumps(re_datas), content_type="application/json")


class SearchView(View):
    def get(self, request):
        key_words = request.GET.get("q", "")
        # 搜索记录、热门搜索功能实现
        redis_cli.zincrby("search_keywords_set", key_words)

        topn_search = redis_cli.zrevrangebyscore("search_keywords_set", "+inf", "-inf", start=0, num=5)
        movie_count = redis_cli.get("movie_count")

        page = request.GET.get("p", "1")
        try:
            page = int(page)
            if page <= 1:
                page = 1
        except:
            page = 1

        start_time = datetime.now()
        response = client.search(
                index="movies",
                body={
                    "query": {
                        "multi_match": {
                            "query": key_words,
                            "fields": ["title_detail", "title"]
                        }
                    },
                    "from": (page - 1) * 10,
                    "size": 10,
                    "highlight": {
                        "pre_tags": ["<span class='keyWord'>"],
                        "post_tags": ["</span>"],
                        "fields": {
                            "title": {},
                            "title_detail": {},
                        }
                    }
                }
        )
        end_time = datetime.now()
        last_seconds = (end_time - start_time).total_seconds()
        total_nums = response["hits"]["total"]

        if (page % 10 > 0):
            page_nums = int(total_nums / 10) + 1
        else:
            page_nums = int(total_nums / 10)

        hit_list = []
        for hit in response["hits"]["hits"]:
            hit_dict = {}
            if "title_detail" in hit["highlight"]:
                hit_dict["title_detail"] = "".join(hit["highlight"]["title_detail"])
            else:
                hit_dict["title_detail"] = hit["_source"]["title_detail"]

            if "title" in hit["highlight"]:
                hit_dict["title"] = "".join(hit["highlight"]["title"])
            else:
                hit_dict["title"] = hit["_source"]["title"]

            hit_dict["crawl_time"] = hit["_source"]["crawl_time"]
            hit_dict["url"] = hit["_source"]["url"]
            hit_dict["sourcename"] = hit["_source"]["sourcename"]
            hit_dict["download_url"] = hit["_source"]["download_url"]
            hit_dict["score"] = hit["_score"]

            hit_list.append(hit_dict)

        return render(request, "result.html", {
            "page": page,
            "all_hits": hit_list,
            "key_words": key_words,
            "total_nums": total_nums,
            "page_nums": page_nums,
            "last_seconds": last_seconds,
            "movie_count": movie_count,
            "topn_search": topn_search,
        })
