#!/bin/expect
#
#author: Xin Tan
#example: `sh ./deploy.sh 192.168.1.111`

if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    echo "example:"
    echo "sh ./deploy.sh 192.168.1.111"
    exit 1
fi

server=$1

DIR="./dist/"


if [ -d "./dist/" ];
then
	echo "delete existing build first"
	rm -rf ./dist/
fi

# 检查当前文件夹下 dist/ 文件夹是否存在

if [ ! -d "./dist/" ];
then
  echo "dist not exist, try run 'npm run build' first"
  mkdir -p ./dist/
fi

# 检查当前文件夹下 dist/ 是否为空
if [ ! "$(ls -A $DIR)" ];
then
  echo "dist folder is empty, running 'npm run build' first"
  npm run build
fi

# 执行 scp dist/ 到 目标服务器

echo "start coping files to $server:/home/antif/www/guanxing/"

scp -r  dist/ root@$server:/home/antif/www/guanxing/

echo "copy completed, restarting nginx on $server"

# send "$passwd\n" 

# 执行重启 nginx

ssh root@$server "/home/antif/nginx-1.14.2/sbin/nginx -s reload"

echo "server restarted, exit now"