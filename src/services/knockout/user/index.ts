import { gid } from '@/util';
import { koClient } from '../';
import { gql } from '@/__generated__/knockout';
import { AppActionWhereInput, CreateUserIdentityInput, CreateUserInput, CreateUserPasswordInput, UpdateUserInput, UpdateUserLoginProfileInput, UserLoginProfileSetKind, UserOrder, UserUserType, UserWhereInput } from '@/__generated__/knockout/graphql';

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
      email,mobile,userType,creationType,registerIP,status,comments
    }
  }
}`);

const queryUserInfoLoginProfile = gql(/* GraphQL */`query userInfoLoginProfile($gid:GID!){
  node(id:$gid){
    ... on User {
      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
      email,mobile,userType,creationType,registerIP,status,comments,
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
      email,mobile,userType,creationType,registerIP,status,comments,
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
  const koc = koClient(),
    result = await koc.client.query(queryUserList, {
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, {
      url: `${koc.url}?p=${gather.current || 1}`,
    }).toPromise();
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
  const koc = koClient(),
    result = await koc.client.query(queryUserInfo, {
      gid: gid('user', userId),
    }, {

    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.query(queryUserInfoLoginProfile, {
      gid: gid('user', userId),
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.query(queryUserInfoIdentities, {
      gid: gid('user', userId),
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.query(queryUserInfoLoginProfileIdentities, {
      gid: gid('user', userId),
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.mutation(
      userType === UserUserType.Account ? mutationCreateAccount : mutationCreateUser, {
      rootOrgID: rootOrgID,
      input,
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationUpdateUser, {
      userId,
      input,
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationUpdateUserLoginProfile, {
      userId,
      input,
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationBindUserIdentity, {
      input,
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationDelUserIdentity, {
      identityId,
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationDelUser, {
      userId,
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationResetUserPwdEmail, {
      userId,
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationChangePwd, {
      oldPwd,
      newPwd,
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationEnableMfa, {
      userId,
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationDisableMfa, {
      userId,
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationSendMfaEmail, {
      userId,
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.query(
      queryCheckPermission, {
      permission,
    }).toPromise();

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
export async function userPermissions(where: AppActionWhereInput, headers?: Record<string, any>) {
  const koc = koClient(),
    result = await koc.client.query(
      queryUserPermissionList,
      { where },
      {
        fetchOptions: { headers }
      }
    ).toPromise();

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
  const koc = koClient(),
    result = await koc.client.query(
      queryUserMenuList, {
      appCode,
    }).toPromise();

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
  const koc = koClient(),
    result = await koc.client.query(queryUserRootOrgList, {}).toPromise();
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
  const koc = koClient(),
    result = await koc.client.query(queryOrgRecycleUserList, {
      first: gather.pageSize,
      where: gather.where,
      orderBy: gather.orderBy,
    }, {
      url: `${koc.url}?p=${gather.current || 1}`,
    }).toPromise();
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
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationRecOrgUser, {
      userId,
      setKind,
      userInput,
      pwdInput,
    }).toPromise();

  if (result.data?.recoverOrgUser) {
    return result?.data?.recoverOrgUser;
  }
  return null;
}
