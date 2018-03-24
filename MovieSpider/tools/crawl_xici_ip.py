# -*- coding:utf-8 -*-
__author__ = "東飛"
__date__ = "2017-12-9"

import requests
from scrapy.selector import Selector
import MySQLdb

conn = MySQLdb.connect(host="127.0.0.1", user="root", passwd="xxx", db="movies", port=3306, charset="utf8")
cursor = conn.cursor()


def crawl_ips():
    proxies = {"http1": "http://223.241.118.167:8010",
               "http2": "http://183.23.72.87:808",}
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2224.3 Safari/537.36',
    }
    ip_list = []
    for i in range(2569):
        ip_url = "http://www.xicidaili.com/nn/{0}".format(i)
        re = requests.get(url=ip_url, headers=headers, proxies=proxies)
        selector = Selector(text=re.text)
        all_trs = selector.css("#ip_list tr")

        # 注意第一个是表头
        for tr in all_trs[1:]:
            speed_str = tr.css(".bar::attr(title)").extract()[0]
            if speed_str:
                speed = float(speed_str.split("秒")[0])
            all_texts = tr.css("td::text").extract()
            ip = all_texts[0]
            port = all_texts[1]
            proxy_type = all_texts[5]
            ip_list.append((ip, port, speed, proxy_type))

            for ip_info in ip_list:
                try:
                    insert_sql = "INSERT INTO proxy_ip(ip, port ,speed, proxy_type ) VALUES('{0}','{1}',{2},'{3}')".format(
                            ip_info[0], ip_info[1], ip_info[2], ip_info[3])
                    cursor.execute(insert_sql)
                except MySQLdb.Error as e:
                    print(e, "更新数据：", ip_info[0])
                    insert_sql = "UPDATE proxy_ip SET port='{1}', speed={2}, proxy_type='{3}' WHERE ip='{0}'".format(
                            ip_info[0], ip_info[1], ip_info[2], ip_info[3])
                    cursor.execute(insert_sql)
                conn.commit()
                ip_list.pop()


class GetIP(object):
    def get_random_ip(self):
        # 从数据库中随机获取一个可用的IP
        random_sql = "SELECT * FROM proxy_ip ORDER BY RAND() LIMIT 1;"
        result = cursor.execute(random_sql)
        for ip_info in cursor.fetchall():
            ip = ip_info[0]
            port = ip_info[1]
            judge_re = self.judge_ip(ip, port)
            if judge_re:
                return "http://{0}:{1}".format(ip, port)
            else:
                return self.get_random_ip()

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


if __name__ == "__main__":
    # crawl_ips()
    get_ip = GetIP()
    ip = get_ip.get_random_ip()
    print(ip)
