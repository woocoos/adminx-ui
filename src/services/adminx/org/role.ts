import { gql } from '@/generated/adminx';
import { AssignRoleUserInput, CreateOrgRoleInput, OrgRoleOrder, OrgRoleWhereInput, UpdateOrgRoleInput } from '@/generated/adminx/graphql';
import { gid } from '@knockout-js/api';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'

const queryOrgGroupList = gql(/* GraphQL */`query orgGroupList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){
  orgGroups(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole
      }
    }
  }
}`);

const queryOrgGroupListAndIsGrant = gql(/* GraphQL */`query orgGroupListAndIsGrant($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){
  orgGroups(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole
        isGrantUser(userID: $userId)
      }
    }
  }
}`);

const queryUserGroupList = gql(/* GraphQL */`query userGroupList($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){
  userGroups(userID:$userId,first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole
      }
    }
  }
}`);

const queryOrgRoleList = gql(/* GraphQL */`query orgRoleList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){
  orgRoles(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole
      }
    }
  }
}`);

const queryOrgRoleListAndIsGrant = gql(/* GraphQL */`query orgRoleListAndIsGrant($userId:ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){
  orgRoles(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole
        isGrantUser(userID: $userId)
      }
    }
  }
}`);

const queryOrgRoleInfo = gql(/* GraphQL */`query orgRoleInfo($gid:GID!){
  node(id:$gid){
    ... on OrgRole{
      id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole
    }
  }
}`);

const mutationCreateOrgRole = gql(/* GraphQL */`mutation createOrgRole($input: CreateOrgRoleInput!){
  createRole(input:$input){id}
}`);

const mutationUpdateOrgRole = gql(/* GraphQL */`mutation updateOrgRole($orgRoleId:ID!,$input: UpdateOrgRoleInput!){
  updateRole(roleID:$orgRoleId,input:$input){id}
}`);

const mutationDelOrgRole = gql(/* GraphQL */`mutation deleteOrgRole($orgRoleId:ID!){
  deleteRole(roleID:$orgRoleId)
}`);

const mutationAssignOrgRoleUser = gql(/* GraphQL */`mutation assignOrgRoleUser($input: AssignRoleUserInput!){
  assignRoleUser(input:$input)
}`);

const mutationRevOrgRoleUser = gql(/* GraphQL */`mutation revokeOrgRoleUser($orgRoleId:ID!,$userId:ID!){
  revokeRoleUser(roleID:$orgRoleId,userID:$userId)
}`);

const mutationAssignOrgAppRole = gql(/* GraphQL */`mutation assignOrgAppRole($orgId:ID!,$appRoleId:ID!){
  assignOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)
}`);

const mutationRevOrgAppRole = gql(/* GraphQL */`mutation revokeOrgAppRole($orgId:ID!,$appRoleId:ID!){
  revokeOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)
}`);

const queryOrgGroupListNum = gql(/* GraphQL */`query orgGroupListNum($first:Int,$where:OrgRoleWhereInput){
  orgGroups(first:$first,where: $where){ totalCount }
}`);

const queryUserGroupListNum = gql(/* GraphQL */`query userGroupListNum($userId:ID!,$first:Int,$where:OrgRoleWhereInput){
  userGroups(userID:$userId,first:$first,where: $where){ totalCount }
}`);

const queryOrgRoleListNum = gql(/* GraphQL */`query orgRoleListNum($first:Int,$where:OrgRoleWhereInput){
  orgRoles(first:$first,where: $where){ totalCount }
}`);


/**
 * 获取组织用户组
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getOrgGroupList(
  gather: {
    current?: number;
    pageSize?: number;
    where?: OrgRoleWhereInput;
    orderBy?: OrgRoleOrder;
  },
  isGrant?: {
    userId?: string;
  }) {
  const result = isGrant?.userId ? await paging(
    queryOrgGroupListAndIsGrant, {
    userId: isGrant.userId,
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy,
  }, gather.current || 1) : await paging(
    queryOrgGroupList, {
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy,
  }, gather.current || 1);
  if (result.data?.orgGroups) {
    return result.data?.orgGroups;
  }
  return null;
}

/**
 * 获取用户加入的用户组
 * @param userId
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getUserJoinGroupList(
  userId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: OrgRoleWhereInput;
    orderBy?: OrgRoleOrder;
  }) {
  const
    result = await paging(
      queryUserGroupList, {
      userId: userId,
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, gather.current || 1);

  if (result.data?.userGroups) {
    return result.data.userGroups;
  }
  return null;
}

/**
 * 获取组织用户组
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getOrgRoleList(
  gather: {
    current?: number;
    pageSize?: number;
    where?: OrgRoleWhereInput;
    orderBy?: OrgRoleOrder;
  },
  isGrant?: {
    userId?: string;
  }) {
  const
    result = isGrant?.userId ? await paging(
      queryOrgRoleListAndIsGrant, {
      userId: isGrant.userId,
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, gather.current || 1) : await paging(
      queryOrgRoleList, {
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, gather.current || 1);

  if (result.data?.orgRoles) {
    return result.data.orgRoles;
  }
  return null;
}


/**
 * 获取用户信息
 * @param orgRoleId
 * @returns
 */
export async function getOrgRoleInfo(orgRoleId: string) {
  const
    result = await query(
      queryOrgRoleInfo, {
      gid: gid('org_role', orgRoleId),
    });

  if (result.data?.node?.__typename === 'OrgRole') {
    return result.data.node;
  }
  return null;
}

/**
 * 创建组织角色
 * @param input
 * @returns
 */
export async function createOrgRole(input: CreateOrgRoleInput) {
  const
    result = await mutation(
      mutationCreateOrgRole, {
      input,
    });

  if (result.data?.createRole?.id) {
    return result.data.createRole;
  }
  return null;
}

/**
 * 更新组织角色
 * @param orgRoleId
 * @param input
 * @returns
 */
export async function updateOrgRole(orgRoleId: string, input: UpdateOrgRoleInput) {
  const
    result = await mutation(
      mutationUpdateOrgRole, {
      input,
      orgRoleId,
    });

  if (result.data?.updateRole?.id) {
    return result.data.updateRole;
  }
  return null;
}


/**
 * 删除组织角色
 * @param orgRoleId
 * @returns
 */
export async function delOrgRole(orgRoleId: string) {
  const
    result = await mutation(
      mutationDelOrgRole, {
      orgRoleId,
    });

  if (result.data?.deleteRole) {
    return result.data.deleteRole;
  }
  return null;
}


/**
 * 分配用户到组织角色
 * @param input
 * @returns
 */
export async function assignOrgRoleUser(input: AssignRoleUserInput) {
  const
    result = await mutation(
      mutationAssignOrgRoleUser, {
      input,
    });

  if (result.data?.assignRoleUser) {
    return result.data.assignRoleUser;
  }
  return null;
}


/**
 * 分配用户到组织角色
 * @param orgRoleId
 * @returns
 */
export async function revokeOrgRoleUser(orgRoleId: string, userId: string) {
  const
    result = await mutation(
      mutationRevOrgRoleUser, {
      orgRoleId,
      userId,
    });

  if (result.data?.revokeRoleUser) {
    return result.data.revokeRoleUser;
  }
  return null;
}


/**
 * 分配应用角色到组织
 * @param orgId
 * @param appRoleId
 * @returns
 */
export async function assignOrgAppRole(orgId: string, appRoleId: string) {
  const
    result = await mutation(
      mutationAssignOrgAppRole, {
      orgId,
      appRoleId,
    });

  if (result.data?.assignOrganizationAppRole) {
    return result.data.assignOrganizationAppRole;
  }
  return null;
}


/**
 * 取消分配到组织应用角色
 * @param orgRoleId
 * @returns
 */
export async function revokeOrgAppRole(orgId: string, appRoleId: string) {
  const
    result = await mutation(
      mutationRevOrgAppRole, {
      orgId,
      appRoleId,
    });

  if (result.data?.revokeOrganizationAppRole) {
    return result.data.revokeOrganizationAppRole;
  }
  return null;
}


/**
 * 获取组织用户组数量
 * @param where
 * @returns
 */
export async function getOrgGroupQty(where?: OrgRoleWhereInput) {
  const
    result = await query(
      queryOrgGroupListNum, {
      where,
      first: 9999,
    });

  if (result.data?.orgGroups) {
    return result.data.orgGroups.totalCount;
  }
  return 0;
}


/**
 * 获取用户加入的用户组数量
 * @param userId
 * @param where
 * @returns
 */
export async function getUserJoinGroupQty(userId: string, where?: OrgRoleWhereInput) {
  const
    result = await query(
      queryUserGroupListNum, {
      where,
      userId,
      first: 9999,
    });

  if (result.data?.userGroups) {
    return result.data.userGroups.totalCount;
  }
  return 0;
}

/**
 * 获取角色数量
 * @param where
 * @returns
 */
export async function getOrgRoleQty(where?: OrgRoleWhereInput) {
  const
    result = await query(
      queryOrgRoleListNum, {
      where,
      first: 9999,
    });

  if (result.data?.orgRoles) {
    return result.data.orgRoles.totalCount;
  }
  return 0;
}
