import { gid } from "@/util";
import Sha256 from "crypto-js/sha256";
import { graphqlApi, setClearInputField } from "../graphql";

export interface User {
  id: string
  principalName: string
  displayName: string
  email: string
  mobile: string
  userType: "account" | "member"
  creationType: "invitation" | "register" | "manual"
  registerIP: string
  status: "active" | "inactive" | "processing"
  comments: string
  loginProfile?: UserLoginProfile
}
export interface UserLoginProfile {
  id: string
  createdBy: number
  createdAt: Date
  updatedBy: number
  updatedAt: Date
  userID: string
  lastLoginIP: string
  /**
   * 最后登陆时间
   */
  lastLoginAt: Date
  /**
   * 是否允许使用密码登陆控制台
   */
  canLogin: boolean
  /**
   * 设置密码:keep-保持不变,customer-客户自行设置,auto-自动生成
   */
  setKind: "keep" | "customer" | "auto"
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
  mfaStatus: "active" | "inactive" | "processing"
}


/**
 * 获取用户信息
 * @param userId 
 * @param headers 
 * @returns 
 */
export async function getUserInfo(userId: string, headers?: any) {
  const result = await graphqlApi(
    `#graphql
    query{
      node(id:"${gid("user", userId)}"){
        ... on User{
          id,displayName,email,mobile,comments,
          loginProfile{
            id,passwordReset
          }
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
 * 更新用户信息
 * @param userId
 * @param input 
 * @returns 
 */
export async function updateUserInfo(userId: string, input: User | any) {
  const result = await graphqlApi(
    `#graphql
    mutation updateUser($input: UpdateUserInput!){
      action:updateUser(userID:"${userId}",input:$input){
        id,displayName,email,mobile,comments
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