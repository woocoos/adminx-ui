import { gql } from '@/generated/adminx';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'
import { CreateOrgPolicyInput, OrderDirection, OrgPolicyOrder, OrgPolicyOrderField, OrgPolicyWhereInput, UpdateOrgPolicyInput } from '@/generated/adminx/graphql';
import { gid } from '@knockout-js/api';

const queryOrgPolicyList = gql(/* GraphQL */`query orgPolicyList($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){
  node(id:$gid){
    ... on Org{
      policies(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments
          }
        }
      }
    }
  }
}`);
const queryOrgPolicyListNum = gql(/* GraphQL */`query orgPolicyListNum($gid: GID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){
  node(id:$gid){
    ... on Org{
      policies(first:$first,orderBy: $orderBy,where: $where){ totalCount }
    }
  }
}`);

const queryOrgPolicyListAndIsGrantUser = gql(/* GraphQL */`query orgPolicyListAndIsGrantUser($gid: GID!,$userId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){
  node(id:$gid){
    ... on Org{
      policies(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments
            isGrantUser(userID: $userId)
          }
        }
      }
    }
  }
}`);

const queryOrgPolicyListAndIsGrantRole = gql(/* GraphQL */`query orgPolicyListAndIsGrantRole($gid: GID!,$roleId:ID!,$first: Int,$orderBy:OrgPolicyOrder,$where:OrgPolicyWhereInput){
  node(id:$gid){
    ... on Org{
      policies(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments
            isGrantRole(roleID: $roleId)
          }
        }
      }
    }
  }
}`);

const queryOrgPolicyInfo = gql(/* GraphQL */`query orgPolicyInfo($gid:GID!){
  node(id:$gid){
    ... on OrgPolicy{
      id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments,
      rules{ effect,actions,resources,conditions }
    }
  }
}`);

const mutationCreateOrgPolicy = gql(/* GraphQL */`mutation createOrgPolicy($input: CreateOrgPolicyInput!){
  createOrganizationPolicy(input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments
  }
}`);

const mutationUpdateOrgPolicy = gql(/* GraphQL */`mutation updateOrgPolicy($orgPolicyId:ID!,$input: UpdateOrgPolicyInput!){
  updateOrganizationPolicy(orgPolicyID:$orgPolicyId,input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,orgID,appPolicyID,name,comments
  }
}`);

const mutationDelOrgPolicy = gql(/* GraphQL */`mutation deleteOrgPolicy($orgPolicyId:ID!){
  deleteOrganizationPolicy(orgPolicyID:$orgPolicyId)
}`);

const mutationAssignOrgAppPolicy = gql(/* GraphQL */`mutation assignOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){
  assignOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)
}`);

const mutationRevOrgAppPolicy = gql(/* GraphQL */`mutation revokeOrgAppPolicy($orgId:ID!,$appPolicyId:ID!){
  revokeOrganizationAppPolicy(orgID: $orgId,appPolicyID: $appPolicyId)
}`);


/**
 * 组织策略
 * @param orgId
 * @returns
 */
export async function getOrgPolicyList(
  orgId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: OrgPolicyWhereInput;
    orderBy?: OrgPolicyOrder;
  },
  isGrant?: {
    roleId?: string;
    userId?: string;
  },
) {
  const result = isGrant?.roleId ? await paging(
    queryOrgPolicyListAndIsGrantRole, {
    gid: gid('org', orgId),
    roleId: isGrant.roleId,
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy ?? {
      direction: OrderDirection.Desc,
      field: OrgPolicyOrderField.CreatedAt
    },
  }, gather.current || 1) :
    isGrant?.userId ? await paging(
      queryOrgPolicyListAndIsGrantUser, {
      gid: gid('org', orgId),
      userId: isGrant.userId,
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy ?? {
        direction: OrderDirection.Desc,
        field: OrgPolicyOrderField.CreatedAt
      },
    }, gather.current || 1) : await paging(
      queryOrgPolicyList, {
      gid: gid('org', orgId),
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy ?? {
        direction: OrderDirection.Desc,
        field: OrgPolicyOrderField.CreatedAt
      },
    }, gather.current || 1);

  if (result.data?.node?.__typename === 'Org') {
    return result.data.node.policies;
  }
  return null;
}


/**
 * 组织策略
 * @param orgPolicyId
 * @returns
 */
export async function getOrgPolicyInfo(orgPolicyId: string) {
  const
    result = await query(
      queryOrgPolicyInfo, {
      gid: gid('org_policy', orgPolicyId),
    });

  if (result.data?.node?.__typename === 'OrgPolicy') {
    return result.data.node;
  }
  return null;
}


/**
 * 创建组织策略
 * @param input
 * @returns
 */
export async function createOrgPolicy(input: CreateOrgPolicyInput) {
  const
    result = await mutation(
      mutationCreateOrgPolicy, {
      input,
    });

  if (result.data?.createOrganizationPolicy?.id) {
    return result.data.createOrganizationPolicy;
  }
  return null;
}

/**
 * 更新组织策略
 * @param orgPolicyId
 * @param input
 * @returns
 */
export async function updateOrgPolicy(orgPolicyId: string, input: UpdateOrgPolicyInput) {
  const
    result = await mutation(
      mutationUpdateOrgPolicy, {
      orgPolicyId,
      input,
    });

  if (result.data?.updateOrganizationPolicy?.id) {
    return result.data.updateOrganizationPolicy;
  }
  return null;
}

/**
 * 更新组织策略
 * @param orgPolicyId
 * @returns
 */
export async function delOrgPolicy(orgPolicyId: string) {
  const
    result = await mutation(
      mutationDelOrgPolicy, {
      orgPolicyId,
    });

  if (result.data?.deleteOrganizationPolicy) {
    return result.data.deleteOrganizationPolicy;
  }
  return null;
}


/**
 * 组织分配应用策略
 * @param orgId
 * @param appPolicyId
 * @returns
 */
export async function assignOrgAppPolicy(orgId: string, appPolicyId: string) {
  const
    result = await mutation(
      mutationAssignOrgAppPolicy, {
      orgId,
      appPolicyId,
    });

  if (result.data?.assignOrganizationAppPolicy) {
    return result.data.assignOrganizationAppPolicy;
  }
  return null;
}

/**
 * 取消组织分配应用策略
 * @param orgId
 * @param appPolicyId
 * @returns
 */
export async function revokeOrgAppPolicy(orgId: string, appPolicyId: string) {
  const
    result = await mutation(
      mutationRevOrgAppPolicy, {
      orgId,
      appPolicyId,
    });

  if (result.data?.revokeOrganizationAppPolicy) {
    return result.data.revokeOrganizationAppPolicy;
  }
  return null;
}


/**
 * 组织策略数量
 * @param orgId
 * @param where
 * @returns
 */
export async function getOrgPolicyQty(orgId: string, where?: OrgPolicyWhereInput) {
  const
    result = await query(
      queryOrgPolicyListNum, {
      gid: gid('org', orgId),
      first: 9999,
      where,
    });

  if (result.data?.node?.__typename === 'Org') {
    return result.data.node.policies.totalCount;
  }
  return 0;
}
