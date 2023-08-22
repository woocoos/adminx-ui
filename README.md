# adminx-ui
adminx前端项目

## 技术栈
- 一体化工具 [飞冰](https://v3.ice.work/)
- 基础UI框架 [antd 5.x](https://ant.design/index-cn)
- 模板组件 [ProComponents](https://procomponents.ant.design/)
- 多语言 [i18n](https://www.i18next.com/)
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

##  gqlgen与urql 



.env文件中， **GQLGEN_** 开头的配置

```shell
# 根据服务端位置生成 xxx.graphql 文件
pnpm gqlgen:schema-ast

# 一次性生成与urql配合的方法
pnpm gqlgen

# 开发时监听文件变化自动生成与urql配合的方法解析
pnpm gqlgen:watch
```


## IDE配置

本项目启用postcss,并且扩展名为`*.css`的文件,为了避免IDE报错.需要做如下配置:

- JetBrains IDE:
  - 安装插件`PostCSS` 
  - `Settings` -> `Languages & Frameworks` -> `Stylesheets` -> `Dialects` -> project css dialect -> `PostCSS`


## env 
```
/**
 * 应用appCode
 */
process.env.ICE_APP_CODE ?? 'resource'

/**
 * cookie的sign_cid
 */
process.env.ICE_SIGN_CID ?? `sign_cid=${ICE_APP_CODE}`

/**
 * 登陆地址
 */
process.env.ICE_LOGIN_URL ?? '/login'

/**
 * api前缀
 */
process.env.ICE_API_ADMINX_PREFIX ?? '/api-adminx'
process.env.ICE_API_AUTH_PREFIX ?? '/api-auth'
process.env.ICE_API_FILES_PREFIX ?? '/api-files'

/**
 * gql api完整地址
 */
process.env.ICE_API_ADMINX ?? `${ICE_API_ADMINX_PREFIX}/graphql/query`

/**
 * 微前端开发适合测试使用
 * 可配置值：http://localhost:xxx/
 */
process.env.ICE_DEV_PUBLIC_PATH ?? '/'

/**
 * 微前端打包时候使用配置与具体部署位置有关
 */
process.env.ICE_BUILD_PUBLIC_PATH ?? '/'


/**
 * 打包：production
 * 开发：development
 */
process.env.NODE_ENV

/**
 * token
 */
process.env.ICE_DEV_TOKEN ?? ''

/**
 * tenant_id
 */
process.env.ICE_DEV_TID ?? '' 

/**
 * ice proxy target
 */
process.env.ICE_PROXY_ADMINX ?? 'http://127.0.0.1:8080/'
process.env.ICE_PROXY_FILES ?? 'http://127.0.0.1:10071/'
process.env.ICE_PROXY_AUTH ?? 'http://127.0.0.1:10070/'

/**
 * adminx项目schema地址
 * gqlgen专用
 */
process.env.GQLGEN_SCHEMA_ADMINX ?? "http://127.0.0.1:8080/graphql/query"
```
