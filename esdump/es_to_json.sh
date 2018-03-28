#! /bin/sh   

# 等号两边不能有空格
# ENV=py3
# source $WORKON_HOME/$ENV/bin/activate

export WORKON_HOME=$HOME/PyProject
source /usr/bin/virtualenvwrapper.sh


spidernames=(
"dy2018"
"yyj268"
"btbtt"
"lbldy"
"hao6v"
"ygdy8"
"ygdy8net"
"xunleicang"
"dysfz"
"loldyttw"
"meijutt"
"mkv99"
)

today=`date  +%Y-%m-%d`

if [ ! -d "/root/esdump/backup/$today/" ];then
mkdir -p /root/esdump/backup/$today/
else
echo "文件夹已经存在"
fi

#rm -rf /root/esdump/backup/$today/
#mkdir -p /root/esdump/backup/$today/

rm -rf /root/PyProject/py3/projects/MovieSpider/MovieSpider/logs/*

workon py3

cd /root/PyProject/py3/projects/MovieSpider/MovieSpider

curl -XDELETE "http://193.112.76.15:9200/movies/"


for((i=0;i<${#spidernames[*]};i++))
do

python  ./models/es_types.py

scrapy crawl "${spidernames[$i]}" 

elasticdump  --input='http://193.112.76.15:9200/movies'   --output="/root/esdump/backup/${today}/movies-data-${spidernames[$i]}.json" --type=data

curl -XDELETE "http://193.112.76.15:9200/movies/"

done

deactivate


