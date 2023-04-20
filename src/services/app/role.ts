import { gid } from "@/util"
import { App } from "."
import { List, TableFilter, TableParams, TableSort, getGraphqlFilter, graphqlApi, graphqlPageApi, setClearInputField } from "../graphql"
import { AppPolicy, AppPolicyField } from "./policy"

export type AppRole = {
    id: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    appID: string
    name: string
    comments: string
    autoGrant: boolean
    editable: boolean
    app?: App
    policies?: AppPolicy[]
}



const AppRoleField = `#graphql
    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,
    autoGrant,editable
`


/**
 * 获取应用角色
 * @param appId 
 * @param params 
 * @param filter 
 * @param sort 
 * @returns 
 */
export async function getAppRoleList(appId: string, params: TableParams, filter: TableFilter, sort: TableSort) {
    // const { where, orderBy } = getGraphqlFilter(params, filter, sort),
    //     result = await graphqlPageApi(
    //         `#graphql
    //         query apps($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:AppActionOrder,$where:AppActionWhereInput){
    //             node(id:"${gid('app', appId)}"){
    //                 ... on App{  
    //                     id,
    //                     list:policies(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
    //                         totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    //                         edges{                                        
    //                             cursor,node{                    
    //                                 ${AppPolicyField}
    //                             }
    //                         }
    //                     }
    //                 }
    //             }

    //         }`,
    //         {
    //             first: params.pageSize,
    //             where,
    //             orderBy,
    //         },
    //         params.current
    //     )

    // if (result?.data?.node?.list) {
    //     return result.data.node.list as List<AppPolicy>
    // } else {
    //     return null
    // }
    const { where, orderBy } = getGraphqlFilter(params, filter, sort),
        result = await graphqlApi(
            `#graphql
            query appRoles{
                node(id:"${gid('app', appId)}"){
                    ... on App{  
                        id,
                        list:roles{
                            ${AppRoleField}
                        }
                    }
                }
                
            }`
        )

    if (result?.data?.node?.list) {
        return result.data.node.list as AppRole[]
    } else {
        return null
    }
}


type AppRoleSecen = "policies"

/**
 * 获取应用角色
 * @param appRoleId 
 * @returns 
 */
export async function getAppRoleInfo(appRoleId: string, scene?: AppRoleSecen[]) {
    const result = await graphqlApi(
        `#graphql
        query node{
          node(id:"${gid('app_role', appRoleId)}"){
            ... on AppRole{        
               ${AppRoleField}
               ${scene?.includes('policies') ? `policies{
                    ${AppPolicyField}
                }`: ''}
            }
          }
        }`)

    if (result?.data?.node) {
        return result.data.node as AppRole
    } else {
        return null
    }
}


/**
 * 创建
 * @param input 
 * @returns 
 */
export async function createAppRole(appId: string, input: AppRole | Record<string, any>) {
    input.appID = appId
    const result = await graphqlApi(
        `#graphql
        mutation createAppRole($input: CreateAppRoleInput!){
          action:createAppRole(appID:"${appId}",input:$input){
            ${AppRoleField}
          }
        }`, { input: input })

    if (result?.data?.action?.id) {
        return result.data.action as AppRole
    } else {
        return null
    }
}

/**
 * 更新
 * @param appRoleId 
 * @param input 
 * @returns 
 */
export async function updateAppRole(appRoleId: string, input: AppRole | Record<string, any>) {
    const result = await graphqlApi(
        `#graphql
        mutation updateAppRole($input: UpdateAppRoleInput!){
          action:updateAppRole(roleID:"${appRoleId}",input:$input){
            ${AppRoleField}
          }
        }`, { input: setClearInputField(input) })

    if (result?.data?.action?.id) {
        return result.data.action as AppRole
    } else {
        return null
    }
}

/**
 * 删除
 * @param appRoleId 
 * @returns 
 */
export async function delAppRole(appRoleId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation deleteAppRole{
          action:deleteAppRole(roleID: "${appRoleId}")
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}