import { gid } from "@/util";
import { TableParams, graphqlApi, getGraphqlFilter, TableSort, JsonFieldAny, setClearInputField, TablePage, getGraphqlPaging, getGraphqlList, List, TreeMoveAction } from "../graphql";

export interface App {
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
    menus?: List<AppMenu>
}

export interface AppAction {
    id: string
    createdBy: number
    createdAt: Date
    updatedBy: number
    updatedAt: Date
    appID: string
    name: string
    kind: "restful" | "graphql" | "rpc"
    method: "read" | "write" | "list"
    comments: string
    app?: App
    menus?: AppMenu[]
    resources?: null
}
export interface AppMenu {
    id: string
    createdBy: number
    createdAt: Date
    updatedBy: number
    updatedAt: Date
    appID: string
    parentID: string
    kind: "dir" | "menu"
    name: string
    actionID: string
    comments: string
    displaySort: number
    app?: App
    action?: AppAction
}

const AppNodeField = `#graphql
    id,name,code,kind,redirectURI,appKey,appSecret,
    scopes,tokenValidity,refreshTokenValidity,logo,comments,
    status,createdAt
`, AppMenuField = `#graphql
    id,appID,parentID,kind,name,actionID,comments,displaySort
`

/**
 * 获取用户信息
 * @param userId 
 * @param headers 
 * @returns 
 */
export async function getAppList(params?: TableParams, filter?: any, sort?: TableSort, page?: TablePage) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort),
        paging = getGraphqlPaging({
            current: params?.current,
            pageSize: params?.pageSize,
        }, page)

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
        return getGraphqlList<App>(result.data.list, paging)
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


/**
 * 获取应用菜单
 * @param appId 
 * @returns 
 */
export async function getAppMenus(appId: string) {
    const appGid = gid('app', appId)
    const result = await graphqlApi(
        `#graphql
        query menus($orderBy: AppMenuOrder){
          node(id:"${appGid}"){
            ... on App{        
                ${AppNodeField}    
                menus(orderBy:$orderBy){
                    edges{                                        
                        cursor,node{                    
                            ${AppMenuField}
                        }
                    }
                }
            }
          }
        }`, {
        orderBy: {
            direction: 'ASC',
            field: "displaySort"
        }
    })

    if (result?.data?.node) {
        return result.data.node as App
    } else {
        return null
    }
}


/**
 * 更新应用菜单
 * @param appId
 * @param input 
 * @returns 
 */
export async function updateAppMenu(menuId: string, input: App | JsonFieldAny) {
    const result = await graphqlApi(
        `#graphql
        mutation updateAppMenu($input: UpdateAppMenuInput!){
          action:updateAppMenu(menuID:"${menuId}",input:$input){
            ${AppMenuField}
          }
        }`, { input: setClearInputField(input) })

    if (result?.data?.action) {
        return result?.data?.action as App
    } else {
        return null
    }
}

/**
 * 创建应用菜单
 * @param input 
 * @returns 
 */
export async function createAppMenu(appId: string, input: AppMenu | JsonFieldAny) {
    const result = await graphqlApi(
        `#graphql
        mutation createAppMenus($input: [CreateAppMenuInput!]){
          action:createAppMenus(appID:"${appId}",input:$input){
            ${AppMenuField}
          }
        }`, { input: [input] })

    if (result?.data?.action?.[0]?.id) {
        return result.data.action[0] as AppMenu
    } else {
        return null
    }
}

/**
 * 删除应用菜单
 * @param appId 
 * @returns 
 */
export async function delAppMenu(menuId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation deleteAppMenu{
          action:deleteAppMenu(menuID: "${menuId}")
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}


/**
 * 创建应用菜单
 * @param input 
 * @returns 
 */
export async function moveAppMenu(sourceId: string, targetId: string, action: TreeMoveAction) {
    const result = await graphqlApi(
        `#graphql
        mutation moveAppMenu{
          action:moveAppMenu(sourceID:"${sourceId}",targetID:"${targetId}",action:${action})
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}