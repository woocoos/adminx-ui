import { gid } from "@/util";
import { List, TableParams, graphqlApi, PagingParams, getGraphqlFilter, TableSort, JsonFieldAny, setClearInputField } from "../graphql";

interface App {
    id: string
    name: string
    code: string
    kind: "web" | "native" | "server"
    redirectURI: string
    appKey: string
    appSecret: string
    scopes: string
    tokenValidity: number
    refreshTokenValidity: number
    logo: string
    comments: string
    status: "active" | "inactive" | "processing"
    createdAt: Date
    createdBy: string
    updatedAt: Date
    updatedBy: string
}

const AppNodeField = `#graphql
    id,name,code,kind,redirectURI,appKey,appSecret,
    scopes,tokenValidity,refreshTokenValidity,logo,comments,
    status,createdAt
`

/**
 * 获取用户信息
 * @param userId 
 * @param headers 
 * @returns 
 */
export async function getAppList(params?: TableParams, filter?: any, sort?: TableSort, paging?: PagingParams) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort)

    const result = await graphqlApi(
        `#graphql
        query apps($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:AppOrder,$where:AppWhereInput){
            list:apps(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                edges{                                        
                    cursor,node{                    
                        ${AppNodeField}
                    }
                }
            }
        }`,
        {
            after: paging?.after,
            first: paging?.first,
            before: paging?.before,
            last: paging?.last,
            where,
            orderBy,
        }
    )

    if (result?.data?.list) {
        return result?.data?.list as List<App>
    } else {
        return null
    }
}

/**
 * 获取应用信息
 * @param appId 
 * @returns 
 */
export async function getAppInfo(appId: string) {
    const appGid = gid('app', appId)
    const result = await graphqlApi(
        `#graphql
        query {
          node(id:"${appGid}"){
            ... on App{            
                ${AppNodeField}
            }
          }
        }`)

    if (result?.data?.node) {
        return result?.data?.node as App
    } else {
        return null
    }
}

/**
 * 更新应用信息
 * @param appId
 * @param input 
 * @returns 
 */
export async function updateAppInfo(appId: string, input: App | JsonFieldAny) {

    delete input['code'];
    const result = await graphqlApi(
        `#graphql
        mutation updateApp($input: UpdateAppInput!){
          action:updateApp(appID:"${appId}",input:$input){
            ${AppNodeField}
          }
        }`, { input: setClearInputField(input) })

    if (result?.data?.action) {
        return result?.data?.action as App
    } else {
        return null
    }
}

/**
 * 创建应用信息
 * @param input 
 * @returns 
 */
export async function createAppInfo(input: App | JsonFieldAny) {
    const result = await graphqlApi(
        `#graphql
        mutation createApp($input: CreateAppInput!){
          action:createApp(input:$input){
            ${AppNodeField}
          }
        }`, { input })

    if (result?.data?.action) {
        return result?.data?.action as App
    } else {
        return null
    }
}

/**
 * 删除应用信息
 * @param appId 
 * @returns 
 */
export async function delAppInfo(appId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation deleteApp{
          action:deleteApp(appID: "${appId}")
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}