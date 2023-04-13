import { gid } from "@/util";
import Sha256 from "crypto-js/sha256";
import {
  TableParams, graphqlApi, setClearInputField, TableFilter,
  TableSort,
  getGraphqlFilter,
  graphqlPageApi,
  List
} from "../graphql";

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
  identities?: UserIdentity
}

type UserLoginProfileSetKind = "keep" | "customer" | "auto"
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
interface UserIdentity {
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



const
  UserNodeField = `#graphql
      id,createdBy,createdAt,updatedBy,updatedAt,principalName,displayName,
      email,mobile,userType,creationType,registerIP,status,comments`,
  UserLoginProfileField = `#graphql
      id,createdBy,createdAt,updatedBy,updatedAt,userID,lastLoginIP,lastLoginAt,
      canLogin,setKind,passwordReset,verifyDevice,mfaEnabled,mfaStatus
  `

export type UpdateUserInfoScene = "create" | "base" | "loginProfile"

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
export async function createUserInfo(rootOrgID: string, input: User | Record<string, any>, userType: UserType) {
  if (input['password']) {
    input.password = {
      scene: "login",
      password: input['password'],
      status: "active"
    }
    delete input['password']
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
    return result?.data?.action as User
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