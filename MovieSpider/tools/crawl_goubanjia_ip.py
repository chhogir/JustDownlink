# -*- coding:utf-8 -*-
__author__ = "東飛"
__date__ = "2017-12-9"

import requests
from scrapy.selector import Selector
import MySQLdb

conn = MySQLdb.connect(host="127.0.0.1", user="root", passwd="xxxx", db="movies", port=3306, charset="utf8")
cursor = conn.cursor()


def crawl_ips():
    proxies = {"http1": "http://51.15.137.244:3128",
               "http2": "http://110.39.168.50:8080",}
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2224.3 Safari/537.36',
    }
    ip_list = []
    for i in range(166):
        ip_url = "http://www.goubanjia.com/free/gwpn/index{0}.shtml".format(
                i + 1)
        re = requests.get(url=ip_url, headers=headers, proxies=proxies)
        selector = Selector(text=re.text)
        all_tds = selector.css("#list td.ip")

        # 注意第一个是表头
        for td in all_tds:
            ip_css = td.css("span::text,div::text").extract()
            ip = ''.join(ip_css[0:-1])
            port = ip_css[-1]
            ip_list.append((ip, port))

            for ip_info in ip_list:
                try:
                    insert_sql = "INSERT INTO proxy_ip(ip, port) VALUES('{0}','{1}')".format(
                            ip_info[0], ip_info[1])
                    cursor.execute(insert_sql)
                except MySQLdb.Error as e:
                    print(e, "更新数据：", ip_info[0])
                    insert_sql = "UPDATE proxy_ip SET port='{1}' WHERE ip='{0}'".format(
                            ip_info[0], ip_info[1])
                    cursor.execute(insert_sql)
                conn.commit()
                ip_list.pop()


class GetIP(object):
    def get_random_ip(self):
        # 从数据库中随机获取一个可用的IP
        random_sql = "SELECT * FROM valid_ip ORDER BY RAND() LIMIT 1;"
        result = cursor.execute(random_sql)
        for ip_info in cursor.fetchall():
            ip = ip_info[0]
            port = ip_info[1]
            return "http://{0}:{1}".format(ip, port)

    def judge_ip(self, ip, port):
        # 判断ip是否可用
        http_url = "https://www.baidu.com"
        proxy_url = "https://{0}:{1}".format(ip, port)
        try:
            proxy_dit = {
                "http": proxy_url
            }
            response = requests.get(http_url, proxies=proxy_dit)
        except Exception as e:
            print("Invalid IP and PORT")
            self.delete_ip(ip)
            return False
        else:
            code = response.status_code
            if code >= 200 and code < 300:
                print("Effective IP")
                return True
            else:
                print("Invalid IP and PORT")
                self.delete_ip(ip)
                return False

    def delete_ip(self, ip):
        # 从数据中删除无效的IP
        delete_sql = "DELETE FROM proxy_ip WHERE ip = '{0}'".format(ip)
        cursor.execute(delete_sql)
        conn.commit()
        return True

    def insert_vaild_ip(self):
        random_sql = "SELECT * FROM proxy_ip ORDER BY RAND() LIMIT 1;"
        result = cursor.execute(random_sql)
        for ip_info in cursor.fetchall():
            ip = ip_info[0]
            port = ip_info[1]
            judge_re = self.judge_ip(ip, port)
            if judge_re:
                print("http://{0}:{1}".format(ip, port))
                try:
                    insert_sql = "INSERT INTO valid_ip(ip, port ) VALUES('{0}','{1}')".format(
                            ip, port)
                    cursor.execute(insert_sql)
                except MySQLdb.Error as e:
                    print(e, "更新数据：", ip)
                    insert_sql = "UPDATE valid_ip SET port='{1}' WHERE ip='{0}'".format(
                            ip, port)
                    cursor.execute(insert_sql)
                conn.commit()
            else:
                return self.insert_vaild_ip()


if __name__ == "__main__":
    crawl_ips()
    # get_ip = GetIP()
    # for i in range(156):
    #     ip = get_ip.insert_vaild_ip()
    #     print(ip)
    # ip = get_ip.get_random_ip()
    # print(ip)
