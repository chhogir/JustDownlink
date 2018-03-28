#!/bin/bash


spidernames=(
"dy2018" 
"ygdy8" 
"ygdy8net" 
"mkv99" 
"xunleicang" 
"yyj268"
)


 
 for((i=0;i<${#spidernames[*]};i++))
 do
 	echo "${spidernames[$i]}"
 done
 
 
# index=0
# for i in ${spidernames[@]}
# do
# 	echo "第${index}个元素为: ${i}"
# 	let index++
# done
# 

cat es_to_json.sh >> ~/"test.log"

	
