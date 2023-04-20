import { gid } from "@/util"
import { graphqlApi, setClearInputField } from "../graphql"
import { Org } from "../org"
import { User } from "../user"

export type Permission = {
    id: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    orgID: string
    principalKind: PermissionPrincipalKind
    userID: string
    roleID: string
    orgPolicyID: string
    startAt: string
    endAt: string
    status: PermissionStatus
    org?: Org
    user?: User
    orgPolicy?: any
}

export type PermissionPrincipalKind = "user" | "role"

export type PermissionStatus = "active" | "inactive" | "processing"


export const EnumPermissionPrincipalKind = {
    user: { text: "用户", },
    role: { text: "角色", },
}

export const EnumPermissionStatus = {
    active: { text: "活跃", status: 'success' },
    inactive: { text: "失活", status: 'default' },
    processing: { text: "处理中", status: 'warning' }
}


export const PermissionNodeField = `#graphql
    id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,userID,roleID,orgPolicyID,startAt,endAt,status
`



/**
 * 获取权限情况
 * @param permissionId 
 * @returns 
 */
export async function getPermissionInfo(permissionId: string) {
    const result = await graphqlApi(
        `#graphql
      query{
        node(id:"${gid("permission", permissionId)}"){
          ... on Permission{
            ${PermissionNodeField}
          }
        }
      }`
    )

    if (result?.data?.node) {
        return result?.data?.node as Permission
    } else {
        return null
    }
}

/**
 * 授权
 * @param input 
 * @returns 
 */
export async function createPermission(input: Permission | Record<string, any>) {
    const result = await graphqlApi(
        `#graphql
        mutation createPermission($input: CreatePermissionInput!){
          action:grant(input:$input){
            ${PermissionNodeField}
          }
        }`,
        { input }
    )

    if (result?.data?.action) {
        return result?.data?.action as Permission
    } else {
        return null
    }
}

/**
 * 更新授权
 * @param permissionId 
 * @param input 
 * @returns 
 */
export async function updatePermission(permissionId: string, input: Permission | Record<string, any>) {
    const result = await graphqlApi(
        `#graphql
        mutation updatePermission($input: CreatePermissionInput!){
          action:updatePermission(permissionID:"${permissionId}",input:$input){
            ${PermissionNodeField}
          }
        }`,
        { input: setClearInputField(input) }
    )

    if (result?.data?.action) {
        return result?.data?.action as Permission
    } else {
        return null
    }
}


/**
 * 取消授权
 * @param permissionId 
 * @param input 
 * @returns 
 */
export async function delPermssion(permissionId: string, orgId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation revoke{
          action:revoke(permissionID:"${permissionId}",orgID:"${orgId}")
        }`
    )

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}

