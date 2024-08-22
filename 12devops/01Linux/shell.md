## 介绍使用

1、.sh文件 开头固定写
`#!/bin/bash`

2、添加文件权限
`chmod u+x xx.sh`

3 不赋予权限，使用 sh 命令
`sh xx.sh`

4 多行注释
```bash
:<<!
内容
!
```


## 变量

1 系统变量
`$HOME $PATH $SHELL $USER`

2 内部变量
```bash
A=1
echo $A

# 撤销变量
unset A

# 静态变量
readOnly B=2

# 将命令的返回值赋给变量
D=`date`
D=${date}
```

3 设置环境变量、全局变量
```bash
vim /etc/profile

export XXX=/opt/XXX

source /etc/profile
```

## 参数
```bash
sh ./xx.sh 100 200
```

```bash
#!/bin/bash
echo $1 $2 # 打印第一个参数100 第二个参数200
echo $# # 打印参数的个数 2
```

## 计算
```bash
# 方式一
$(((2+3)*4))

# 方式二
$[(2+3)*4]

# 方式三
RES=`expr 2 + 3`
RES2=`expr $RES \* 4`
echo RES2
```

## 条件判断 
```bash
if [ "ok" = "ok" ]
then
  echo "yes"
fi


if [ $1 -ge 60 ]
then
  echo "及格"
elif [ $1 -lt 60 ]
then
  echo "不及格"
fi


if [ -f /root/aa.text ]
then 
  echo "文件存在"
fi
```

## case
```bash
case $1 in
"1")
echo "周一"
;;
"2")
echo "周二"
;;
*)
echo "其他"
;;
esac
```

## 循环
```bash
#!/bin/bash

# 循环打印参数
for i in "$@"
do
  echo "num is $i"
done

# 1-100
SUM=0
for (( i=1; i<=100; i++ ))
do
  SUM=$[$SUM+$i]
done

# while
NUM=0
J=1
while [ $J -le 10 ]
do
  NUM=$[$NUM+$J]
  J=$[$J+1]
done
```

## 控制台对话
```bash
read -p "请输入一个数NUM=" NUM 
echo "你输入的NUM=$NUM"

# 要求10s内输入
read -t 10 -p ""
```

## 系统函数
```bash
basename /home/a.text -> a.text
basename /home/a.text .text -> a 
dirname /home/a.text -> /home
```

## 自定义函数
```bash
#!/bin/bash

function getSum() {
  SUM=$[$n1+$n2]
  echo "和是SUM=$SUM"
}

read -p "请输入一个数n1=" n1
read -p "请输入一个数n2=" n2

getSum $n1 $n2
```
