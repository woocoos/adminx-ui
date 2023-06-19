# adminx-ui
adminx前端项目

## 技术栈
- 一体化工具 [飞冰](https://v3.ice.work/)
- 基础UI框架 [antd 5.x](https://ant.design/index-cn)
- 模板组件 [ProComponents](https://procomponents.ant.design/)
- 多语言 [i18n](https://www.i18next.com/)
- 本地存储 [localforage](https://localforage.docschina.org/)
- keep-alive [react-activation](https://github.com/CJY0208/react-activation/blob/HEAD/README_CN.md)
- gql生成工具 [GraphQL Code Generator](https://the-guild.dev/graphql/codegen/docs)
- urql [urql](https://formidable.com/open-source/urql/)

## 快速开始
```shell
# 启动开发环境,默认使用mock
pnpm dev
# 启动,使用proxy
pnpm start
```

## IDE配置

本项目启用postcss,并且扩展名为`*.css`的文件,为了避免IDE报错.需要做如下配置:

- JetBrains IDE:
  - 安装插件`PostCSS` 
  - `Settings` -> `Languages & Frameworks` -> `Stylesheets` -> `Dialects` -> project css dialect -> `PostCSS`
