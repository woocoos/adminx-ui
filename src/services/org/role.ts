import { gid } from '@/util';
import { gql } from '@/__generated__/knockout';
import { koClient } from '../graphql';
import { AssignRoleUserInput, CreateOrgRoleInput, OrgRoleOrder, OrgRoleWhereInput, UpdateOrgRoleInput } from '@/__generated__/knockout/graphql';

const queryOrgGroupList = gql(/* GraphQL */`query orgGroupList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){
  list:orgGroups(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole
      }
    }
  }
}`);

const queryOrgGroupListAndIsGrant = gql(/* GraphQL */`query orgGroupListAndIsGrant($userId: ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){
  list:orgGroups(first:$first,orderBy: $orderBy,where: $where){
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
  list:userGroups(userID:$userId,first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole
      }
    }
  }
}`);

const queryOrgRoleList = gql(/* GraphQL */`query orgRoleList($first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){
  list:orgRoles(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,orgID,kind,name,comments,isAppRole
      }
    }
  }
}`);

const queryOrgRoleListAndIsGrant = gql(/* GraphQL */`query orgRoleListAndIsGrant($userId:ID!,$first: Int,$orderBy:OrgRoleOrder,$where:OrgRoleWhereInput){
  list:orgRoles(first:$first,orderBy: $orderBy,where: $where){
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
  action:createRole(input:$input){id}
}`);

const mutationUpdateOrgRole = gql(/* GraphQL */`mutation updateOrgRole($orgRoleId:ID!,$input: UpdateOrgRoleInput!){
  action:updateRole(roleID:$orgRoleId,input:$input){id}
}`);

const mutationDelOrgRole = gql(/* GraphQL */`mutation deleteOrgRole($orgRoleId:ID!){
  action:deleteRole(roleID:$orgRoleId)
}`);

const mutationAssignOrgRoleUser = gql(/* GraphQL */`mutation assignOrgRoleUser($input: AssignRoleUserInput!){
  action:assignRoleUser(input:$input)
}`);

const mutationRevOrgRoleUser = gql(/* GraphQL */`mutation revokeOrgRoleUser($orgRoleId:ID!,$userId:ID!){
  action:revokeRoleUser(roleID:$orgRoleId,userID:$userId)
}`);

const mutationAssignOrgAppRole = gql(/* GraphQL */`mutation assignOrgAppRole($orgId:ID!,$appRoleId:ID!){
  action:assignOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)
}`);

const mutationRevOrgAppRole = gql(/* GraphQL */`mutation revokeOrgAppRole($orgId:ID!,$appRoleId:ID!){
  action:revokeOrganizationAppRole(orgID:$orgId,appRoleID:$appRoleId)
}`);

const queryOrgGroupListNum = gql(/* GraphQL */`query orgGroupListNum($first:Int,$where:OrgRoleWhereInput){
  list:orgGroups(first:$first,where: $where){ totalCount }
}`);

const queryUserGroupListNum = gql(/* GraphQL */`query userGroupListNum($userId:ID!,$first:Int,$where:OrgRoleWhereInput){
  list:userGroups(userID:$userId,first:$first,where: $where){ totalCount }
}`);

const queryOrgRoleListNum = gql(/* GraphQL */`query orgRoleListNum($first:Int,$where:OrgRoleWhereInput){
  list:orgRoles(first:$first,where: $where){ totalCount }
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
  const koc = koClient();
  const result = isGrant?.userId ? await koc.client.query(
    queryOrgGroupListAndIsGrant, {
    userId: isGrant.userId,
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy,
  }, {
    url: `${koc.url}?p=${gather.current || 1}`,
  }).toPromise() : await koc.client.query(
    queryOrgGroupList, {
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy,
  }, {
    url: `${koc.url}?p=${gather.current || 1}`,
  }).toPromise();
  if (result.data?.list) {
    return result.data?.list;
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
  const koc = koClient(),
    result = await koc.client.query(
      queryUserGroupList, {
      userId: userId,
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, {
      url: `${koc.url}?p=${gather.current || 1}`,
    }).toPromise();

  if (result.data?.list) {
    return result.data.list;
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
  const koc = koClient(),
    result = isGrant?.userId ? await koc.client.query(
      queryOrgRoleListAndIsGrant, {
      userId: isGrant.userId,
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, {
      url: `${koc.url}?p=${gather.current || 1}`,
    }).toPromise() : await koc.client.query(
      queryOrgRoleList, {
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, {
      url: `${koc.url}?p=${gather.current || 1}`,
    }).toPromise();

  if (result.data?.list) {
    return result.data.list;
  }
  return null;
}


/**
 * 获取用户信息
 * @param orgRoleId
 * @returns
 */
export async function getOrgRoleInfo(orgRoleId: string) {
  const koc = koClient(),
    result = await koc.client.query(
      queryOrgRoleInfo, {
      gid: gid('org_role', orgRoleId),
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationCreateOrgRole, {
      input,
    }).toPromise();

  if (result.data?.action?.id) {
    return result.data.action;
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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationUpdateOrgRole, {
      input,
      orgRoleId,
    }).toPromise();

  if (result.data?.action?.id) {
    return result.data.action;
  }
  return null;
}


/**
 * 删除组织角色
 * @param orgRoleId
 * @returns
 */
export async function delOrgRole(orgRoleId: string) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationDelOrgRole, {
      orgRoleId,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
  }
  return null;
}


/**
 * 分配用户到组织角色
 * @param input
 * @returns
 */
export async function assignOrgRoleUser(input: AssignRoleUserInput) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationAssignOrgRoleUser, {
      input,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
  }
  return null;
}


/**
 * 分配用户到组织角色
 * @param orgRoleId
 * @returns
 */
export async function revokeOrgRoleUser(orgRoleId: string, userId: string) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationRevOrgRoleUser, {
      orgRoleId,
      userId,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationAssignOrgAppRole, {
      orgId,
      appRoleId,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
  }
  return null;
}


/**
 * 取消分配到组织应用角色
 * @param orgRoleId
 * @returns
 */
export async function revokeOrgAppRole(orgId: string, appRoleId: string) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationRevOrgAppRole, {
      orgId,
      appRoleId,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
  }
  return null;
}


/**
 * 获取组织用户组数量
 * @param where
 * @returns
 */
export async function getOrgGroupQty(where?: OrgRoleWhereInput) {
  const koc = koClient(),
    result = await koc.client.query(
      queryOrgGroupListNum, {
      where,
      first: 9999,
    }).toPromise();

  if (result.data?.list.__typename === 'OrgRoleConnection') {
    return result.data.list.totalCount;
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
  const koc = koClient(),
    result = await koc.client.query(
      queryUserGroupListNum, {
      where,
      userId,
      first: 9999,
    }).toPromise();

  if (result.data?.list.__typename === 'OrgRoleConnection') {
    return result.data.list.totalCount;
  }
  return 0;
}

/**
 * 获取角色数量
 * @param where
 * @returns
 */
export async function getOrgRoleQty(where?: OrgRoleWhereInput) {
  const koc = koClient(),
    result = await koc.client.query(
      queryOrgRoleListNum, {
      where,
      first: 9999,
    }).toPromise();

  if (result.data?.list.__typename === 'OrgRoleConnection') {
    return result.data.list.totalCount;
  }
  return 0;
}
