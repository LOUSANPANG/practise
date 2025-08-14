## 通用语法

- 分号结尾
- 可单行、可多行、可空格、可锁进
- 关键字大写
- 注释
  - 单行注释：-- 或者 #
  - 多行注释：/* */


## 分类

- DDL 数据定义语言 用来定义数据库对象（数据库、表、字段）
- DML 数据操作语言 数据库表中的数据 增删改查
- DQL 数据查询语言 从数据库表中查询数据
- DCL 数据控制语言 控制数据库的访问权限和安全设置


## DDL 

### 数据库操作

```bash
# 查询
SHOW DATABASES;

# 查询当前数据库
SELECT DATABASE();

# 创建
# 字符集 utf8mb4
CREATE DATABASE [IF NOT EXISTS] 数据库名 [DEFAULT CHARSET 字符集] [COLLATE 排序规则];

# 删除
DROP DATABASE [IF EXISTS] 数据库名;

# 使用
USE 数据库名;
```

### 表操作

```bash
# 查询当前数据库的所有表
SHOW TABLES;
# 查询表的结构
DESC 表名;
# 查询指定表的建表语句
SHOW CREATE TABLE 表名;

# 创建表
CREATE TABLE [IF NOT EXISTS] 表名 (
    字段名 字段类型 [COMMENT '字段注释'] [DEFAULT 默认值],
    字段名 字段类型 [COMMENT '字段注释'] [DEFAULT 默认值]
)[COMMENT '表注释'];

# 删除表
DROP TABLE [IF EXISTS] 表名;

# 删除指定表，并重新创建该表
TRUNCATE TABLE 表名;

# 修改表名
ALTER TABLE 表名
RENAME TO 新表名;
```


### 表-字段操作

```bash
# 添加字段
ALTER TABLE 表名
ADD 字段名 字段类型 [COMMENT '字段注释'] [DEFAULT 默认值];

# 删除字段
ALTER TABLE 表名
DROP 字段名;

# 修改字段类型
ALTER TABLE 表名
MODIFY 字段名 新字段类型 [COMMENT '新字段注释'] [DEFAULT 新默认值];

# 修改字段名和字段类型
ALTER TABLE 表名
CHANGE 旧字段名 新字段名 新字段类型 [COMMENT '新字段注释'] [DEFAULT 新默认值];

# 修改字段注释
ALTER TABLE 表名
MODIFY COLUMN 字段名 字段类型 COMMENT '新字段注释';

# 修改字段默认值
ALTER TABLE 表名
MODIFY COLUMN 字段名 字段类型 DEFAULT 新默认值;
```


### mysql 数据类型

```bash
# 字符串类型
VARCHAR(length) # 变长字符串
CHAR(length) # 定长字符串
TEXT # 长文本
MEDIUMTEXT # 中等长度文本
LONGTEXT # 极大长度文本

# 数值类型
TINYINT # 小整数
SMALLINT # 短整数
MEDIUMINT # 中等整数
INT # 整数
BIGINT # 长整数
DOUBLE # 双精度浮点数
DECIMAL # 定点数

UNSIGNED # 无符号整数

# 日期时间类型
DATE # 日期
DATETIME # 日期时间
TIMESTAMP # 时间戳

# 枚举类型
ENUM('值1', '值2', ...) # 枚举类型

# 集合类型
SET('值1', '值2', ...) # 集合类型
```


## DML 用来对数据库中表的数据记录进行增删改操作

```bash
# 添加
INSERT INTO 表名 (字段1, 字段2, ...) VALUES (值1, 值2, ...); # 指定字段添加指定数据
INSERT INTO 表名 VALUES (值1, 值2, ...); # 全部字段添加数据
INSERT INTO 表名 (字段1, 字段2, ...) VALUES (值1, 值2, ...), (值1, 值2, ...), ...; # 指定字段批量添加数据
INSERT INTO 表名 VALUES (值1, 值2, ...), (值1, 值2, ...), ...; # 批量添加数据

# 删除
DELETE FROM 表名 [WHERE 条件];

# 修改
UPDATE 表名
SET 字段1 = 新值1, 字段2 = 新值2, ...
[WHERE 条件];
```


## DQL 用来查询数据库中的数据记录

```bash
SELECT 字段列表 FROM 表名 WHERE 条件列表 GROUP BY 分组字段列表 HAVING 分组后条件列表 ORDER BY 排序字段列表 LIMIT 分页参数
```

```bash
# 查询
SELECT 字段1, 字段2, ... FROM 表名;
SELECT * FROM 表名;
# 别名
SELECT 字段1 AS 别名1, 字段2 AS 别名2, ... FROM 表名;
SELECT 字段1 别名1, 字段2 别名2, ... FROM 表名;

# 去重
SELECT DISTINCT 字段1, 字段2, ... FROM 表名;

# 条件查询
# 条件
  # 等于 =
  # 大于 >
  # 大于等于 >=
  # 小于 <
  # 小于等于 <=
  # 不等于 <> !=
  # 范围： BETWEEN 最小值 AND 最大值
  # 列表： IN (值1, 值2, ...)
  # 模糊查询： LIKE
    # % 匹配任意字符
    # _ 匹配单个字符
  # 是NULL： IS NULL
  # 不是NULL： IS NOT NULL
  # AND 或 &&
  # OR 或 ||
  # NOT 或 !
SELECT * FROM 表名 WHERE 字段 IS NULL;
SELECT * FROM 表名 WHERE age >= 15 AND age <= 20;
SELECT * FROM 表名 WHERE age BETWEEN 15 AND 20;
SELECT * FROM 表名 WHERE age IN(15, 20, 25);
SELECT * FROM 表名 WHERE name LIKE '__'; # 查询name为两个字的员工
SELECT * FROM 表名 WHERE name LIKE '%王%'; # 查询name中包含王的员工
SELECT * FROM 表名 WHERE name LIKE '王%'; # 查询name中以王开头的员工
SELECT * FROM 表名 WHERE name LIKE '%王'; # 查询name中以王结尾的员工
SELECT * FROM 表名 WHERE name LIKE '王_'; # 查询name中以王开头，第二个字符任意的员工

# 聚合函数 (所有的NULL值都不参与计算)
COUNT() # 统计记录数
SUM() # 统计总和
AVG() # 统计平均值
MAX() # 统计最大值
MIN() # 统计最小值
SELECT 聚合函数(字段列表) FROM 表名;

SELECT COUNT(name) FROM 表名; # 统计不为NULL的数量
SELECT MAX(age) FROM 表名; # 统计age最大值
SELECT MIN(age) FROM 表名; # 统计age最小值
SELECT AVG(age) FROM 表名; # 统计age平均值
SELECT SUM(age) FROM 表名; # 统计age总和

# 分组
GROUP BY 字段名
HAVING 条件 # 分组后过滤条件
SELECT 字段列表 FROM 表名 [WHERE 条件] GROUP BY 分组字段名 [HAVING 分组后过滤条件];

SELECT gender, COUNT(*) from 表名 GROUP BY gender; # 根据性别分组，统计男性员工 和 女性员工的数量
SELECT gender, AVG(age) FROM 表名 GROUP BY gender; # 根据性别分组，统计男性员工和女性员工的平均年龄
SELECT workaddress, COUNT(*) FROM 表名 age > 20 GROUP BY workaddress; # 根据工作地址分组，统计每个工作地址的年龄大约20的员工数量
SELECT gender, AVG(age) FROM 表名 GROUP BY gender HAVING AVG(age) > 25; # 根据性别分组，统计平均年龄大于25的员工
SELECT gender, AVG(age) FROM 表名 GROUP BY gender HAVING AVG(age) > 25 ORDER BY AVG(age) DESC; # 根据性别分组，统计平均年龄大于25的员工，按平均年龄降序排序
SELECT gender, AVG(age) FROM 表名 GROUP BY gender HAVING AVG(age) > 25 ORDER BY AVG(age) DESC LIMIT 0, 1; # 根据性别分组，统计平均年龄大于25的员工，按平均年龄降序排序，取第一条数据


# 排序
ORDER BY 字段名 [ASC|DESC]
SELECT 字段列表 FROM 表名 ORDER BY 字段名 [ASC|DESC]; # 按字段名排序，默认升序
SELECT 字段列表 FROM 表名 ORDER BY 字段名1 [ASC|DESC], 字段名2 [ASC|DESC], ...; # 按多个字段排序

SELECT * from 表名 ORDER BY age DESC; # 年龄降序排序

# 分页
LIMIT 偏移量, 行数
SELECT 字段列表 FROM 表名 LIMIT 起始索引, 查询纪录;

SELECT * FROM 表名 ORDER BY 字段名 LIMIT 10; # 按字段名排序，取第1页数据，每页10条
SELECT * FROM 表名 ORDER BY 字段名 LIMIT 0, 10; # 按字段名排序，取第1页数据，每页10条
```


## DCL 用来控制数据库的用户、控制数据库访问、权限

```bash
# 查询用户
USE mysql;
SELECT * FROM user;

# 创建用户
CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码';

# 用户可以在任意主机访问该数据库
CREATE USER '用户名'@'%' IDENTIFIED BY '密码';

# 修改密码
ALTER USER '用户名'@'主机名' IDENTIFIED WITH mysql_native_password BY '新密码';

# 删除用户
DROP USER '用户名'@'主机名';

# 权限控制

# 权限列表
# 所有权限：ALL PRIVILEGES
# 数据库权限：CREATE, DROP, ALTER, INDEX, INSERT, UPDATE, DELETE, SELECT
# 表权限：CREATE, DROP, ALTER, INSERT, UPDATE, DELETE, SELECT
# 视图权限：CREATE, DROP, ALTER, INSERT, UPDATE, DELETE, SELECT
# 存储过程权限：CREATE, DROP, ALTER, EXECUTE
# 函数权限：CREATE, DROP, ALTER, EXECUTE

# 查看权限
SHOW GRANTS FOR '用户名'@'主机名';
# 授予权限
GRANT 权限列表 ON 数据库名.表名 TO '用户名'@'主机名';
# 撤销权限
REVOKE 权限列表 ON 数据库名.表名 FROM '用户名'@'主机名';
# 刷新权限
FLUSH PRIVILEGES;
```
