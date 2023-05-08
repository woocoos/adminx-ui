import { gid } from "@/util"
import { App } from "."
import { List, TableFilter, TableParams, TableSort, getGraphqlFilter, graphqlApi, graphqlPageApi, setClearInputField } from "../graphql"

export type AppRes = {
    id: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    appID: string
    name: string
    typeName: string
    arnPattern: string
    app?: App
}

const AppResNodeField = `#graphql
    id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern
`


/**
 * 获取应用权限
 * @param appId 
 * @param params 
 * @param filter 
 * @param sort 
 * @returns 
 */
export async function getAppResList(appId: string, params: TableParams, filter: TableFilter, sort: TableSort) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort),
        result = await graphqlPageApi(
            `#graphql
            query apps($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:AppResOrder,$where:AppResWhereInput){
                node(id:"${gid('app', appId)}"){
                    ... on App{  
                        id,
                        list:resources(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                            totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                            edges{                                        
                                cursor,node{                    
                                    ${AppResNodeField}
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
        return result.data.node.list as List<AppRes>
    } else {
        return null
    }
}



/**
 * 获取应用权限
 * @param appResId 
 * @returns 
 */
export async function getAppResInfo(appResId: string) {
    const appGid = gid('app_res', appResId)
    const result = await graphqlApi(
        `#graphql
        query node{
          node(id:"${appGid}"){
            ... on AppRes{        
               ${AppResNodeField}
            }
          }
        }`)

    if (result?.data?.node) {
        return result.data.node as AppRes
    } else {
        return null
    }
}


/**
 * 更新
 * @param appResId 
 * @param input 
 * @returns 
 */
export async function updateAppRes(appResId: string, input: { name: string }) {
    //  input: AppRes | Record<string, any>
    const result = await graphqlApi(
        `#graphql
        mutation updateAppRes($input: UpdateAppResInput!){
          action:updateAppRes(appResID:"${appResId}",input:$input){
            ${AppResNodeField}
          }
        }`, { input: input })

    if (result?.data?.action?.id) {
        return result.data.action as AppRes
    } else {
        return null
    }
}