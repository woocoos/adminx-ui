import { gid } from "@/util";
import { TableParams, graphqlApi, getGraphqlFilter, TableSort, setClearInputField, List, TreeMoveAction, graphqlPageApi, TableFilter } from "../graphql";

export type AppKind = "web" | "native" | "server"
export type AppStatus = "active" | "inactive" | "processing"

export interface App {
    id: string
    name: string
    code: string
    kind: AppKind
    redirectURI: string
    appKey: string
    appSecret: string
    scopes: string
    tokenValidity: number
    refreshTokenValidity: number
    logo: string
    comments: string
    status: AppStatus
    createdAt: Date
    createdBy: string
    updatedAt: Date
    updatedBy: string
    menus?: List<AppMenu>
}

export type AppActionKind = "restful" | "graphql" | "rpc"
export type AppActionMethod = "read" | "write" | "list"

export interface AppAction {
    id: string
    createdBy: number
    createdAt: Date
    updatedBy: number
    updatedAt: Date
    appID: string
    name: string
    kind: AppActionKind
    method: AppActionMethod
    comments: string
    app?: App
    menus?: AppMenu[]
    resources?: null
}

export type AppMenuKind = "dir" | "menu"
export interface AppMenu {
    id: string
    createdBy: number
    createdAt: Date
    updatedBy: number
    updatedAt: Date
    appID: string
    parentID: string
    kind: AppMenuKind
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
 * 获取应用信息
 * @param params 
 * @param filter 
 * @param sort 
 * @returns 
 */
export async function getAppList(params: TableParams, filter: TableFilter, sort: TableSort) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort),
        result = await graphqlPageApi(
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
                first: params.pageSize,
                where,
                orderBy,
            },
            params.current
        )

    if (result?.data?.list) {
        return result.data.list as List<App>
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
export async function updateAppInfo(appId: string, input: App | Record<string, any>) {
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
export async function createAppInfo(input: App) {
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
export async function updateAppMenu(menuId: string, input: App | Record<string, any>) {
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
export async function createAppMenu(appId: string, input: AppMenu | Record<string, any>) {
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