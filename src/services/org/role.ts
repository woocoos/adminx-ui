import { gid } from "@/util"
import { List, TableFilter, TableParams, TableSort, getGraphqlFilter, graphqlApi, graphqlPageApi, setClearInputField } from "../graphql"

export type OrgRole = {
    id: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    orgID: string
    kind: OrgRoleKind
    name: string
    comments: string
}

/**
 * group:组
 * role:角色
 */
export type OrgRoleKind = "group" | "role"

export const OrgRoleNodeField = `#graphql
    id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments
`

/**
 * 获取组织用户组
 * @param params 
 * @param filter 
 * @param sort 
 * @returns 
 */
export async function getOrgGroupList(params: TableParams, filter: TableFilter, sort: TableSort) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort),
        result = await graphqlPageApi(
            `#graphql
            query orgGroups($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){
                list:orgGroups(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                    edges{                                        
                        cursor,node{                    
                            ${OrgRoleNodeField}
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
        return result.data.list as List<OrgRole>
    } else {
        return null
    }
}

/**
 * 获取组织用户组
 * @param params 
 * @param filter 
 * @param sort 
 * @returns 
 */
export async function getOrgRoleList(params: TableParams, filter: TableFilter, sort: TableSort) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort),
        result = await graphqlPageApi(
            `#graphql
            query orgRoles($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){
                list:orgRoles(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                    edges{                                        
                        cursor,node{                    
                            ${OrgRoleNodeField}
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
        return result.data.list as List<OrgRole>
    } else {
        return null
    }
}


/**
 * 获取用户信息
 * @param orgRoleId 
 * @returns 
 */
export async function getOrgRoleInfo(orgRoleId: string) {
    const result = await graphqlApi(
        `#graphql
      query{
        node(id:"${gid("org_role", orgRoleId)}"){
          ... on OrgRole{
            ${OrgRoleNodeField}
          }
        }
      }`
    )

    if (result?.data?.node) {
        return result?.data?.node as OrgRole
    } else {
        return null
    }
}

/**
 * 创建组织角色
 * @param input 
 * @returns 
 */
export async function createOrgRole(input: OrgRole | Record<string, any>) {
    const result = await graphqlApi(
        `#graphql
        mutation createRole($input: CreateOrgRoleInput!){
          action:createRole(input:$input){
            ${OrgRoleNodeField}
          }
        }`,
        { input }
    )

    if (result?.data?.action) {
        return result?.data?.action as OrgRole
    } else {
        return null
    }
}

/**
 * 更新组织角色
 * @param orgRoleId 
 * @param input 
 * @returns 
 */
export async function updateOrgRole(orgRoleId: string, input: OrgRole | Record<string, any>) {
    const result = await graphqlApi(
        `#graphql
        mutation updateRole($input: UpdateOrgRoleInput!){
          action:updateRole(roleID:"${orgRoleId}",input:$input){
            ${OrgRoleNodeField}
          }
        }`,
        { input: setClearInputField(input) }
    )

    if (result?.data?.action) {
        return result?.data?.action as OrgRole
    } else {
        return null
    }
}


/**
 * 删除组织角色
 * @param orgRoleId 
 * @returns 
 */
export async function delOrgRole(orgRoleId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation deleteRole{
          action:deleteRole(roleID:"${orgRoleId}")
        }`
    )

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}



/**
 * 分配用户到组织角色
 * @param input 
 * @returns 
 */
export async function assignOrgRoleUser(input: {
    orgRoleID: string
    userID: string
    startAt?: string
    endAt?: string
}) {
    const result = await graphqlApi(
        `#graphql
        mutation assignRoleUser($input: AssignRoleUserInput!){
          action:assignRoleUser(input:$input)
        }`,
        {
            input
        }
    )

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}


/**
 * 分配用户到组织角色
 * @param orgRoleId 
 * @returns 
 */
export async function revokeOrgRoleUser(orgRoleId: string, userId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation {
          action:revokeRoleUser(roleID:"${orgRoleId}",userID:"${userId}")
        }`
    )

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}

