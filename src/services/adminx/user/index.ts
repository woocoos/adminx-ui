import { gid } from '@/util';
import { mutationRequest, pagingRequest, queryRequest } from '../';
import { gql } from '@/__generated__/adminx';
import { AppActionKind, AppActionMethod, AppActionWhereInput, CreateUserIdentityInput, CreateUserInput, CreateUserPasswordInput, UpdateUserInput, UpdateUserLoginProfileInput, UserLoginProfileSetKind, UserOrder, UserUserType, UserWhereInput } from '@/__generated__/adminx/graphql';

export const EnumUserIdentityKind = {
  name: { text: '用户名' },
  email: { text: '邮件' },
  phone: { text: '手机' },
  wechat: { text: '微信' },
  qq: { text: 'QQ' },
};

export const EnumUserStatus = {
  active: { text: '活跃', status: 'success' },
  inactive: { text: '失活', status: 'default' },
  processing: { text: '处理中', status: 'warning' },
};

export const EnumUserLoginProfileMfaStatus = {
  active: { text: '活跃', status: 'success' },
  inactive: { text: '失活', status: 'default' },
  processing: { text: '处理中', status: 'warning' },
};

export type UpdateUserInfoScene = 'create' | 'base' | 'loginProfile' | 'identity' | 'recycle';

const queryUserList = gql(/* GraphQL */`query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){
  users(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
        email,mobile,userType,creationType,registerIP,status,comments
      }
    }
  }
}`);

const queryUserInfo = gql(/* GraphQL */`query userInfo($gid:GID!){
  node(id:$gid){
    ... on User {
      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
      email,mobile,userType,creationType,registerIP,status,comments,avatarFileID
    }
  }
}`);

const queryUserInfoLoginProfile = gql(/* GraphQL */`query userInfoLoginProfile($gid:GID!){
  node(id:$gid){
    ... on User {
      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
      email,mobile,userType,creationType,registerIP,status,comments,avatarFileID
      loginProfile{
        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,
        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus
      }
    }
  }
}`);

const queryUserInfoLoginProfileIdentities = gql(/* GraphQL */`query userInfoLoginProfileIdentities($gid:GID!){
  node(id:$gid){
    ... on User {
      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
      email,mobile,userType,creationType,registerIP,status,comments,avatarFileID
      loginProfile{
        id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,
        canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus
      }
      identities{
        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status
      }
    }
  }
}`);

const queryUserInfoIdentities = gql(/* GraphQL */`query userInfoIdentities($gid:GID!){
  node(id:$gid){
    ... on User {
      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
      email,mobile,userType,creationType,registerIP,status,comments,
      identities{
        id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status
      }
    }
  }
}`);

const mutationCreateUser = gql(/* GraphQL */`mutation createUser($rootOrgID:ID!,$input: CreateUserInput!){
  createOrganizationUser(rootOrgID:$rootOrgID,input:$input){ id }
}`);

const mutationCreateAccount = gql(/* GraphQL */`mutation createAccount($rootOrgID:ID!,$input: CreateUserInput!){
  createOrganizationAccount(rootOrgID:$rootOrgID,input:$input){ id }
}`);

const mutationUpdateUser = gql(/* GraphQL */`mutation updateUser($userId:ID!,$input: UpdateUserInput!){
  updateUser(userID:$userId,input:$input){ id,displayName }
}`);

const mutationUpdateUserLoginProfile = gql(/* GraphQL */`mutation updateUserLoginProfile($userId:ID!,$input: UpdateUserLoginProfileInput!){
  updateLoginProfile(userID:$userId,input:$input){ id }
}`);

const mutationBindUserIdentity = gql(/* GraphQL */`mutation bindUserIdentity($input: CreateUserIdentityInput!){
  bindUserIdentity(input:$input){ id }
}`);

const mutationDelUserIdentity = gql(/* GraphQL */`mutation deleteUserIdentity($identityId:ID!){
  deleteUserIdentity(id:$identityId)
}`);

const mutationDelUser = gql(/* GraphQL */`mutation deleteUser($userId:ID!){
  deleteUser(userID:$userId)
}`);

const mutationResetUserPwdEmail = gql(/* GraphQL */`mutation resetUserPasswordByEmail($userId:ID!){
  resetUserPasswordByEmail(userId: $userId)
}`);

const mutationChangePwd = gql(/* GraphQL */`mutation changePassword($oldPwd:String!,$newPwd:String!){
  changePassword(oldPwd:$oldPwd,newPwd:$newPwd)
}`);

const mutationEnableMfa = gql(/* GraphQL */`mutation enableMfa($userId:ID!){
  enableMFA(userID:$userId){secret,account}
}`);

const mutationDisableMfa = gql(/* GraphQL */`mutation disableMfa($userId:ID!){
  disableMFA(userID:$userId)
}`);

const mutationSendMfaEmail = gql(/* GraphQL */`mutation sendMfaEmail($userId:ID!){
  sendMFAToUserByEmail(userID:$userId)
}`);

const queryCheckPermission = gql(/* GraphQL */`query  checkPermission($permission:String!){
  checkPermission(permission: $permission)
}`);

const queryUserPermissionList = gql(/* GraphQL */`query userPermissionList($where: AppActionWhereInput){
  userPermissions(where: $where){
    id,appID,name,kind,method
  }
}`);

const queryUserMenuList = gql(/* GraphQL */`query userMenuList($appCode:String!){
  userMenus(appCode: $appCode){
    id,parentID,kind,name,comments,displaySort,icon,route
  }
}`);

const queryUserRootOrgList = gql(/* GraphQL */`query userRootOrgs{
  userRootOrgs{
    id,parentID,kind,domain,code,name,status,path,displaySort,countryCode,timezone
  }
}`);

const queryOrgRecycleUserList = gql(/* GraphQL */`query orgRecycleUsers($first: Int,$orderBy:UserOrder,$where:UserWhereInput){
  orgRecycleUsers(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
        email,mobile,userType,creationType,registerIP,status,comments
      }
    }
  }
}`);

const mutationRecOrgUser = gql(/* GraphQL */`mutation recoverOrgUser($userId:ID!,$setKind:UserLoginProfileSetKind!,$userInput: UpdateUserInput!,$pwdInput: CreateUserPasswordInput){
  recoverOrgUser( userID:$userId, pwdKind:$setKind, userInput: $userInput, pwdInput: $pwdInput ){ id }
}`);


/**
 * 获取用户信息
 * @param userId
 * @param headers
 * @returns
 */
export async function getUserList(gather: {
  current?: number;
  pageSize?: number;
  where?: UserWhereInput;
  orderBy?: UserOrder;
}) {
  const result = await pagingRequest(queryUserList, {
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy,
  }, gather.current || 1);
  if (result.data?.users) {
    return result.data.users;
  }
  return null;
}

/**
 * 获取用户信息
 * @param userId
 * @returns
 */
export async function getUserInfo(userId: string) {
  const result = await queryRequest(queryUserInfo, {
    gid: gid('user', userId),
  });

  if (result.data?.node?.__typename === 'User') {
    return result.data?.node;
  }
  return null;
}

/**
 * 获取用户信息
 * @param userId
 * @returns
 */
export async function getUserInfoLoginProfile(userId: string) {
  const result = await queryRequest(queryUserInfoLoginProfile, {
    gid: gid('user', userId),
  })

  if (result.data?.node?.__typename === 'User') {
    return result.data?.node;
  }
  return null;
}

/**
 * 获取用户信息
 * @param userId
 * @returns
 */
export async function getUserInfoIdentities(userId: string) {
  const result = await queryRequest(queryUserInfoIdentities, {
    gid: gid('user', userId),
  });

  if (result.data?.node?.__typename === 'User') {
    return result.data?.node;
  }
  return null;
}

/**
 * 获取用户信息
 * @param userId
 * @returns
 */
export async function getUserInfoLoginProfileIdentities(userId: string) {
  const result = await queryRequest(queryUserInfoLoginProfileIdentities, {
    gid: gid('user', userId),
  });

  if (result.data?.node?.__typename === 'User') {
    return result.data?.node;
  }
  return null;
}

/**
 * 创建用户信息
 * @param rootOrgID
 * @param input
 * @returns
 */
export async function createUserInfo(rootOrgID: string, input: CreateUserInput, userType: UserUserType) {
  const result = await mutationRequest(
    userType === UserUserType.Account ? mutationCreateAccount : mutationCreateUser, {
    rootOrgID: rootOrgID,
    input,
  });

  if (result.data?.createOrganizationUser?.id) {
    return result.data?.createOrganizationUser;
  }
  return null;
}


/**
 * 更新用户信息
 * @param userId
 * @param input
 * @returns
 */
export async function updateUserInfo(userId: string, input: UpdateUserInput) {
  const result = await mutationRequest(
    mutationUpdateUser, {
    userId,
    input,
  });

  if (result.data?.updateUser?.id) {
    return result?.data?.updateUser;
  }
  return null;
}

/**
 * 更新用户登录配置
 * @param userId
 * @param input
 * @returns
 */
export async function updateUserProfile(userId: string, input: UpdateUserLoginProfileInput) {
  const result = await mutationRequest(
    mutationUpdateUserLoginProfile, {
    userId,
    input,
  });

  if (result.data?.updateLoginProfile?.id) {
    return result?.data?.updateLoginProfile;
  }
  return null;
}

/**
 * 绑定用户凭证
 * @param userId
 * @param input
 * @returns
 */
export async function bindUserIdentity(input: CreateUserIdentityInput) {
  const result = await mutationRequest(
    mutationBindUserIdentity, {
    input,
  });

  if (result.data?.bindUserIdentity?.id) {
    return result?.data?.bindUserIdentity;
  }
  return null;
}

/**
 * 删除用户凭证
 * @param identityId
 * @returns
 */
export async function delUserIdentity(identityId: string) {
  const result = await mutationRequest(
    mutationDelUserIdentity, {
    identityId,
  });

  if (result.data?.deleteUserIdentity) {
    return result?.data?.deleteUserIdentity;
  }
  return null;
}

/**
 * 删除用户信息
 * @param userId
 * @returns
 */
export async function delUserInfo(userId: string) {
  const result = await mutationRequest(
    mutationDelUser, {
    userId,
  });

  if (result.data?.deleteUser) {
    return result?.data?.deleteUser;
  }
  return null;
}

/**
 * 重置用户密码并发送邮件
 * @param userId
 * @returns
 */
export async function resetUserPasswordByEmail(userId: string) {
  const result = await mutationRequest(
    mutationResetUserPwdEmail, {
    userId,
  });

  if (result.data?.resetUserPasswordByEmail) {
    return result?.data?.resetUserPasswordByEmail;
  }
  return null;
}

/**
 * 更新密码
 * @param oldPwd
 * @param newPwd
 * @returns
 */
export async function updatePassword(oldPwd: string, newPwd: string) {
  const result = await mutationRequest(
    mutationChangePwd, {
    oldPwd,
    newPwd,
  });

  if (result.data?.changePassword) {
    return result?.data?.changePassword;
  }
  return null;
}


/**
 * 启用MFA
 * @param userId
 * @returns
 */
export async function enableMFA(userId: string) {
  const result = await mutationRequest(
    mutationEnableMfa, {
    userId,
  });

  if (result.data?.enableMFA) {
    return result?.data?.enableMFA;
  }
  return null;
}

/**
 * 禁用MFA
 * @param userId
 * @returns
 */
export async function disableMFA(userId: string) {
  const result = await mutationRequest(
    mutationDisableMfa, {
    userId,
  });

  if (result.data?.disableMFA) {
    return result?.data?.disableMFA;
  }
  return null;
}

/**
 * 发送MFA到用户邮箱
 * @param userId
 * @returns
 */
export async function sendMFAEmail(userId: string) {
  const result = await mutationRequest(
    mutationSendMfaEmail, {
    userId,
  });

  if (result.data?.sendMFAToUserByEmail) {
    return result?.data?.sendMFAToUserByEmail;
  }
  return null;
}


/**
 * 检测权限
 * @param permission  'appCode:action'
 * @returns
 */
export async function checkPermission(permission: string) {
  const result = await queryRequest(
    queryCheckPermission, {
    permission,
  });

  if (result.data?.checkPermission) {
    return result?.data?.checkPermission;
  }
  return null;
}


/**
 * 获取用户的权限
 * @param where
 * @returns
 */
export async function userPermissions(headers?: Record<string, any>) {
  const result = await queryRequest(
    queryUserPermissionList,
    {
      where: {
        hasAppWith: [{ code: process.env.ICE_APP_CODE }],
        or: [
          { kind: AppActionKind.Function },
          { kindNEQ: AppActionKind.Function, method: AppActionMethod.Write }
        ],
      }
    },
    headers,
  );

  if (result.data?.userPermissions) {
    return result?.data?.userPermissions;
  }
  return null;
}

/**
 * 获取用户授权的菜单
 * @param appCode
 * @returns
 */
export async function userMenus(appCode: string) {
  const result = await queryRequest(
    queryUserMenuList, {
    appCode,
  });

  if (result.data?.userMenus) {
    return result?.data?.userMenus;
  }
  return null;
}

/**
 * 获取用户root组织
 * @returns
 */
export async function userRootOrgs() {
  const result = await queryRequest(queryUserRootOrgList, {});
  if (result.data?.userRootOrgs) {
    return result?.data?.userRootOrgs;
  }
  return null;
}


/**
 * 获取回收站用户
 * @param userId
 * @param headers
 * @returns
 */
export async function getRecycleUserList(gather: {
  current?: number;
  pageSize?: number;
  where?: UserWhereInput;
  orderBy?: UserOrder;
}) {
  const result = await pagingRequest(queryOrgRecycleUserList, {
    first: gather.pageSize,
    where: gather.where,
    orderBy: gather.orderBy,
  }, gather.current || 1);
  if (result.data?.orgRecycleUsers) {
    return result?.data?.orgRecycleUsers;
  }
  return null;
}


/**
 * 恢复回收站用户
 * @param userId
 * @returns
 */
export async function restoreRecycleUser(
  userId: string,
  userInput: UpdateUserInput,
  setKind: UserLoginProfileSetKind,
  pwdInput?: CreateUserPasswordInput,
) {
  const result = await mutationRequest(
    mutationRecOrgUser, {
    userId,
    setKind,
    userInput,
    pwdInput,
  });

  if (result.data?.recoverOrgUser) {
    return result?.data?.recoverOrgUser;
  }
  return null;
}
