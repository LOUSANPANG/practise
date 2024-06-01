/**
 * 本地域名：尝试修改 /ect/host 做域名映射到本地
 * 
 * 
 * 购买云服务器
 *  管控台 - 实例 - 复制公网IP
 *  远程连接IP - 连接服务器账号、密码
 *  远程桌面安装相关软件 git node mongodb - down相关远程代码 - 将项目运行 - 通过公网IP进行访问
 * 
 * 
 * 域名购买、解析
 *  产品 - 域名 - 购买域名 - 控制台 - ICP备案
 *  解析：添加记录 - 记录类型：IPV4 - 主机记录：www - 记录值：公网IP
 * 
 * 
 * 配置https证书
 *  下载 certbot 工具
 *  获取证书：certbot certonly --standalone
 *  修改创建服务，https.createServer({ key, cert, ca }) 
 *  修改端口为 443
 * 
 *  证书更新：certbot renew
 */
