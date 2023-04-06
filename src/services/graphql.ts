import { request } from 'ice';
import { gid } from "@/util";
import Sha256 from "crypto-js/sha256";

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
interface App {
  id: string
  name: string
  code: string
  kind: "web" | "native" | "server"
  redirectURI: string
  appKey: string
  appSecret: string
  scopes: string
  tokenValidity: number
  refreshTokenValidity: number
  logo: string
  comments: string
  status: "active" | "inactive" | "processing"
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
}

interface TableParams {
  pageSize: number;
  current: number;
  [appKey: string]: any
}

interface OrderBy {
  direction: "ASC" | "DESC"
  field: string
}
interface List<T> {
  totalCount: number
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor: string
    endCursor: string
  }
  edges: {
    cursor: string
    node: T
  }[]
}


/**
 * 获取用户信息
 * @param userId 
 * @param headers 
 * @returns 
 */
export async function getAppList(params?: TableParams, filter?: any, orderBy?: OrderBy) {
  let where = { ...filter }, pageSize = params?.pageSize, current = params?.current;
  for (let key in params) {
    if (!["pageSize", "current"].includes(key) && !Object.keys(filter).includes(key)) {
      where[key] = params[key]
    }
  }

  for (let key in where) {
    if (Array.isArray(where[key])) {
      where[`${key}In`] = where[key]
      delete where[key]
    }
  }

  const result = await graphqlApi(
    `query apps($orderBy:AppOrder,$where:AppWhereInput){
      list:apps(orderBy: $orderBy,where: $where){
        totalCount,
        pageInfo{hasNextPage,hasPreviousPage,startCursor,endCursor}
        edges{
          cursor
          node{
            id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,refreshTokenValidity,logo,comments,
            status,createdAt
          }
        }
      }
    }`,
    {
      where,
    }
  )

  if (result?.data?.list) {
    return result?.data?.list as List<App>
  } else {
    return null
  }
}

/**
 * 获取GID
 * @param type 
 * @param id 
 * @returns 
 */
export async function getGID(type: string, id: string | number) {
  const result = await graphqlApi(
    `query globalID{
      globalID(type:"${type}",id:"${id}")
    }`,
  )

  if (result?.data?.globalID) {
    return result?.data?.globalID as string
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

/**
 * 基础gql接口
 * @param query 
 * @param variables 
 * @param headers 
 * @returns 
 */
export async function graphqlApi(query: string, variables?: any, headers?: any) {
  return await request({
    url: '/graphql/query',
    method: 'post',
    data: {
      query,
      variables,
    },
    headers
  })
}