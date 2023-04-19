import { gid } from "@/util"
import { App } from "."
import { List, TableFilter, TableParams, TableSort, getGraphqlFilter, graphqlApi, graphqlPageApi } from "../graphql"

export type AppPolicy = {
    id: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    appID: string
    name: string
    comments: string
    version: string
    autoGrant: boolean
    status: AppPolicyStatus
    rules?: PolicyRule[]
    app?: App
}

export type PolicyRule = {
    effect: PolicyRuleEffect
    actions: string[]
    resources: string[]
    conditions: string[]
}

export type PolicyRuleEffect = "allow" | "deny"

export type AppPolicyStatus = "active" | "inactive" | "processing"

export const EnumAppPolicyStatus = {
    active: { text: "活跃", status: 'success' },
    inactive: { text: "失活", status: 'default' },
    processing: { text: "处理中", status: 'warning' }
}

export const EnumPolicyRuleEffect = {
    allow: { text: "允许", status: 'success' },
    deny: { text: "拒绝", status: 'default' },
}

const AppPolicyField = `#graphql
    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,comments,
    version,autoGrant,status,rules{ effect,actions,resources,conditions }
`


/**
 * 获取应用权限
 * @param appId 
 * @param params 
 * @param filter 
 * @param sort 
 * @returns 
 */
export async function getAppPolicyList(appId: string, params: TableParams, filter: TableFilter, sort: TableSort) {
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
            query appPolicies{
                node(id:"${gid('app', appId)}"){
                    ... on App{  
                        id,
                        list:policies{
                            ${AppPolicyField}
                        }
                    }
                }
                
            }`
        )

    if (result?.data?.node?.list) {
        return result.data.node.list as AppPolicy[]
    } else {
        return null
    }
}



/**
 * 获取应用权限
 * @param appPolicyId 
 * @returns 
 */
export async function getAppPolicyInfo(appPolicyId: string) {
    const result = await graphqlApi(
        `#graphql
        query node{
          node(id:"${gid('app_policy', appPolicyId)}"){
            ... on AppPolicy{        
               ${AppPolicyField}
            }
          }
        }`)

    if (result?.data?.node) {
        return result.data.node as AppPolicy
    } else {
        return null
    }
}


/**
 * 创建
 * @param input 
 * @returns 
 */
export async function createAppPolicy(appId: string, input: AppPolicy | Record<string, any>) {
    const result = await graphqlApi(
        `#graphql
        mutation createAppPolicies($input: [CreateAppPolicyInput!]){
          action:createAppPolicies(appID:"${appId}",input:$input){
            ${AppPolicyField}
          }
        }`, { input: [input] })

    if (result?.data?.action?.[0]?.id) {
        return result.data.action[0] as AppPolicy
    } else {
        return null
    }
}

/**
 * 创建
 * @param input 
 * @returns 
 */
export async function createAppPolicies(appId: string, input: Array<AppPolicy | Record<string, any>>) {
    const result = await graphqlApi(
        `#graphql
        mutation createAppPolicies($input: [CreateAppPolicyInput!]){
          action:createAppPolicies(appID:"${appId}",input:$input){
            ${AppPolicyField}
          }
        }`, { input: input })

    if (result?.data?.action?.length) {
        return result.data.action as AppPolicy[]
    } else {
        return null
    }
}


/**
 * 更新
 * @param appPolicyId 
 * @param input 
 * @returns 
 */
export async function updateAppPolicy(appPolicyId: string, input: AppPolicy | Record<string, any>) {
    const result = await graphqlApi(
        `#graphql
        mutation updateAppPolicy($input: UpdateAppPolicyInput!){
          action:updateAppPolicy(policyID:"${appPolicyId}",input:$input){
            ${AppPolicyField}
          }
        }`, { input: input })

    if (result?.data?.action?.id) {
        return result.data.action as AppPolicy
    } else {
        return null
    }
}

/**
 * 删除
 * @param appPolicyId 
 * @returns 
 */
export async function delAppPolicy(appPolicyId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation deleteAppPolicy{
          action:deleteAppPolicy(policyID: "${appPolicyId}")
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}