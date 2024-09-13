- 镜像 image
- 容器 container
- 仓库 repository

## 安装
> https://www.runoob.com/docker/centos-docker-install.html
> 阿里云 - 容器镜像服务 - 镜像加速器 

## 镜像命令
```shell
docker images # 查看本地主机镜像

docker search mysql # 搜索
docker search vue --filter=STARS=5000

docker pull mysql # 下载镜像
docker pull mysql:5.7

docker rmi -f mysql # 根据名称删除
docker rmi -f [IMAGE ID] # 根据容器id删除
docker rmi -f $(docker images -aq) # 批量删除全部容器
```

## 容器命令
```shell
docker pull centos

docker run [参数] image
--name="" 给容器命名
-d 后台运行
-it 使用交互方式运行，进入容器查看内容
-p 指定端口 8080:8080 主机端口：容器端口
-P 随机指定端口

docker run -it centos /bin/bash # 启动并进入容器
exit # 容器停止并退出命令
Ctrl + p + q # 退出容器，但是容器不停止

docker ps # 查看当前运行的容器
docker ps -a # 列出所有历史容器
docker ps -n=1 # 列出最近一个容器
docker ps -aq # 列出所有容器编号 

docker rm [CONTAINER ID] # 删除容器 (不能删除正在运行的容器，强制删除使用 -f)
docker rm -f $(docker ps -aq) # 批量删除所有容器
docker ps -a -q|xargs docker rm # 删除所有容器

docker start [CONTAINER ID] # 启动
docker restart [CONTAINER ID] # 重启
docker stop [CONTAINER ID] # 停止
docker kill [CONTAINER ID] # 强制停止
```

## 其他命令
```shell
docker run -d centos # 后台运行，后台运行必须有一个前台进程，如果没有应用，就会自动停止
docker run -d centos /bin/sh

docker logs -tf --tail 10 [CONTAINER ID] # 查看日志该容器最近10条日志

docker top [CONTAINER ID] # 查看该容器内部的进程信息
docker inspect [CONTAINER ID] # 查看该容器的元数据

docker exec -it [CONTAINER ID] /bin/bash # 进入容器 
docker attach [CONTAINER ID] # 进入容器正在执行的终端

docker cp 容器id:容器内文件路径 # 将容器内的文件拷贝到主机上
```

## 安装软件
```shell
# nginx
docker pull nginx # 拉取
docker images # 查看镜像数
docker run -d --name nginx01 -p 3344:80 nginx # 启动 端口映射为3344
docker ps # 查看容器
curl localhost:3344 # 查看启动结果
docker exec -it nginx01 /bin/bash # 命令行的方式进入到容器
docker history 镜像id # 查看历史步骤

# tomcat
docker run -it --rm tomcat:9.0 # --rm 用来测试，用完即删，停止后 docker ps -a 搜索不到
```


## 制作镜像
```shell
# 容器层 - 镜像层

# commit 镜像，用来保存容器的状态
docker commit -a="作者" -m="备注" [IMAGE ID] [IMAGE NAME]:[版本号]
```


## 容器数据卷，容器跟主机目录同步
```shell
# -v /宿主机目录:/容器目录 [镜像名称]:[镜像版本]
# 匿名卷
-v 容器内路径 # 匿名挂载
-v 卷民:容器内路径 # 具名挂载
-v /宿主机路径:容器内路径 # 指定路径挂载
-v /宿主机路径:容器内路径:ro # 只读挂载
-v /宿主机路径:容器内路径:rw # 只写挂载


docker pull mysql:5.7.0
docker run -d -p 3310:3306 -v /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql01 mysql:5.7.0
docker ps
docker exec -it mysql01 /bin/bash

# docker volume ls 查看匿名卷名
# docker volume inspect 匿名卷名 查看匿名卷信息
# 默认匿名卷在 /var/lib/docker/volumes/ 匿名卷名/_data
```

## 数据卷容器 多容器数据共享(volumes 文件)
```shell
# 共享后不同容器间进行文件操作都会同步
# 父容器删除后，子容器数据卷不会删除

# 启动容器01
docker run -it --name docker01 test_centos:1.0
# 容器docker02 继承 docker01 的数据卷
docker run -it --name docker02 --volumes-from docker01 test_centos:1.0
```


## Dockerfile 应用 及 发布
```shell
# 通过脚本生成镜像
# Dockerfile 是一个文本文件，用来配置镜像
# Dockerfile 指令
# FROM 基础镜像
# MAINTAINER 作者
# RUN 执行命令
# ADD 添加文件
# WORKDIR 工作目录
# VOLUME 挂载目录
# EXPOSE 暴露端口
# CMD 启动命令
# COPY 文件拷贝到镜像中
# ENV 设置环境变量

# 构建Dockerfile 文件
FROM centos
MAINTAINER LOUSANPANG<1271255653@qq.com>
VOLUME ['volume01', 'volume02']
ENV MYPATH /usr/local
WORKDIR $MYPATH # 进入镜像直接进入工作目录
RUN yum -y install vim
RUN yum -y install net-tools
EXPOSE 80
CMD echo "----- end -----"
CMD /bin/bash

# 构建、生成镜像 -f PATH/Dockerfile -t name:tag PATH
docker build -f /home/Dockerfile -t test_centos:1.0 . 

# 查看镜像，发现 test_centos 1.0 版本
docker images

docker run -it test_centos
```


## CMD 和 ENTRYPOINT 的区别
- 都是运行命令的意思
- ENTRYPOINT 可以追加命令
```shell
ENTRYPOINT ["ls", "-a"]
docker build -f xx -t xx:1.0 . -l  # 可以追加 -l 命令 就是 ls -al
```
- CMD 外部不能追加，只能覆盖


## 制作 tomcat 镜像包

```shell
# Dockerfile
FROM centos
MAINTAINER LOUSANPANG<1271255653@qq.com>

COPY readme.txt /usr/local/readme.txt # 将外部的说明文件拷贝到容器内

ADD jdk.tar.gz /usr/local/ # 拷贝jdk并解压到容器内
ADD tomcat.tar.gz /usr/local/

RUN yum -y install vim

ENV MYPATH /usr/local
WORKDIR $MYPATH

ENV JAVA_HOME /usr/local/jdk
ENV CLASSPATH $JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar 
ENV CATALINA_HOME /usr/local/tomcat
ENV CATALINA_BASH /usr/local/tomcat
ENV PATH $PATH:$JAVA_HOME/bin:$CATALINA_HOME/lib:$CATALINA_HOME/bin

EXPOSE 8080

CMD /usr/local/tomcat/bin/startup.sh && tail -F /url/local/tomcat/bin/logs/catalina.out
```

```shell
# dockerfile的名字为 Dockerfile时 不需要 -f ，系统会默认找
docker build -t mytomcat:1.0 .

# 后台运行 外网映射端口9090 起名mytomcat 文件数据券映射关联 
docker run -d -p 9090:8080 --name mytomcat -v /home/xxx/build/tomcat/test:/usr/local/tomcat/webapps/test -v /home/xxx/build/tomcat/logs:/usr/local/tomcat/logs mytomcat
```


## 发布到 DockerHub

```shell
docker login -u [username]

docker push [镜像名]:[版本号]
```

## 发布到 阿里云镜像

```shell
登录阿里云 - 找到容器镜像服务 - 创建命名空间 - 创建容器镜像 - 点击查看具体操作步骤
```


## docker Compose


## docker Swarm


## Jenkins
