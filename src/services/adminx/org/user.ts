import { gql } from '@/generated/adminx';
import { CreateOrgUserInput, OrderDirection, OrgUserUserType, UserOrder, UserOrderField, UserWhereInput } from '@/generated/adminx/graphql';
import { gid } from '@knockout-js/api';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'

export const EnumOrgUserType = {
  [OrgUserUserType.External]: { text: '外部用户' },
  [OrgUserUserType.Internal]: { text: '内部用户' },
}

const queryOrgUserList = gql(/* GraphQL */`query orgUserList($gid: GID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){
  node(id:$gid){
    ... on Org{
      id,
      users(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
            contact{email,mobile},userType,creationType,registerIP,status,comments
          }
        }
      }
    }
  }
}`);

const queryOrgUserListAndIsOrgRole = gql(/* GraphQL */`query orgUserListAndIsOrgRole($gid: GID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){
  node(id:$gid){
    ... on Org{
      id,
      users(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
            contact{email,mobile},userType,creationType,registerIP,status,comments
            isAssignOrgRole(orgRoleID: $orgRoleId)
            isAllowRevokeRole(orgRoleID: $orgRoleId)
          }
        }
      }
    }
  }
}`);

const queryOrgRoleUserList = gql(/* GraphQL */`query orgRoleUserList($roleId: ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){
  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
        contact{email,mobile},userType,creationType,registerIP,status,comments
      }
    }
  }
}`);

const queryOrgRoleUserListAndIsOrgRole = gql(/* GraphQL */`query orgRoleUserListAndIsOrgRole($roleId: ID!,$orgRoleId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){
  orgRoleUsers(roleID:$roleId,first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
        contact{email,mobile},userType,creationType,registerIP,status,comments
        isAssignOrgRole(orgRoleID: $orgRoleId)
        isAllowRevokeRole(orgRoleID: $orgRoleId)
      }
    }
  }
}`);

const queryOrgUserNum = gql(/* GraphQL */`query orgUserNum($gid:GID!,$first: Int,$where:UserWhereInput){
  node(id:$gid){
    ... on Org{
      id,
      users(first:$first,where: $where){ totalCount }
    }
  }
}`);

const mutationAllotOrgUser = gql(/* GraphQL */`mutation allotOrgUser($input:CreateOrgUserInput!){
  allotOrganizationUser(input:$input)
}`);

const mutationRemoveOrgUser = gql(/* GraphQL */`mutation removeOrgUser($orgId:ID!,$userId:ID!){
  removeOrganizationUser(orgID: $orgId,userID: $userId)
}`);

const queryMemberList = gql(/* GraphQL */`query memberList($orgId:ID!,$first: Int,$orderBy:UserOrder,$where:UserWhereInput){
  userMembers(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
        contact{email,mobile},userType,creationType,registerIP,status,comments,
        orgUserType(orgID: $orgId)
      }
    }
  }
}`);

const mutationChangeOrgUserType = gql(/* GraphQL */`mutation changeOrgUserType($userId:ID!,$userType:OrgUserUserType!){
  changeOrgUserType(userID:$userId,userType:$userType)
}`);

/**
 * 成员管理
 * @param gather
 * @returns
 */
export async function getMemberList(
  orgId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: UserWhereInput;
    orderBy?: UserOrder;
  },
) {
  const result = await paging(
    queryMemberList, {
    orgId,
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy ?? {
      direction: OrderDirection.Desc,
      field: UserOrderField.CreatedAt
    }
  }, gather.current || 1)
  if (result.data?.userMembers) {
    return result.data.userMembers;
  }
  return null;
}

/**
 * 组织下的用户信息
 * @param orgId
 * @returns
 */
export async function getOrgUserList(
  orgId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: UserWhereInput;
    orderBy?: UserOrder;
  },
  isGrant?: {
    orgRoleId?: string;
  },
) {
  const result = isGrant?.orgRoleId ? await paging(
    queryOrgUserListAndIsOrgRole, {
    orgRoleId: isGrant.orgRoleId,
    gid: gid('Org', orgId),
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy ?? {
      direction: OrderDirection.Desc,
      field: UserOrderField.CreatedAt
    },
  }, gather.current || 1) : await paging(
    queryOrgUserList, {
    gid: gid('Org', orgId),
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy ?? {
      direction: OrderDirection.Desc,
      field: UserOrderField.CreatedAt
    },
  }, gather.current || 1);

  if (result.data?.node?.__typename === 'Org') {
    return result.data.node.users;
  }
  return null;
}

/**
 * 组织下的角色用户
 * @param roleId
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getOrgRoleUserList(
  roleId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: UserWhereInput;
    orderBy?: UserOrder;
  },
  isGrant?: {
    orgRoleId?: string;
  },
) {
  const result = isGrant?.orgRoleId ? await paging(
    queryOrgRoleUserListAndIsOrgRole, {
    roleId,
    orgRoleId: isGrant.orgRoleId,
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy ?? {
      direction: OrderDirection.Desc,
      field: UserOrderField.CreatedAt
    },
  }, gather.current || 1) : await paging(
    queryOrgRoleUserList, {
    roleId,
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy ?? {
      direction: OrderDirection.Desc,
      field: UserOrderField.CreatedAt
    },
  }, gather.current || 1);

  if (result.data?.orgRoleUsers) {
    return result.data?.orgRoleUsers;
  }
  return null;
}

/**
 * 分配用户给组织
 * @param input
 * @returns
 */
export async function allotOrgUser(input: CreateOrgUserInput) {
  const
    result = await mutation(
      mutationAllotOrgUser, {
      input,
    });

  if (result.data?.allotOrganizationUser) {
    return result?.data?.allotOrganizationUser;
  }
  return null;
}

/**
 * 用户移除组织
 * @param orgId
 * @param userId
 * @returns
 */
export async function removeOrgUser(orgId: string, userId: string) {
  const
    result = await mutation(
      mutationRemoveOrgUser, {
      orgId,
      userId,
    });

  if (result.data?.removeOrganizationUser) {
    return result?.data?.removeOrganizationUser;
  }
  return null;
}

/**
 * 组织下的用户数量
 * @param orgId
 * @param where
 * @returns
 */
export async function getOrgUserQty(orgId: string, where?: UserWhereInput) {
  const
    result = await query(
      queryOrgUserNum, {
      gid: gid('Org', orgId),
      where,
      first: 9999,
    });

  if (result.data?.node?.__typename === 'Org') {
    return result?.data?.node.users.totalCount;
  }
  return 0;
}

/**
 * 切换用户类型
 * @param userId
 * @param userType
 * @returns
 */
export async function changeOrgUserType(userId: string, userType: OrgUserUserType) {
  const
    result = await mutation(
      mutationChangeOrgUserType, {
      userId,
      userType,
    });

  if (result.data?.changeOrgUserType) {
    return result?.data?.changeOrgUserType;
  }
  return null;
}


const queryOrgUserAssigned = gql(/* GraphQL */`query OrgUserPolicyViewAssigned($appCode: String!,$userID:ID!){
  orgPolicyView(appCode:$appCode){
    id,name,kind,orgPolicy{id}
    orgUserAssigned(userID: $userID)
  }
}`);

/**
 * 获取组织用户已授权的策略试图
 * @param appCode
 * @param userID
 * @returns
 */
export async function getOrgUserAssignedPolicyView(appCode: string, userID: string) {
  const
    result = await query(
      queryOrgUserAssigned, {
      appCode,
      userID,
    });

  if (result.data?.orgPolicyView) {
    return result.data.orgPolicyView.filter(item => item.orgUserAssigned);
  }
  return [];
}


const mutationAssignOrgUserPolicyView = gql(/* GraphQL */`mutation assignOrgUserPolicyView($orgID: ID!, $userID: ID!,$rmOrgPolicyIDs: [ID!],$addOrgPolicyIDs: [ID!]){
  assignOrgUserPolicyView(orgID: $orgID, userID: $userID,rmOrgPolicyIDs: $rmOrgPolicyIDs,addOrgPolicyIDs: $addOrgPolicyIDs)
}`);


/**
 * 组织用户权限试图授权保存
 * @param orgID
 * @param userID
 * @param addOrgPolicyIDs
 * @param rmOrgPolicyIDs
 * @returns
 */
export async function assignOrgUserPolicyView(orgID: string, userID: string, addOrgPolicyIDs: string[], rmOrgPolicyIDs: string[]) {
  const
    result = await mutation(
      mutationAssignOrgUserPolicyView, {
      orgID,
      userID,
      addOrgPolicyIDs,
      rmOrgPolicyIDs,
    });

  if (result.data?.assignOrgUserPolicyView) {
    return result.data.assignOrgUserPolicyView;
  }
  return false;
}
