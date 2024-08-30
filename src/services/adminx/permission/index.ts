import { gql } from '@/generated/adminx';
import { CreatePermissionInput, PermissionOrder, PermissionWhereInput, UpdatePermissionInput } from '@/generated/adminx/graphql';
import { gid } from '@knockout-js/api';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'

export const EnumPermissionPrincipalKind = {
  user: { text: '用户' },
  role: { text: '角色' },
};

export const EnumPermissionStatus = {
  active: { text: 'active', status: 'success' },
  inactive: { text: 'inactive', status: 'default' },
  disabled: { text: 'disabled', status: 'default' },
  processing: { text: 'processing', status: 'warning' },
};


const queryOrgPolicyReferences = gql(/* GraphQL */`query orgPolicyReferences($orgPolicyId:ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){
  orgPolicyReferences(policyID:$orgPolicyId,first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,
        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,
        role{ id,orgID,kind,name,isAppRole }
        orgPolicy{ id,orgID,appPolicyID,name }
        user{ id,displayName }
      }
    }
  }
}`);

const queryOrgPrmissionList = gql(/* GraphQL */`query orgPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){
  node(id:$gid){
    ... on Org{
      permissions(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,
            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,
            role{ id,orgID,kind,name,isAppRole }
            orgPolicy{ id,orgID,appPolicyID,name }
            user{ id,displayName }
          }
        }
      }
    }
  }
}`);

const queryUserPrmissionList = gql(/* GraphQL */`query userPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){
  node(id:$gid){
    ... on User{
      permissions(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,
            userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,
            role{ id,orgID,kind,name,isAppRole }
            orgPolicy{ id,orgID,appPolicyID,name }
            user{ id,displayName }
          }
        }
      }
    }
  }
}`);

const queryUserExtendGroupPolicieList = gql(/* GraphQL */`query userExtendGroupPolicieList($userId: ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){
  userExtendGroupPolicies(userID:$userId,first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,
        userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,
        role{ id,orgID,kind,name,isAppRole }
        orgPolicy{ id,orgID,appPolicyID,name }
        user{ id,displayName }
      }
    }
  }
}`);

const queryPermissionInfo = gql(/* GraphQL */`query permissionInfo($gid:GID!){
  node(id:$gid){
    ... on Permission{
      id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,
      userID,roleID,orgPolicyID,startAt,endAt,status,isAllowRevoke,
      role{ id,orgID,kind,name,isAppRole }
      orgPolicy{ id,orgID,appPolicyID,name }
      user{ id,displayName }
    }
  }
}`);

const mutationCreatePermission = gql(/* GraphQL */`mutation createPermission($input: CreatePermissionInput!){
  grant(input:$input){id}
}`);

const mutationUpdatePermission = gql(/* GraphQL */`mutation updatePermission($permissionId:ID!,$input: UpdatePermissionInput!){
  updatePermission(permissionID:$permissionId,input:$input){id}
}`);

const mutationDelPermission = gql(/* GraphQL */`mutation revoke($permissionId:ID!,$orgId:ID!){
  revoke(permissionID:$permissionId,orgID:$orgId)
}`);


/**
 * 权限策略引用列表
 * @param orgPolicyId
 * @returns
 */
export async function getOrgPolicyReferenceList(
  orgPolicyId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: PermissionWhereInput;
    orderBy?: PermissionOrder;
  }) {
  const result = await paging(queryOrgPolicyReferences, {
    orgPolicyId,
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy,
  }, gather.current || 1);
  if (result.data?.orgPolicyReferences) {
    return result.data.orgPolicyReferences;
  }
  return null;
}


/**
 * 组织授权列表
 * @param orgId
 * @returns
 */
export async function getOrgPermissionList(
  orgId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: PermissionWhereInput;
    orderBy?: PermissionOrder;
  }) {
  const result = await paging(queryOrgPrmissionList, {
    gid: gid('org', orgId),
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy,
  }, gather.current || 1);
  if (result.data?.node?.__typename === 'Org') {
    return result.data.node.permissions;
  }
  return null;
}

/**
 * 用户授权列表
 * @param userId
 * @returns
 */
export async function getUserPermissionList(
  userId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: PermissionWhereInput;
    orderBy?: PermissionOrder;
  }) {
  const result = await paging(queryUserPrmissionList, {
    gid: gid('user', userId),
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy,
  }, gather.current || 1,
  );
  if (result.data?.node?.__typename === 'User') {
    return result.data.node.permissions;
  }
  return null;
}

/**
 * 用户继承用户组的权限策略
 * @param userId
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getUserExtendGroupPolicyList(
  userId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: PermissionWhereInput;
    orderBy?: PermissionOrder;
  },
) {
  const result = await paging(queryUserExtendGroupPolicieList, {
    userId: userId,
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy,
  }, gather.current || 1,
  );
  if (result.data?.userExtendGroupPolicies) {
    return result.data.userExtendGroupPolicies;
  }
  return null;
}


/**
 * 获取权限情况
 * @param permissionId
 * @returns
 */
export async function getPermissionInfo(permissionId: string) {
  const result = await query(queryPermissionInfo, {
    gid: gid('permission', permissionId),
  });
  if (result.data?.node?.__typename === 'Permission') {
    return result.data.node;
  }
  return null;
}

/**
 * 授权
 * @param input
 * @returns
 */
export async function createPermission(input: CreatePermissionInput) {
  const result = await mutation(mutationCreatePermission, {
    input,
  });
  if (result.data?.grant?.id) {
    return result.data.grant;
  }
  return null;
}

/**
 * 更新授权
 * @param permissionId
 * @param input
 * @returns
 */
export async function updatePermission(permissionId: string, input: UpdatePermissionInput) {
  const result = await mutation(mutationUpdatePermission, {
    input,
    permissionId,
  });
  if (result.data?.updatePermission?.id) {
    return result.data.updatePermission;
  }
  return null;
}


/**
 * 取消授权
 * @param permissionId
 * @param input
 * @returns
 */
export async function delPermssion(permissionId: string, orgId: string) {
  const result = await mutation(mutationDelPermission, {
    permissionId,
    orgId,
  });
  if (result.data?.revoke) {
    return result.data.revoke;
  }
  return null;
}
