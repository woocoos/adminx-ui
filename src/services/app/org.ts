import { gid } from "@/util"
import { List, TableFilter, TableParams, TableSort, getGraphqlFilter, graphqlApi, graphqlPageApi } from "../graphql"
import { Org, OrgNodeField } from "../org"




/**
 * 获取应用授权的组织列表
 * @param appId 
 * @param params 
 * @param filter 
 * @param sort 
 * @returns 
 */
export async function getAppOrgList(appId: string, params: TableParams, filter: TableFilter, sort: TableSort) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort),
        result = await graphqlPageApi(
            `#graphql
            query appOrgss($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:OrgOrder,$where:OrgWhereInput){
                node(id:"${gid('app', appId)}"){
                    ... on App{  
                        id,
                        list:orgs(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                            totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                            edges{                                        
                                cursor,node{                    
                                    ${OrgNodeField}
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
        return result.data.node.list as List<Org>
    } else {
        return null
    }
}



/**
 * 应用角色授权的组织列表
 * @param appRoleId
 * @returns 
 */
export async function getAppRoleAssignedOrgList(appRoleId: string) {
    const result = await graphqlApi(
        `#graphql
        query {
            list:appRoleAssignedToOrgs(roleID:"${appRoleId}"){
                ${OrgNodeField}
            }
        }`)

    if (result?.data?.list) {
        return result?.data?.list as Org[]
    } else {
        return null
    }
}

/**
 * 应用策略授权的组织列表
 * @param appPolicyId
 * @returns 
 */
export async function getAppPolicyAssignedOrgList(appPolicyId: string) {
    const result = await graphqlApi(
        `#graphql
        query {
            list:appPolicyAssignedToOrgs(policyID:"${appPolicyId}"){
                ${OrgNodeField}
            }
        }`)

    if (result?.data?.list) {
        return result?.data?.list as Org[]
    } else {
        return null
    }
}