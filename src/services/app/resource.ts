import { gid } from '@/util';
import { gql } from '@/__generated__';
import { AppResOrder, AppResWhereInput, UpdateAppResInput } from '@/__generated__/graphql';
import { koClient } from '../graphql';

const queryAppResList = gql(/* GraphQL */`query appResList($gid: GID!,$first: Int,$orderBy:AppResOrder,$where:AppResWhereInput){
  node(id:$gid){
    ... on App{
      id,
      list:resources(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern
          }
        }
      }
    }
  }
}`)

const queryAppResInfo = gql(/* GraphQL */`query appResInfo($gid:GID!){
  node(id:$gid){
    ... on AppRes{
      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern
    }
  }
}`)

const mutationUpdateAppRes = gql(/* GraphQL */`mutation updateAppRes($appResId:ID!,$input: UpdateAppResInput!){
  action:updateAppRes(appResID:$appResId,input:$input){id}
}`)


/**
 * 获取应用权限
 * @param appId
 * @returns
 */
export async function getAppResList(
  appId: string,
  gather: {
    current?: number
    pageSize?: number
    where?: AppResWhereInput
    orderBy?: AppResOrder
  }) {
  const koc = koClient(),
    result = await koc.client.query(
      queryAppResList, {
      gid: gid('app', appId),
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, {
      url: `${koc.url}?p=${gather.current || 1}`
    }).toPromise()
  if (result.data?.node?.__typename === 'App') {
    return result.data.node.list
  }
  return null
}


/**
 * 获取应用权限
 * @param appResId
 * @returns
 */
export async function getAppResInfo(appResId: string) {
  const koc = koClient(),
    result = await koc.client.query(
      queryAppResInfo, {
      gid: gid('app_res', appResId),
    }).toPromise()

  if (result.data?.node?.__typename === 'AppRes') {
    return result.data.node
  }
  return null
}


/**
 * 更新
 * @param appResId
 * @param input
 * @returns
 */
export async function updateAppRes(appResId: string, input: UpdateAppResInput) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationUpdateAppRes, {
      appResId,
      input,
    }).toPromise()

  if (result.data?.action?.id) {
    return result.data.action
  }
  return null
}
