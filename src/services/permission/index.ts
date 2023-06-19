import { gid } from '@/util';
import { koClient } from '../graphql';
import { gql } from '@/__generated__';
import { CreatePermissionInput, PermissionOrder, PermissionWhereInput, UpdatePermissionInput } from '@/__generated__/graphql';

export const EnumPermissionPrincipalKind = {
  user: { text: '用户' },
  role: { text: '角色' },
};

export const EnumPermissionStatus = {
  active: { text: '活跃', status: 'success' },
  inactive: { text: '失活', status: 'default' },
  processing: { text: '处理中', status: 'warning' },
};


const queryOrgPolicyReferences = gql(/* GraphQL */`query orgPolicyReferences($orgPolicyId:ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){
  list:orgPolicyReferences(policyID:$orgPolicyId,first:$first,orderBy: $orderBy,where: $where){
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
}`)

const queryOrgPrmissionList = gql(/* GraphQL */`query orgPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){
  node(id:$gid){
    ... on Org{
      list:permissions(first:$first,orderBy: $orderBy,where: $where){
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
}`)

const queryUserPrmissionList = gql(/* GraphQL */`query userPrmissionList($gid: GID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){
  node(id:$gid){
    ... on User{
      list:permissions(first:$first,orderBy: $orderBy,where: $where){
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
}`)

const queryUserExtendGroupPolicieList = gql(/* GraphQL */`query userExtendGroupPolicieList($userId: ID!,$first: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){
  list:userExtendGroupPolicies(userID:$userId,first:$first,orderBy: $orderBy,where: $where){
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
}`)

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
}`)

const mutationCreatePermission = gql(/* GraphQL */`mutation createPermission($input: CreatePermissionInput!){
  action:grant(input:$input){id}
}`)

const mutationUpdatePermission = gql(/* GraphQL */`mutation updatePermission($permissionId:ID!,$input: UpdatePermissionInput!){
  action:updatePermission(permissionID:$permissionId,input:$input){id}
}`)

const mutationDelPermission = gql(/* GraphQL */`mutation revoke($permissionId:ID!,$orgId:ID!){
  action:revoke(permissionID:$permissionId,orgID:$orgId)
}`)


/**
 * 权限策略引用列表
 * @param orgPolicyId
 * @returns
 */
export async function getOrgPolicyReferenceList(
  orgPolicyId: string,
  gather: {
    current?: number
    pageSize?: number
    where?: PermissionWhereInput
    orderBy?: PermissionOrder
  }) {
  const koc = koClient(),
    result = await koc.client.query(queryOrgPolicyReferences, {
      orgPolicyId,
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, {
      url: `${koc.url}?p=${gather.current || 1}`
    }).toPromise()
  if (result.data?.list.__typename === 'PermissionConnection') {
    return result.data.list
  }
  return null
}


/**
 * 组织授权列表
 * @param orgId
 * @returns
 */
export async function getOrgPermissionList(
  orgId: string,
  gather: {
    current?: number
    pageSize?: number
    where?: PermissionWhereInput
    orderBy?: PermissionOrder
  }) {
  const koc = koClient(),
    result = await koc.client.query(queryOrgPrmissionList, {
      gid: gid('org', orgId),
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, {
      url: `${koc.url}?p=${gather.current || 1}`
    }).toPromise()
  if (result.data?.node?.__typename === 'Org') {
    return result.data.node.list
  }
  return null
}

/**
 * 用户授权列表
 * @param userId
 * @returns
 */
export async function getUserPermissionList(
  userId: string,
  gather: {
    current?: number
    pageSize?: number
    where?: PermissionWhereInput
    orderBy?: PermissionOrder
  }) {
  const koc = koClient(),
    result = await koc.client.query(queryUserPrmissionList, {
      gid: gid('user', userId),
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, {
      url: `${koc.url}?p=${gather.current || 1}`
    }).toPromise()
  if (result.data?.node?.__typename === 'User') {
    return result.data.node.list
  }
  return null
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
    current?: number
    pageSize?: number
    where?: PermissionWhereInput
    orderBy?: PermissionOrder
  }
) {
  const koc = koClient(),
    result = await koc.client.query(queryUserExtendGroupPolicieList, {
      userId: userId,
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, {
      url: `${koc.url}?p=${gather.current || 1}`
    }).toPromise()
  if (result.data?.list) {
    return result.data.list
  }
  return null
}


/**
 * 获取权限情况
 * @param permissionId
 * @returns
 */
export async function getPermissionInfo(permissionId: string) {
  const koc = koClient(),
    result = await koc.client.query(queryPermissionInfo, {
      gid: gid('permission', permissionId),
    }).toPromise()
  if (result.data?.node?.__typename === 'Permission') {
    return result.data.node
  }
  return null
}

/**
 * 授权
 * @param input
 * @returns
 */
export async function createPermission(input: CreatePermissionInput) {
  const koc = koClient(),
    result = await koc.client.mutation(mutationCreatePermission, {
      input,
    }).toPromise()
  if (result.data?.action?.id) {
    return result.data.action
  }
  return null
}

/**
 * 更新授权
 * @param permissionId
 * @param input
 * @returns
 */
export async function updatePermission(permissionId: string, input: UpdatePermissionInput) {
  const koc = koClient(),
    result = await koc.client.mutation(mutationUpdatePermission, {
      input,
      permissionId,
    }).toPromise()
  if (result.data?.action?.id) {
    return result.data.action
  }
  return null
}


/**
 * 取消授权
 * @param permissionId
 * @param input
 * @returns
 */
export async function delPermssion(permissionId: string, orgId: string) {
  const koc = koClient(),
    result = await koc.client.mutation(mutationDelPermission, {
      permissionId,
      orgId,
    }).toPromise()
  if (result.data?.action) {
    return result.data.action
  }
  return null
}
