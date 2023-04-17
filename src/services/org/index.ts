import { gid } from "@/util";
import { List, TableFilter, TableParams, TableSort, TreeMoveAction, getGraphqlFilter, graphqlApi, graphqlPageApi, setClearInputField } from "../graphql";

export type OrgStatus = "active" | "inactive" | "processing"
export interface Org {
    id: string
    createdBy: number
    createdAt: Date
    updatedBy: number
    updatedAt: Date
    deletedAt: Date
    ownerID: string
    parentID: string
    domain: string
    code: string
    name: string
    profile: string
    status: OrgStatus
    path: string
    displaySort: number
    countryCode: string
    timezone: String
    parent?: Org
    children?: Org[]
}

export const EnumOrgStatus = {
    active: { text: "活跃", status: 'success' },
    inactive: { text: "失活", status: 'default' },
    processing: { text: "处理中", status: 'warning' }
}

const OrgNodeField = `#graphql
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone
    `

/**
 * 获取组织信息
 * @param params 
 * @param filter 
 * @param sort 
 * @returns 
 */
export async function getOrgList(params: TableParams, filter: TableFilter, sort: TableSort) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort),
        result = await graphqlPageApi(
            `#graphql
            query organizations($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:OrgOrder,$where:OrgWhereInput){
                list:organizations(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                    edges{                                        
                        cursor,node{                    
                            ${OrgNodeField}
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
        return result.data.list as List<Org>
    } else {
        return null
    }
}


/**
 * 获取组织信息
 * @param orgId
 * @returns 
 */
export async function getOrgInfo(orgId: string) {
    const appGid = gid('org', orgId)
    const result = await graphqlApi(
        `#graphql
        query {
          node(id:"${appGid}"){
            ... on Org{            
                ${OrgNodeField}
            }
          }
        }`)

    if (result?.data?.node) {
        return result?.data?.node as Org
    } else {
        return null
    }
}

/**
 * 更新组织信息
 * @param appId
 * @param input 
 * @returns 
 */
export async function updateOrgInfo(orgId: string, input: Org | Record<string, any>) {
    delete input['code'];
    const result = await graphqlApi(
        `#graphql
        mutation updateOrganization($input: UpdateOrgInput!){
          action:updateOrganization(orgID:"${orgId}",input:$input){
            ${OrgNodeField}
          }
        }`, { input: setClearInputField(input) })

    if (result?.data?.action) {
        return result?.data?.action as Org
    } else {
        return null
    }
}

/**
 * 创建组织信息
 * @param input 
 * @returns 
 */
export async function createOrgInfo(input: Org) {
    const result = await graphqlApi(
        `#graphql
        mutation createOrganization($input: CreateOrgInput!){
          action:createOrganization(input:$input){
            ${OrgNodeField}
          }
        }`, { input })

    if (result?.data?.action) {
        return result?.data?.action as Org
    } else {
        return null
    }
}

/**
 * 创建根组织信息
 * @param input 
 * @returns 
 */
export async function createRootOrgInfo(input: { domain: string, name: string }) {
    const result = await graphqlApi(
        `#graphql
        mutation enableDirectory($input: EnableDirectoryInput!){
          action:enableDirectory(input:$input){
            ${OrgNodeField}
          }
        }`, { input })

    if (result?.data?.action) {
        return result?.data?.action as Org
    } else {
        return null
    }
}

/**
 * 删除组织信息
 * @param appId 
 * @returns 
 */
export async function delOrgInfo(orgId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation deleteOrganization{
          action:deleteOrganization(orgID: "${orgId}")
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}


/**
 * 组织位置移动
 * @param input 
 * @returns 
 */
export async function moveOrg(sourceId: string, targetId: string, action: TreeMoveAction) {
    const result = await graphqlApi(
        `#graphql
        mutation moveOrganization{
          action:moveOrganization(sourceID:"${sourceId}",targetId:"${targetId}",action:${action})
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}

