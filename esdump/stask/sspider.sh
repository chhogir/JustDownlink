#! /bin/sh   
export PATH=$PATH:/usr/local/bin  
 
today=`date  +%Y-%m-%d`

# 创建每天文件日志
touch "/root/esdump/stask/${today}.log"
#touch "/root/esdump/stask/current.log"

cd /root/esdump/stask/

# 执行.py中定义的项目example，并指定日志文件，其中nohup....&表示可以在后台执行，不会因为关闭终端而导致程序执行中断。  
nohup /root/esdump/es_to_json.sh >  "/root/esdump/stask/${today}.log"  2>&1 &
#nohup /root/esdump/es_to_json.sh >  /root/esdump/stask/current.log  2>&1  &

# 保存错误日志文件
#nohup /root/esdump/es_to_json.sh >/dev/null 2>/root/esdump/stask/${today}.log  &  

