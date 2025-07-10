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


### DDL 数据库操作

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

### DDL 表操作

```bash

```
