import { gid } from "@/util"
import { Org } from "."
import { PolicyRule } from "../app/policy"
import { List, TableFilter, TableParams, TableSort, getGraphqlFilter, graphqlApi, graphqlPageApi, setClearInputField } from "../graphql"
import { Permission } from "../permission"

export type OrgPolicy = {
    id: string
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    orgID: string
    appPolicyID: string
    name: string
    comments: string
    rules?: PolicyRule[]
    org?: Org
    permissions?: Permission[]
}


const OrgPolicyNodeField = `#graphql
    id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments,
    rules{ effect,actions,resources,conditions }
`


/**
 * 组织策略
 * @param userId 
 * @param headers 
 * @returns 
 */
export async function getOrgPolicyList(orgId: string, params: TableParams, filter: TableFilter, sort: TableSort) {
    const { where, orderBy } = getGraphqlFilter(params, filter, sort),
        result = await graphqlPageApi(
            `#graphql
            query orgPolicy($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){
                node(id:"${gid("org", orgId)}"){
                    ... on Org{
                        list:policies(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                            totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                            edges{                                        
                                cursor,node{                    
                                    ${OrgPolicyNodeField}
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
        return result.data.node.list as List<OrgPolicy>
    } else {
        return null
    }
}


/**
 * 组织策略
 * @param orgPolicyId 
 * @returns 
 */
export async function getOrgPolicyInfo(orgPolicyId: string) {
    const result = await graphqlApi(
        `#graphql
      query{
        node(id:"${gid("org_policy", orgPolicyId)}"){
          ... on OrgPolicy{
            ${OrgPolicyNodeField}
          }
        }
      }`
    )

    if (result?.data?.node) {
        return result?.data?.node as OrgPolicy
    } else {
        return null
    }
}


/**
 * 创建组织策略
 * @param input 
 * @returns 
 */
export async function createOrgPolicy(input: OrgPolicy) {
    const result = await graphqlApi(
        `#graphql
        mutation createOrganizationPolicy($input: CreateOrgPolicyInput!){
          action:createOrganizationPolicy(input:$input){
            ${OrgPolicyNodeField}
          }
        }`, {
        input
    })

    if (result?.data?.action) {
        return result?.data?.action as OrgPolicy
    } else {
        return null
    }
}

/**
 * 更新组织策略
 * @param orgPolicyId 
 * @param input 
 * @returns 
 */
export async function updateOrgPolicy(orgPolicyId: string, input: OrgPolicy | Record<string, any>) {
    const result = await graphqlApi(
        `#graphql
        mutation updateOrganizationPolicy($input: UpdateOrgPolicyInput!){
          action:updateOrganizationPolicy(orgPolicyID:"${orgPolicyId}",input:$input){
            ${OrgPolicyNodeField}
          }
        }`, {
        input: setClearInputField(input)
    })

    if (result?.data?.action) {
        return result?.data?.action as OrgPolicy
    } else {
        return null
    }
}

/**
 * 更新组织策略
 * @param orgPolicyId 
 * @returns 
 */
export async function delOrgPolicy(orgPolicyId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation deleteOrganizationPolicy{
          action:deleteOrganizationPolicy(orgPolicyID:"${orgPolicyId}")
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}


/**
 * 组织分配应用策略
 * @param orgId 
 * @param appPolicyId 
 * @returns 
 */
export async function assignOrgAppPolicy(orgId: string, appPolicyId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation assignOrganizationAppPolicy{
          action:assignOrganizationAppPolicy(orgID: "${orgId}",appPolicyID: "${appPolicyId}")
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}

/**
 * 取消组织分配应用策略
 * @param orgId 
 * @param appPolicyId 
 * @returns 
 */
export async function revokeOrgAppPolicy(orgId: string, appPolicyId: string) {
    const result = await graphqlApi(
        `#graphql
        mutation revokeOrganizationAppPolicy{
          action:revokeOrganizationAppPolicy(orgID: "${orgId}",appPolicyID: "${appPolicyId}")
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}
