import { gql } from '@/generated/adminx';
import { AppOrder, AppOrderField, AppWhereInput, CreateAppInput, OrderDirection, UpdateAppInput } from '@/generated/adminx/graphql';
import { gid } from '@knockout-js/api';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'

export const EnumAppStatus = {
  active: { text: 'active', status: 'success' },
  inactive: { text: 'inactive', status: 'default' },
  disabled: { text: 'disabled', status: 'default' },
  processing: { text: 'processing', status: 'warning' },
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
  updateApp(appID:$appId,input:$input){
    id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,
    refreshTokenValidity,logo,comments,status,createdAt
  }
}`);

const mutationCreateApp = gql(/* GraphQL */`mutation createApp($input: CreateAppInput!){
  createApp(input:$input){
    id,name,code,kind,redirectURI,appKey,appSecret,scopes,tokenValidity,
    refreshTokenValidity,logo,comments,status,createdAt
  }
}`);

const mutationDelApp = gql(/* GraphQL */`mutation delApp($appId:ID!){
  deleteApp(appID: $appId)
}`);

const queryAppAccess = gql(/* GraphQL */`query appAccess($appCode: String!){
  appAccess( appCode: $appCode )
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
    result = await paging(
      queryAppList, {
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy ?? {
        direction: OrderDirection.Desc,
        field: AppOrderField.CreatedAt
      },
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
    result = await query(
      queryAppInfo, {
      gid: gid('app', appId),
    });

  if (result.data?.node?.__typename === 'App') {
    return result.data.node;
  }
  return null;
}

/**
 * 获取应用信息
 * @param appCode
 * @returns
 */
export async function appAccess(appCode: string, headers?: Record<string, string>) {
  const
    result = await query(
      queryAppAccess, {
      appCode,
    }, {
      fetchOptions: { headers },
    });

  if (result.data?.appAccess) {
    return result.data.appAccess;
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
    result = await mutation(
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
    result = await mutation(
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
    result = await mutation(
      mutationDelApp, {
      appId,
    });

  if (result.data?.deleteApp) {
    return result.data.deleteApp;
  }
  return null;
}

