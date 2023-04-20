import { gid } from "@/util"
import { graphqlApi, setClearInputField } from "../graphql"

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

export type OrgRoleKind = "group" | "role"

const OrgRoleNodeField = `#graphql
    id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments
`

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

