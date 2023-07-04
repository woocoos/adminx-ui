import { gql } from '@/__generated__/adminx';
import { AppOrder, AppWhereInput, CreateAppInput, UpdateAppInput } from '@/__generated__/adminx/graphql';
import { gid } from '@/util';
import { mutationRequest, pagingRequest, queryRequest } from '../';

export const EnumAppStatus = {
  active: { text: '活跃', status: 'success' },
  inactive: { text: '失活', status: 'default' },
  processing: { text: '处理中', status: 'warning' },
};

export const EnumAppKind = {
  web: { text: 'web' },
  native: { text: 'native' },
  server: { text: 'server' },
};


const queryAppList = gql(/* GraphQL */`query appList($first: Int,$orderBy:AppOrder,$where:AppWhereInput){
  apps(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,
        refreshTokenValidity,logo,comments,status,createdAt
      }
    }
  }
}`);

const queryAppInfo = gql(/* GraphQL */`query appInfo($gid:GID!){
  node(id:$gid){
    ... on App{
      id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,
      refreshTokenValidity,logo,comments,status,createdAt
    }
  }
}`);

const mutationUpdateApp = gql(/* GraphQL */`mutation updateApp($appId:ID!,$input: UpdateAppInput!){
  updateApp(appID:$appId,input:$input){id}
}`);

const mutationCreateApp = gql(/* GraphQL */`mutation createApp($input: CreateAppInput!){
  createApp(input:$input){ id }
}`);

const mutationDelApp = gql(/* GraphQL */`mutation delApp($appId:ID!){
  deleteApp(appID: $appId)
}`);

/**
 * 获取应用信息
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getAppList(
  gather: {
    current?: number;
    pageSize?: number;
    where?: AppWhereInput;
    orderBy?: AppOrder;
  },
) {
  const
    result = await pagingRequest(
      queryAppList, {
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, gather.current || 1);

  if (result.data?.apps) {
    return result.data.apps;
  }
  return null;
}

/**
 * 获取应用信息
 * @param appId
 * @returns
 */
export async function getAppInfo(appId: string) {
  const
    result = await queryRequest(
      queryAppInfo, {
      gid: gid('app', appId),
    });

  if (result.data?.node?.__typename === 'App') {
    return result.data.node;
  }
  return null;
}

/**
 * 更新应用信息
 * @param appId
 * @param input
 * @returns
 */
export async function updateAppInfo(appId: string, input: UpdateAppInput) {
  const
    result = await mutationRequest(
      mutationUpdateApp, {
      appId,
      input,
    });

  if (result.data?.updateApp?.id) {
    return result.data.updateApp;
  }
  return null;
}

/**
 * 创建应用信息
 * @param input
 * @returns
 */
export async function createAppInfo(input: CreateAppInput) {
  const
    result = await mutationRequest(
      mutationCreateApp, {
      input,
    });

  if (result.data?.createApp?.id) {
    return result.data.createApp;
  }
  return null;
}

/**
 * 删除应用信息
 * @param appId
 * @returns
 */
export async function delAppInfo(appId: string) {
  const
    result = await mutationRequest(
      mutationDelApp, {
      appId,
    });

  if (result.data?.deleteApp) {
    return result.data.deleteApp;
  }
  return null;
}

