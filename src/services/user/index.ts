import { gid } from "@/util";
import Sha256 from "crypto-js/sha256";
import {
  TableParams, graphqlApi, setClearInputField, TableFilter,
  TableSort,
  getGraphqlFilter,
  graphqlPageApi,
  List
} from "../graphql";
import { AppAction, AppActionField } from "../app/action";
import { AppMenu, AppMenuField } from "../app/menu";
import { Org, OrgNodeField } from "../org";

export type UserType = "account" | "member"
export type UserCreationType = "invitation" | "register" | "manual"

type UserStatus = "active" | "inactive" | "processing"

export interface User {
  id: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  deletedAt: string
  principalName: string
  displayName: string
  email: string
  mobile: string
  userType: UserType
  creationType: UserCreationType
  registerIP: string
  status: UserStatus
  comments: string
  loginProfile?: UserLoginProfile
  passwords?: UserPassword[]
  password?: UserPassword
  identities?: UserIdentity[]
  isAssignOrgRole?: boolean
  isAllowRevokeRole?: boolean
}

export type UserLoginProfileSetKind = "keep" | "customer" | "auto"
export interface UserLoginProfile {
  id: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  userID: string
  lastLoginIP: string
  /**
   * 最后登陆时间
   */
  lastLoginAt: string
  /**
   * 是否允许使用密码登陆控制台
   */
  canLogin: boolean
  /**
   * 设置密码:keep-保持不变,customer-客户自行设置,auto-自动生成
   */
  setKind: UserLoginProfileSetKind
  /**
   * 下次登陆时需要重置密码
   */
  passwordReset: boolean
  /**
   * 是否开启设备认证
   */
  verifyDevice: boolean
  /**
   * 是否开启多因素验证
   */
  mfaEnabled: boolean

  /**
   * 多因素验证状态
   */
  mfaStatus: UserStatus
}

export type Mfa = {
  secret: string
  account: string
}

interface UserPassword {
  id: string
  createdBy: string
  createdAt: Date
  updatedBy: string
  updatedAt: Date
  userID: string
  scene: "login"
  status: UserStatus
}

type UserIdentityKind = "name" | "email" | "phone" | "wechat" | "qq"
export interface UserIdentity {
  id: string
  createdBy: string
  createdAt: Date
  updatedBy: string
  updatedAt: Date
  userID: string
  kind: UserIdentityKind
  code: string
  codeExtend: string
  status: UserStatus
}

export const EnumUserIdentityKind = {
  name: { text: '用户名' },
  email: { text: '邮件' },
  phone: { text: '手机' },
  wechat: { text: '微信' },
  qq: { text: 'QQ' },
}

export const EnumUserStatus = {
  active: { text: "活跃", status: 'success' },
  inactive: { text: "失活", status: 'default' },
  processing: { text: "处理中", status: 'warning' }
}

export const EnumUserLoginProfileMfaStatus = {
  active: { text: "活跃", status: 'success' },
  inactive: { text: "失活", status: 'default' },
  processing: { text: "处理中", status: 'warning' }
}

export const UserNodeField = `#graphql
      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
      email,mobile,userType,creationType,registerIP,status,comments`;

const UserLoginProfileField = `#graphql
      id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,
      canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus
  `,
  UserIdentityField = `#graphql
      id,createdBy,createdAt,updatedBy,updatedAt,userID,kind,code,codeExtend,status
  `,
  MFANodeField = `#graphql
      secret,account
  `;

export type UpdateUserInfoScene = "create" | "base" | "loginProfile" | "identity" | "recycle"

/**
 * 获取用户信息
 * @param userId 
 * @param headers 
 * @returns 
 */
export async function getUserList(params: TableParams, filter: TableFilter, sort: TableSort) {
  const { where, orderBy } = getGraphqlFilter(params, filter, sort),
    result = await graphqlPageApi(
      `#graphql
          query users($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:UserOrder,$where:UserWhereInput){
              list:users(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                  totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                  edges{                                        
                      cursor,node{                    
                          ${UserNodeField}
                      }
                  }
              }
          }`,
      {
        first: params.pageSize,
        where,
        orderBy,
      },
      params.current
    )

  if (result?.data?.list) {
    return result.data.list as List<User>
  } else {
    return null
  }
}

/**
 * 获取用户信息
 * @param userId 
 * @param headers 
 * @returns 
 */
export async function getUserInfo(userId: string, scene?: UpdateUserInfoScene[], headers?: Record<string, any>) {
  const result = await graphqlApi(
    `#graphql
    query{
      node(id:"${gid("user", userId)}"){
        ... on User{
          ${UserNodeField}
          ${scene?.includes('loginProfile') ? `loginProfile{
            ${UserLoginProfileField}
          }`: ''}
          ${scene?.includes("identity") ? `identities{
            ${UserIdentityField}
          }`: ''}
          
        }
      }
    }`,
    {},
    headers
  )

  if (result?.data?.node) {
    return result?.data?.node as User
  } else {
    return null
  }
}

/**
 * 创建用户信息
 * @param rootOrgID
 * @param input 
 * @returns 
 */
export async function createUserInfo(rootOrgID: string, input: User | Record<string, any>, userType: UserType, setKind: UserLoginProfileSetKind) {
  if (input['password']) {
    const pwd = input['password']
    input.password = {
      scene: "login",
      status: "active",
      password: pwd,
    }
  }

  if (setKind) {
    input.loginProfile = {
      setKind: setKind,
      verifyDevice: false,
    }
  }
  if (!input.status) {
    input.status = "active"
  }
  const result = await graphqlApi(
    `#graphql
    mutation createUser($input: CreateUserInput!){
      action:${userType === 'account' ? "createOrganizationAccount" : "createOrganizationUser"}(
        rootOrgID:"${rootOrgID}",input:$input
      ){
        ${UserNodeField}
      }
    }`,
    { input }
  )

  if (result?.data?.action) {
    return result?.data?.action as User
  } else {
    return null
  }
}


/**
 * 更新用户信息
 * @param userId
 * @param input 
 * @returns 
 */
export async function updateUserInfo(userId: string, input: User) {
  const result = await graphqlApi(
    `#graphql
    mutation updateUser($input: UpdateUserInput!){
      action:updateUser(userID:"${userId}",input:$input){
        ${UserNodeField}
      }
    }`,
    {
      input: setClearInputField(input)
    }
  )

  if (result?.data?.action) {
    return result?.data?.action as User
  } else {
    return null
  }
}

/**
 * 更新用户登录配置
 * @param userId
 * @param input 
 * @returns 
 */
export async function updateUserProfile(userId: string, input: User) {
  const result = await graphqlApi(
    `#graphql
    mutation updateLoginProfile($input: UpdateUserLoginProfileInput!){
      action:updateLoginProfile(userID:"${userId}",input:$input){
        ${UserLoginProfileField}
      }
    }`,
    {
      input: setClearInputField(input)
    }
  )

  if (result?.data?.action) {
    return result?.data?.action as UserLoginProfile
  } else {
    return null
  }
}

/**
 * 绑定用户凭证
 * @param userId
 * @param input 
 * @returns 
 */
export async function bindUserIdentity(userId: string, input: UserIdentity) {
  input.userID = userId
  const result = await graphqlApi(
    `#graphql
    mutation bindUserIdentity($input: CreateUserIdentityInput!){
      action:bindUserIdentity(input:$input){
        ${UserIdentityField}
      }
    }`,
    {
      input: input
    }
  )

  if (result?.data?.action) {
    return result?.data?.action as UserIdentity
  } else {
    return null
  }
}

/**
 * 删除用户凭证
 * @param identityId 
 * @returns 
 */
export async function delUserIdentity(identityId: string) {
  const result = await graphqlApi(
    `#graphql
    mutation deleteUserIdentity{
      action:deleteUserIdentity(id:"${identityId}")
    }`
  )

  if (result?.data?.action) {
    return result?.data?.action as boolean
  } else {
    return null
  }
}

/**
 * 删除用户信息
 * @param userId 
 * @returns 
 */
export async function delUserInfo(userId: string) {
  const result = await graphqlApi(
    `#graphql
      mutation deleteUser{
        action:deleteUser(userID: "${userId}")
      }`)

  if (result?.data?.action) {
    return result?.data?.action as boolean
  } else {
    return null
  }
}

/**
 * 重置用户密码并发送邮件
 * @param userId 
 * @returns 
 */
export async function resetUserPasswordByEmail(userId: string) {
  const result = await graphqlApi(
    `#graphql
      mutation resetUserPasswordByEmail{
        action:resetUserPasswordByEmail(userId: "${userId}")
      }`)

  if (result?.data?.action) {
    return result?.data?.action as boolean
  } else {
    return null
  }
}

/**
 * 更新密码
 * @param oldPwd
 * @param newPwd 
 * @returns 
 */
export async function updatePassword(oldPwd: string, newPwd: string) {
  const result = await graphqlApi(
    `#graphql
    mutation changePassword{
      action:changePassword(oldPwd:"${Sha256(oldPwd).toString()}",newPwd:"${Sha256(newPwd).toString()}")
    }`
  )

  if (result?.data?.action) {
    return result?.data?.action as boolean
  } else {
    return null
  }
}


/**
 * 启用MFA
 * @param userId
 * @returns 
 */
export async function enableMFA(userId: string) {
  const result = await graphqlApi(
    `#graphql
    mutation enableMFA{
      action:enableMFA(userID:"${userId}"){
        ${MFANodeField}
      }
    }`
  )

  if (result?.data?.action) {
    return result?.data?.action as Mfa
  } else {
    return null
  }
}

/**
 * 禁用MFA
 * @param userId
 * @returns 
 */
export async function disableMFA(userId: string) {
  const result = await graphqlApi(
    `#graphql
    mutation disableMFA{
      action:disableMFA(userID:"${userId}")
    }`
  )

  if (result?.data?.action) {
    return result?.data?.action as boolean
  } else {
    return null
  }
}

/**
 * 发送MFA到用户邮箱
 * @param userId
 * @returns 
 */
export async function sendMFAEmail(userId: string) {
  const result = await graphqlApi(
    `#graphql
    mutation sendMFAToUserByEmail{
      action:sendMFAToUserByEmail(userID:"${userId}")
    }`
  )

  if (result?.data?.action) {
    return result?.data?.action as boolean
  } else {
    return null
  }
}


/**
 * 检测权限
 * @param permission  'appCode:action'
 * @returns 
 */
export async function checkPermission(permission: string) {
  const result = await graphqlApi(
    `#graphql
    query{
      action:checkPermission(permission: "${permission}")
    }`
  )

  if (result?.data?.action) {
    return result?.data?.action as boolean
  } else {
    return null
  }
}


/**
 * 获取用户的权限
 * @param where 
 * @returns 
 */
export async function userPermissions(where: Record<string, any>, headers?: Record<string, any>) {
  const result = await graphqlApi(
    `#graphql
    query userPermissions($where: AppActionWhereInput){
      list:userPermissions(where: $where){
        ${AppActionField}
      }
    }`, { where }, headers
  )

  if (result?.data?.list) {
    return result?.data?.list as AppAction[]
  } else {
    return null
  }
}

/**
 * 获取用户授权的菜单
 * @param appCode 
 * @returns 
 */
export async function userMenus(appCode: string) {
  const result = await graphqlApi(
    `#graphql
    query userMenus{
      list:userMenus(appCode: "${appCode}"){
        ${AppMenuField}
      }
    }`
  )

  if (result?.data?.list) {
    return result?.data?.list as AppMenu[]
  } else {
    return null
  }
}

/**
 * 获取用户root组织
 * @returns 
 */
export async function userRootOrgs() {
  const result = await graphqlApi(
    `#graphql
    query userRootOrgs{
      list:userRootOrgs{
        ${OrgNodeField}
      }
    }`
  )

  if (result?.data?.list) {
    return result?.data?.list as Org[]
  } else {
    return null
  }
}


/**
 * 获取回收站用户
 * @param userId 
 * @param headers 
 * @returns 
 */
export async function getRecycleUserList(params: TableParams, filter: TableFilter, sort: TableSort) {
  const { where, orderBy } = getGraphqlFilter(params, filter, sort),
    result = await graphqlPageApi(
      `#graphql
          query orgRecycleUsers($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:UserOrder,$where:UserWhereInput){
              list:orgRecycleUsers(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
                  totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
                  edges{                                        
                      cursor,node{                    
                          ${UserNodeField}
                      }
                  }
              }
          }`,
      {
        first: params.pageSize,
        where,
        orderBy,
      },
      params.current
    )

  if (result?.data?.list) {
    return result.data.list as List<User>
  } else {
    return null
  }
}


/**
 * 恢复回收站用户
 * @param userId
 * @returns 
 */
export async function restoreRecycleUser(userId: string, input: User | Record<string, any>, setKind: UserLoginProfileSetKind) {
  let pwdInput: Record<string, any> | undefined = undefined
  if (setKind === 'customer') {
    pwdInput = {
      scene: "login",
      password: input.password,
      status: "active",
      userID: userId,
    }
    delete input.password
  }
  const result = await graphqlApi(
    `#graphql
    mutation recoverOrgUser($userInput: UpdateUserInput!,$pwdInput: CreateUserPasswordInput){
      action:recoverOrgUser(
        userID:"${userId}",
        pwdKind:${setKind},
        userInput: $userInput,
        pwdInput: $pwdInput
        ){
          ${UserNodeField}
        }
    }`,
    {
      userInput: setClearInputField(input),
      pwdInput,
    }
  )

  if (result?.data?.action?.id) {
    return result?.data?.action as User
  } else {
    return null
  }
}