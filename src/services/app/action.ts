import { gid } from "@/util"
import { App } from "."
import { List, TableFilter, TableParams, TableSort, getGraphqlFilter, graphqlApi, graphqlPageApi, setClearInputField } from "../graphql"

export type AppAction = {
    id: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    appID: string
    name: string
    kind: AppActionKind
    method: AppActionMethod
    comments: string
    app: App
}

export type AppActionKind = "restful" | "graphql" | "rpc"

export type AppActionMethod = "read" | "write" | "list"

export const EnumAppActionKind = {
    restful: { text: 'restful' },
    graphql: { text: 'graphql' },
    rpc: { text: 'rpc' },
}

export const EnumAppActionMethod = {
    read: { text: '读操作' },
    write: { text: '写操作' },
    list: { text: '列表操作' },
}

const AppActionField = `#graphql
    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments
`


/**
 * 获取应用权限
 * @param appId 
 * @param params 
 * @param filter 
 * @param sort 
 * @returns 
 */
export async function getAppActionList(appId: string, params: TableParams, filter: TableFilter, sort: TableSort) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort),
        result = await graphqlPageApi(
            `#graphql
            query apps($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:AppActionOrder,$where:AppActionWhereInput){
                node(id:"${gid('app', appId)}"){
                    ... on App{  
                        id,
                        list:actions(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                            totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                            edges{                                        
                                cursor,node{                    
                                    ${AppActionField}
                                }
                            }
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

    if (result?.data?.node?.list) {
        return result.data.node.list as List<AppAction>
    } else {
        return null
    }
}



/**
 * 获取应用权限
 * @param appActionId 
 * @returns 
 */
export async function getAppActionInfo(appActionId: string) {
    const appGid = gid('app_action', appActionId)
    const result = await graphqlApi(
        `#graphql
        query node{
          node(id:"${appGid}"){
            ... on AppAction{        
               ${AppActionField}
            }
          }
        }`)

    if (result?.data?.node) {
        return result.data.node as AppAction
    } else {
        return null
    }
}


/**
 * 创建
 * @param input 
 * @returns 
 */
export async function createAppAction(appId: string, input: AppAction | Record<string, any>) {
    const result = await graphqlApi(
        `#graphql
        mutation createAppActions($input: [CreateAppActionInput!]){
          action:createAppActions(appID:"${appId}",input:$input){
            ${AppActionField}
          }
        }`, { input: [input] })

    if (result?.data?.action?.[0]?.id) {
        return result.data.action[0] as AppAction
    } else {
        return null
    }
}

/**
 * 创建
 * @param input 
 * @returns 
 */
export async function createAppActions(appId: string, input: Array<AppAction | Record<string, any>>) {
    const result = await graphqlApi(
        `#graphql
        mutation createAppActions($input: [CreateAppActionInput!]){
          action:createAppActions(appID:"${appId}",input:$input){
            ${AppActionField}
          }
        }`, { input: input })

    if (result?.data?.action?.length) {
        return result.data.action as AppAction[]
    } else {
        return null
    }
}

/**
 * 更新
 * @param appActionId 
 * @param input 
 * @returns 
 */
export async function updateAppAction(appActionId: string, input: AppAction | Record<string, any>) {
    const result = await graphqlApi(
        `#graphql
        mutation updateAppAction($input: UpdateAppActionInput!){
          action:updateAppAction(actionID:"${appActionId}",input:$input){
            ${AppActionField}
          }
        }`, { input: setClearInputField(input) })

    if (result?.data?.action?.id) {
        return result.data.action as AppAction
    } else {
        return null
    }
}

/**
 * 删除
 * @param appActionId 
 * @returns 
 */
export async function delAppAction(appActionId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation deleteAppAction{
          action:deleteAppAction(actionID: "${appActionId}")
        }`
    )

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}