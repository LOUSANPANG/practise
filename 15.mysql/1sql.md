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


## DML 
