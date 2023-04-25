import { gid } from "@/util"
import { List, TableFilter, TableParams, TableSort, getGraphqlFilter, graphqlApi, graphqlPageApi } from "../graphql"
import { App, AppNodeField } from "../app"


/**
 * 组织下的应用
 * @param orgId 
 * @param params 
 * @param filter 
 * @param sort
 * @returns 
 */
export async function getOrgAppList(orgId: string, params: TableParams, filter: TableFilter, sort: TableSort) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort),
        result = await graphqlPageApi(
            `#graphql
            query orgApp($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:AppOrder,$where:AppWhereInput){
                node(id:"${gid("org", orgId)}"){
                    ... on Org{
                        id
                        list:apps(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                            totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                            edges{                                        
                                cursor,node{                    
                                    ${AppNodeField}
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
        return result.data.node.list as List<App>
    } else {
        return null
    }
}


/**
 * 组织分配应用
 * @param orgId 
 * @param appId 
 * @returns 
 */
export async function assignOrgApp(orgId: string, appId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation assignOrganizationApp{
          action:assignOrganizationApp(orgID: "${orgId}",appID: "${appId}")
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}

/**
 * 取消组织分配应用
 * @param orgId 
 * @param appId
 * @returns 
 */
export async function revokeOrgApp(orgId: string, appId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation revokeOrganizationApp{
          action:revokeOrganizationApp(orgID: "${orgId}",appID: "${appId}")
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}
