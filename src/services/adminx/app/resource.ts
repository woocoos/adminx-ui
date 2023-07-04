import { gid } from '@/util';
import { gql } from '@/__generated__/adminx';
import { AppResOrder, AppResWhereInput, UpdateAppResInput } from '@/__generated__/adminx/graphql';
import { mutationRequest, pagingRequest, queryRequest } from '../';

const queryAppResList = gql(/* GraphQL */`query appResList($gid: GID!,$first: Int,$orderBy:AppResOrder,$where:AppResWhereInput){
  node(id:$gid){
    ... on App{
      id,
      resources(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern
          }
        }
      }
    }
  }
}`);

const queryAppResInfo = gql(/* GraphQL */`query appResInfo($gid:GID!){
  node(id:$gid){
    ... on AppRes{
      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,typeName,arnPattern
    }
  }
}`);

const mutationUpdateAppRes = gql(/* GraphQL */`mutation updateAppRes($appResId:ID!,$input: UpdateAppResInput!){
  updateAppRes(appResID:$appResId,input:$input){id}
}`);


/**
 * 获取应用权限
 * @param appId
 * @returns
 */
export async function getAppResList(
  appId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: AppResWhereInput;
    orderBy?: AppResOrder;
  }) {
  const
    result = await pagingRequest(
      queryAppResList, {
      gid: gid('app', appId),
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, gather.current || 1);

  if (result.data?.node?.__typename === 'App') {
    return result.data.node.resources;
  }
  return null;
}


/**
 * 获取应用权限
 * @param appResId
 * @returns
 */
export async function getAppResInfo(appResId: string) {
  const
    result = await queryRequest(
      queryAppResInfo, {
      gid: gid('app_res', appResId),
    });

  if (result.data?.node?.__typename === 'AppRes') {
    return result.data.node;
  }
  return null;
}


/**
 * 更新
 * @param appResId
 * @param input
 * @returns
 */
export async function updateAppRes(appResId: string, input: UpdateAppResInput) {
  const
    result = await mutationRequest(
      mutationUpdateAppRes, {
      appResId,
      input,
    });

  if (result.data?.updateAppRes?.id) {
    return result.data.updateAppRes;
  }
  return null;
}
