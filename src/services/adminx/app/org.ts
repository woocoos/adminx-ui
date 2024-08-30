import { gql } from '@/generated/adminx';
import { OrgOrder, OrgWhereInput } from '@/generated/adminx/graphql';
import { gid } from '@knockout-js/api';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'

const queryAppOrgList = gql(/* GraphQL */`query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){
  node(id:$gid){
    ... on App{
      id,
      orgs(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
            domain,code,name,profile,status,path,displaySort,countryCode,timezone,
            owner { id,displayName }
          }
        }
      }
    }
  }
}`);

const queryAppRoleAssignedToOrgList = gql(/* GraphQL */`query appRoleAssignedToOrgList($appRoleId:ID!,$where: OrgWhereInput){
  appRoleAssignedToOrgs(roleID:$appRoleId,where:$where){
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone,
    owner { id,displayName }
  }
}`);

const queryAppPolicyAssignedToOrgList = gql(/* GraphQL */`query appPolicyAssignedToOrgList($appPolicyId:ID!,$where: OrgWhereInput){
  appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone,
    owner { id,displayName }
  }
}`);

const queryAppPolicyAssignedToOrgListAndIsGrant = gql(/* GraphQL */`query appPolicyAssignedToOrgListAndIsGrant($appPolicyId:ID!,$appPolicyIdToIsAllow:ID!,$where: OrgWhereInput){
  appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone,
    owner { id,displayName }
    isAllowRevokeAppPolicy(appPolicyID: $appPolicyIdToIsAllow)
  }
}`);

/**
 * 获取应用授权的组织列表
 * @param appId
 * @param gather
 * @returns
 */
export async function getAppOrgList(
  appId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: OrgWhereInput;
    orderBy?: OrgOrder;
  }) {
  const
    result = await paging(
      queryAppOrgList, {
      gid: gid('app', appId),
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, gather.current || 1);

  if (result.data?.node?.__typename === 'App') {
    return result.data.node.orgs;
  }
  return null;
}


/**
 * 应用角色授权的组织列表
 * @param appRoleId
 * @returns
 */
export async function getAppRoleAssignedOrgList(
  appRoleId: string,
  where?: OrgWhereInput,
) {
  const
    result = await query(
      queryAppRoleAssignedToOrgList, {
      appRoleId,
      where,
    });

  if (result.data?.appRoleAssignedToOrgs) {
    return result.data.appRoleAssignedToOrgs;
  }
  return null;
}

/**
 * 应用策略授权的组织列表
 * @param appPolicyId
 * @returns
 */
export async function getAppPolicyAssignedOrgList(
  appPolicyId: string,
  where?: OrgWhereInput,
  isGrant?: {
    appPolicyId?: string;
  },
) {
  const
    result = isGrant?.appPolicyId ? await query(
      queryAppPolicyAssignedToOrgListAndIsGrant, {
      appPolicyId,
      appPolicyIdToIsAllow: isGrant.appPolicyId,
      where,
    }) : await query(
      queryAppPolicyAssignedToOrgList, {
      appPolicyId,
      where,
    });

  if (result.data?.appPolicyAssignedToOrgs) {
    return result.data.appPolicyAssignedToOrgs;
  }
  return null;
}
