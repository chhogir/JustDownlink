#! /bin/sh   
export PATH=$PATH:/usr/local/bin

today=`date  +%Y-%m-%d`

now=`date '+%Y-%m-%d %H:%M:%S'`


echo -e  "\n$now  日志更新： \n "  > "/root/esdump/stask/current.log" 

tail -1000 "/root/esdump/stask/${today}.log" >> "/root/esdump/stask/current.log"    

cat /dev/null > /root/esdump/stask/${today}.log


