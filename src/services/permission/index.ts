import { gid } from '@/util';
import { List, TableFilter, TableParams, TableSort, getGraphqlFilter, graphqlApi, graphqlPageApi, setClearInputField } from '../graphql';
import { Org } from '../org';
import { User, UserNodeField } from '../user';
import { OrgPolicy, OrgPolicyNodeField } from '../org/policy';
import { OrgRole, OrgRoleNodeField } from '../org/role';

export type Permission = {
  id: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  orgID: string;
  principalKind: PermissionPrincipalKind;
  userID: string;
  roleID: string;
  orgPolicyID: string;
  startAt: string;
  endAt: string;
  status: PermissionStatus;
  isAllowRevoke: boolean;
  org?: Org;
  user?: User;
  role?: OrgRole;
  orgPolicy?: OrgPolicy;
};

export type PermissionPrincipalKind = 'user' | 'role';

export type PermissionStatus = 'active' | 'inactive' | 'processing';


export const EnumPermissionPrincipalKind = {
  user: { text: '用户' },
  role: { text: '角色' },
};

export const EnumPermissionStatus = {
  active: { text: '活跃', status: 'success' },
  inactive: { text: '失活', status: 'default' },
  processing: { text: '处理中', status: 'warning' },
};


export const PermissionNodeField = `
  id,createdBy,createdAt,updatedBy,updatedAt,orgID,principalKind,userID,roleID,orgPolicyID,startAt,endAt,status,
  isAllowRevoke,
  role{
    ${OrgRoleNodeField}
  }
  orgPolicy{
    ${OrgPolicyNodeField}
  }
  user{
    ${UserNodeField}
  }
`;


/**
 * 权限策略引用列表
 * @param orgPolicyId
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getOrgPolicyReferenceList(
  orgPolicyId: string,
  params: TableParams,
  filter: TableFilter,
  sort: TableSort,
) {
  const { where, orderBy } = getGraphqlFilter(params, filter, sort),
    result = await graphqlPageApi(
      `query orgPolicyReferences($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){
        list:orgPolicyReferences(policyID:"${orgPolicyId}",after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
          totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
          edges{
            cursor,node{
              ${PermissionNodeField}
            }
          }
        }
      }`,
      {
        first: params.pageSize,
        where,
        orderBy,
      },
      params.current,
    );

  if (result?.data?.list) {
    return result.data.list as List<Permission>;
  } else {
    return null;
  }
}


/**
 * 组织授权列表
 * @param orgId
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getOrgPermissionList(orgId: string, params: TableParams, filter: TableFilter, sort: TableSort) {
  const { where, orderBy } = getGraphqlFilter(params, filter, sort),
    result = await graphqlPageApi(
      `query orgpPrmissions($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){
        node(id:"${gid('org', orgId)}"){
          ... on Org{
            list:permissions(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
              totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
              edges{
                cursor,node{
                  ${PermissionNodeField}
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
      params.current,
    );

  if (result?.data?.node?.list) {
    return result.data.node.list as List<Permission>;
  } else {
    return null;
  }
}

/**
 * 用户授权列表
 * @param userId
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getUserPermissionList(userId: string, params: TableParams, filter: TableFilter, sort: TableSort) {
  const { where, orderBy } = getGraphqlFilter(params, filter, sort),
    result = await graphqlPageApi(
      `query orgpPrmissions($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){
        node(id:"${gid('user', userId)}"){
          ... on User{
            list:permissions(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
              totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
              edges{
                cursor,node{
                  ${PermissionNodeField}
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
      params.current,
    );

  if (result?.data?.node?.list) {
    return result.data.node.list as List<Permission>;
  } else {
    return null;
  }
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
  params: TableParams,
  filter: TableFilter,
  sort: TableSort,
) {
  const { where, orderBy } = getGraphqlFilter(params, filter, sort),
    result = await graphqlPageApi(
      `query userExtendGroupPolicies($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:PermissionOrder,$where:PermissionWhereInput){
        list:userExtendGroupPolicies(userID:"${userId}",after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
          totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
          edges{
            cursor,node{
              ${PermissionNodeField}
            }
          }
        }
      }`,
      {
        first: params.pageSize,
        where,
        orderBy,
      },
      params.current,
    );

  if (result?.data?.list) {
    return result.data.list as List<Permission>;
  } else {
    return null;
  }
}


/**
 * 获取权限情况
 * @param permissionId
 * @returns
 */
export async function getPermissionInfo(permissionId: string) {
  const result = await graphqlApi(
    `query{
      node(id:"${gid('permission', permissionId)}"){
        ... on Permission{
          ${PermissionNodeField}
        }
      }
    }`,
  );

  if (result?.data?.node) {
    return result?.data?.node as Permission;
  } else {
    return null;
  }
}

/**
 * 授权
 * @param input
 * @returns
 */
export async function createPermission(input: {
  principalKind: PermissionPrincipalKind;
  orgID: string;
  orgPolicyID: string;
  userID?: string;
  roleID?: string;
  startAt?: string;
  endAt?: string;
}) {
  const result = await graphqlApi(
    `mutation createPermission($input: CreatePermissionInput!){
      action:grant(input:$input){
        ${PermissionNodeField}
      }
    }`,
    { input },
  );

  if (result?.data?.action) {
    return result?.data?.action as Permission;
  } else {
    return null;
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
    `mutation updatePermission($input: UpdatePermissionInput!){
      action:updatePermission(permissionID:"${permissionId}",input:$input){
        ${PermissionNodeField}
      }
    }`,
    { input: setClearInputField(input) },
  );

  if (result?.data?.action) {
    return result?.data?.action as Permission;
  } else {
    return null;
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
    `mutation revoke{
      action:revoke(permissionID:"${permissionId}",orgID:"${orgId}")
    }`,
  );

  if (result?.data?.action) {
    return result?.data?.action as boolean;
  } else {
    return null;
  }
}
