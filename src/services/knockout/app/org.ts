import { gid } from '@/util';
import { gql } from '@/__generated__/knockout';
import { OrgOrder, OrgWhereInput } from '@/__generated__/knockout/graphql';
import { koClient } from '../';

const queryAppOrgList = gql(/* GraphQL */`query appOrgList($gid: GID!,$first: Int,$orderBy:OrgOrder,$where:OrgWhereInput){
  node(id:$gid){
    ... on App{
      id,
      list:orgs(first:$first,orderBy: $orderBy,where: $where){
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
  list:appRoleAssignedToOrgs(roleID:$appRoleId,where:$where){
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone,
    owner { id,displayName }
  }
}`);

const queryAppPolicyAssignedToOrgList = gql(/* GraphQL */`query appPolicyAssignedToOrgList($appPolicyId:ID!,$where: OrgWhereInput){
  list:appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone,
    owner { id,displayName }
  }
}`);

const queryAppPolicyAssignedToOrgListAndIsGrant = gql(/* GraphQL */`query appPolicyAssignedToOrgListAndIsGrant($appPolicyId:ID!,$appPolicyIdToIsAllow:ID!,$where: OrgWhereInput){
  list:appPolicyAssignedToOrgs(policyID:$appPolicyId,where:$where){
    id,createdBy,createdAt,updatedBy,updatedAt,deletedAt,ownerID,parentID,kind,
    domain,code,name,profile,status,path,displaySort,countryCode,timezone,
    owner { id,displayName }
    isAllowRevokeAppPolicy(appPolicyID: $appPolicyIdToIsAllow)
  }
}`);

/**
 * 获取应用授权的组织列表
 * @param appId
 * @param params
 * @param filter
 * @param sort
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
  const koc = koClient(),
    result = await koc.client.query(
      queryAppOrgList, {
      gid: gid('app', appId),
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, {
      url: `${koc.url}?p=${gather.current || 1}`,
    }).toPromise();

  if (result.data?.node?.__typename === 'App') {
    return result.data.node.list;
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
  const koc = koClient(),
    result = await koc.client.query(
      queryAppRoleAssignedToOrgList, {
      appRoleId,
      where,
    }).toPromise();

  if (result.data?.list) {
    return result.data.list;
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
  const koc = koClient(),
    result = isGrant?.appPolicyId ? await koc.client.query(
      queryAppPolicyAssignedToOrgListAndIsGrant, {
      appPolicyId,
      appPolicyIdToIsAllow: isGrant.appPolicyId,
      where,
    }).toPromise() : await koc.client.query(
      queryAppPolicyAssignedToOrgList, {
      appPolicyId,
      where,
    }).toPromise();

  if (result.data?.list) {
    return result.data.list;
  }
  return null;
}
