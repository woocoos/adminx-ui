import { gid } from "@/util";
import Sha256 from "crypto-js/sha256";
import { graphqlApi } from "../graphql";

interface User {
    id: string
    displayName: string
    email: string
    mobile: string
    comments: string
    loginProfile: {
        passwordReset: boolean
    }
}


/**
 * 获取用户信息
 * @param userId 
 * @param headers 
 * @returns 
 */
export async function getUserInfo(userId: string, headers?: any) {
    const result = await graphqlApi(
        `query{
          node(id:"${gid("user", userId)}"){
            ... on User{
              id,displayName,email,mobile,comments,
              loginProfile{
                passwordReset
              }
            }
          }
        }`, {}, headers)

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
export async function updateUserInfo(userId: string, input: User) {
    const result = await graphqlApi(
        `mutation updateUser($input: UpdateUserInput!){
          action:updateUser(userID:"${userId}",input:$input){
            id,displayName,email,mobile,comments
          }
        }`, { input })

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
        `mutation changePassword{
          action:changePassword(oldPwd:"${Sha256(oldPwd).toString()}",newPwd:"${Sha256(newPwd).toString()}")
        }`)

    if (result?.data?.action) {
        return result?.data?.action as boolean
    } else {
        return null
    }
}