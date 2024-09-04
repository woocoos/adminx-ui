import { mutation, paging, query } from '@knockout-js/ice-urql/request'
import { gql } from '@/generated/adminx';
import { CreateOauthClientInput, CreateUserIdentityInput, CreateUserInput, CreateUserPasswordInput, OrderDirection, UpdateUserInput, UpdateUserLoginProfileInput, UserLoginProfileSetKind, UserOrder, UserOrderField, UserUserType, UserWhereInput } from '@/generated/adminx/graphql';
import { gid } from '@knockout-js/api';

export const EnumUserIdentityKind = {
  name: { text: '用户名' },
  email: { text: '邮件' },
  phone: { text: '手机' },
  wechat: { text: '微信' },
  qq: { text: 'QQ' },
};

export const EnumUserStatus = {
  active: { text: 'active', status: 'success' },
  inactive: { text: 'inactive', status: 'default' },
  disabled: { text: 'disabled', status: 'default' },
  processing: { text: 'processing', status: 'warning' },
};

export const EnumUserLoginProfileMfaStatus = {
  active: { text: 'active', status: 'success' },
  inactive: { text: 'inactive', status: 'default' },
  disabled: { text: 'disabled', status: 'default' },
  processing: { text: 'processing', status: 'warning' },
};

export const EnumUserAccessKeyStatus = {
  active: { text: 'active', status: 'success' },
  inactive: { text: 'inactive', status: 'default' },
  disabled: { text: 'disabled', status: 'default' },
  processing: { text: 'processing', status: 'warning' },
};


export type UpdateUserInfoScene = 'create' | 'base' | 'loginProfile' | 'identity' | 'recycle';

const queryUserList = gql(/* GraphQL */`query userList($first: Int,$orderBy:UserOrder,$where:UserWhereInput){
  users(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
        email,mobile,userType,creationType,registerIP,status,comments,avatar
      }
    }
  }
}`);

const queryUserInfo = gql(/* GraphQL */`query userInfo($gid:GID!){
  node(id:$gid){
    ... on User {
      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
      email,mobile,userType,creationType,registerIP,status,comments,avatar
    }
  }
}`);

const queryUserInfoLoginProfile = gql(/* GraphQL */`query userInfoLoginProfile($gid:GID!){
  node(id:$gid){
    ... on User {
      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
      email,mobile,userType,creationType,registerIP,status,comments,avatar
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
      email,mobile,userType,creationType,registerIP,status,comments,avatar
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


const queryUserAccessKeyList = gql(/* GraphQL */`query userAccessKeyList($gid:GID!){
  node(id:$gid){
    ... on User {
      id,
      oauthClients{
        id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt
      }
    }
  }
}`);

const mutationCreateUser = gql(/* GraphQL */`mutation createUser($rootOrgID:ID!,$input: CreateUserInput!){
  createOrganizationUser(rootOrgID:$rootOrgID,input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
    email,mobile,userType,creationType,registerIP,status,comments,avatar
   }
}`);

const mutationCreateAccount = gql(/* GraphQL */`mutation createAccount($rootOrgID:ID!,$input: CreateUserInput!){
  createOrganizationAccount(rootOrgID:$rootOrgID,input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
    email,mobile,userType,creationType,registerIP,status,comments,avatar
  }
}`);

const mutationUpdateUser = gql(/* GraphQL */`mutation updateUser($userId:ID!,$input: UpdateUserInput!){
  updateUser(userID:$userId,input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
    email,mobile,userType,creationType,registerIP,status,comments,avatar
   }
}`);

const mutationUpdateUserLoginProfile = gql(/* GraphQL */`mutation updateUserLoginProfile($userId:ID!,$input: UpdateUserLoginProfileInput!){
  updateLoginProfile(userID:$userId,input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,
    canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus
   }
}`);

const mutationBindUserIdentity = gql(/* GraphQL */`mutation bindUserIdentity($input: CreateUserIdentityInput!){
  bindUserIdentity(input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status
   }
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
  recoverOrgUser( userID:$userId, pwdKind:$setKind, userInput: $userInput, pwdInput: $pwdInput ){
    id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
    email,mobile,userType,creationType,registerIP,status,comments,avatar
  }
}`);

const mutationCreateOauthClient = gql(/* GraphQL */`mutation createOauthClient($input: CreateOauthClientInput!){
  createOauthClient( input: $input ){
    id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt
  }
}`);

const mutationEnableOauthClient = gql(/* GraphQL */`mutation enableOauthClient($id: ID!){
  enableOauthClient( id: $id ){
    id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt
  }
}`);

const mutationDisableOauthClient = gql(/* GraphQL */`mutation disableOauthClient($id: ID!){
  disableOauthClient( id: $id ){
    id,name,clientID,clientSecret,grantTypes,lastAuthAt,status,createdAt
  }
}`);

const mutationDelOauthClient = gql(/* GraphQL */`mutation delOauthClient($id: ID!){
  deleteOauthClient( id: $id )
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
  const result = await paging(queryUserList, {
    first: gather.pageSize || 20,
    where: gather.where,
    orderBy: gather.orderBy ?? {
      direction: OrderDirection.Desc,
      field: UserOrderField.CreatedAt
    },
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
  const result = await query(queryUserInfo, {
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
  const result = await query(queryUserInfoLoginProfile, {
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
  const result = await query(queryUserInfoIdentities, {
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
  const result = await query(queryUserInfoLoginProfileIdentities, {
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
  if (userType === UserUserType.Account) {
    const result = await mutation(
      mutationCreateAccount, {
      rootOrgID: rootOrgID,
      input,
    });
    if (result.data?.createOrganizationAccount?.id) {
      return result.data?.createOrganizationAccount;
    }
  } else {
    const result = await mutation(
      mutationCreateUser, {
      rootOrgID: rootOrgID,
      input,
    });
    if (result.data?.createOrganizationUser?.id) {
      return result.data?.createOrganizationUser;
    }
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
  const result = await mutation(
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
  const result = await mutation(
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
  const result = await mutation(
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
  const result = await mutation(
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
  const result = await mutation(
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
  const result = await mutation(
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
  const result = await mutation(
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
  const result = await mutation(
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
  const result = await mutation(
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
  const result = await mutation(
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
  const result = await query(
    queryCheckPermission, {
    permission,
  });

  if (result.data?.checkPermission) {
    return result?.data?.checkPermission;
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
  const result = await paging(queryOrgRecycleUserList, {
    first: gather.pageSize,
    where: gather.where,
    orderBy: gather.orderBy ?? {
      direction: OrderDirection.Desc,
      field: UserOrderField.CreatedAt
    },
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
  const result = await mutation(
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

/**
 * 获取用户accesskey
 * @param userId
 * @returns
 */
export async function getAccessKeyList(userId: string) {
  const result = await query(queryUserAccessKeyList, {
    gid: gid('user', userId),
  });

  if (result.data?.node?.__typename == "User") {
    return result.data.node.oauthClients
  }
  return null
}

/**
 * 创建 accessKey
 * @param input
 * @returns
 */
export async function createAccessKey(input: CreateOauthClientInput) {
  const result = await mutation(mutationCreateOauthClient, {
    input,
  });
  if (result.data?.createOauthClient.id) {
    return result.data.createOauthClient
  }
  return null;
}

/**
 * 启用 accessKey
 * @param accessKeyId
 * @returns
 */
export async function enableAccessKey(accessKeyId: string) {
  const result = await mutation(mutationEnableOauthClient, {
    id: accessKeyId,
  })
  if (result.data?.enableOauthClient.id) {
    return result.data.enableOauthClient
  }
  return null
}

/**
 * 禁用 accessKey
 * @param accessKeyId
 * @returns
 */
export async function disableAccessKey(accessKeyId: string) {
  const result = await mutation(mutationDisableOauthClient, {
    id: accessKeyId,

  })
  if (result.data?.disableOauthClient.id) {
    return result.data.disableOauthClient
  }
  return null
}

/**
 * 移除accessKey
 * @param accessKeyId
 * @returns
 */
export async function delAccessKey(accessKeyId: string) {
  const result = await mutation(mutationDelOauthClient, {
    id: accessKeyId,
  })
  if (result.data?.deleteOauthClient) {
    return result.data.deleteOauthClient
  }
  return null
}
