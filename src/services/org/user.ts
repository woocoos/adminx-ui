import { gid } from "@/util"
import { List, TableFilter, TableParams, TableSort, getGraphqlFilter, graphqlApi, graphqlPageApi } from "../graphql"
import { User, UserNodeField } from "../user"

/**
 * 组织下的用户信息
 * @param orgId 
 * @param userId 
 * @param headers 
 * @returns 
 */
export async function getOrgUserList(orgId: string, params: TableParams, filter: TableFilter, sort: TableSort) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort),
        result = await graphqlPageApi(
            `#graphql
            query users($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:UserOrder,$where:UserWhereInput){
                node(id:"${gid('org', orgId)}"){
                  ... on Org{
                    id,
                    list:users(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                        edges{                                        
                            cursor,node{                    
                                ${UserNodeField}
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
        return result.data.node.list as List<User>
    } else {
        return null
    }
}

/**
 * 组织下的角色用户
 * @param orgId 
 * @param userId 
 * @param headers 
 * @returns 
 */
export async function getOrgRoleUserList(roleId: string, params: TableParams, filter: TableFilter, sort: TableSort) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort),
        result = await graphqlPageApi(
            `#graphql
            query orgRoleUsers($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:UserOrder,$where:UserWhereInput){
                list:orgRoleUsers(roleID:"${roleId}"after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                    edges{                                        
                        cursor,node{                    
                            ${UserNodeField}
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
        return result.data.list as List<User>
    } else {
        return null
    }
}

/**
 * 分配用户给组织
 * @param input 
 * @returns 
 */
export async function allotOrgUser(input: {
    joinedAt: string
    displayName: string
    orgID: string
    userID: string
}) {
    const result = await graphqlApi(
        `#graphql
        mutation allotOrganizationUser($input:CreateOrgUserInput!){
          action:allotOrganizationUser(input:$input)
        }`,
        {
            input,
        })

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}

/**
 * 用户移除组织
 * @param orgId 
 * @param userId 
 * @returns 
 */
export async function removeOrgUser(orgId: string, userId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation removeOrganizationUser{
          action:removeOrganizationUser(orgID: "${orgId}",userID: "${userId}")
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}
