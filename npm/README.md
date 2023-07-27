### 开发流程

#### pnpm init
#### tsc --init
#### 本地安装rollup
#### 安装rollup ts插件 @rollup/plugin-typescript
#### 创建入口
    - index.ts
#### 创建rollup config文件
    - 配置入口、出口
    - 配置ts插件
#### 配置package json
    - 打包命令
    - type
    - main 字段信息
#### 创建example测试文件
    - 使用cli项目
    - 引用本地包 pnpm i ../lgh-alias -D
    - 在配置文件中引入插件测试