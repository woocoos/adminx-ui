import { gid } from '@/util';
import { TableParams, graphqlApi, getGraphqlFilter, TableSort, setClearInputField, List, graphqlPageApi, TableFilter } from '../graphql';
import { AppMenu } from './menu';

export type AppKind = 'web' | 'native' | 'server';
export type AppStatus = 'active' | 'inactive' | 'processing';

export interface App {
  id: string;
  name: string;
  code: string;
  kind: AppKind;
  redirectURI: string;
  appKey: string;
  appSecret: string;
  scopes: string;
  tokenValidity: number;
  refreshTokenValidity: number;
  logo: string;
  comments: string;
  status: AppStatus;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  menus?: List<AppMenu>;
}

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


export const AppNodeField = `
  id,name,code,kind,redirectURI,appKey,appSecret,
  scopes,tokenValidity,refreshTokenValidity,logo,comments,
  status,createdAt
`;

/**
 * 获取应用信息
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getAppList(params: TableParams, filter: TableFilter, sort: TableSort) {
  const { where, orderBy } = getGraphqlFilter(params, filter, sort),
    result = await graphqlPageApi(
      `query apps($after: Cursor,$first: Int,$before: Cursor,$last: Int,$orderBy:AppOrder,$where:AppWhereInput){
        list:apps(after:$after,first:$first,before:$before,last:$last,orderBy: $orderBy,where: $where){
          totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
          edges{
            cursor,node{
              ${AppNodeField}
            }
          }
        }
      }`,
      {
        first: params.pageSize,
        where,
        orderBy,
      },
      params.current,
    );

  if (result?.data?.list) {
    return result.data.list as List<App>;
  } else {
    return null;
  }
}

/**
 * 获取应用信息
 * @param appId
 * @returns
 */
export async function getAppInfo(appId: string) {
  const appGid = gid('app', appId);
  const result = await graphqlApi(
    `query {
      node(id:"${appGid}"){
        ... on App{
          ${AppNodeField}
        }
      }
    }`);

  if (result?.data?.node) {
    return result?.data?.node as App;
  } else {
    return null;
  }
}

/**
 * 更新应用信息
 * @param appId
 * @param input
 * @returns
 */
export async function updateAppInfo(appId: string, input: App | Record<string, any>) {
  delete input['code'];
  const result = await graphqlApi(
    `mutation updateApp($input: UpdateAppInput!){
      action:updateApp(appID:"${appId}",input:$input){
        ${AppNodeField}
      }
    }`, { input: setClearInputField(input) });

  if (result?.data?.action) {
    return result?.data?.action as App;
  } else {
    return null;
  }
}

/**
 * 创建应用信息
 * @param input
 * @returns
 */
export async function createAppInfo(input: App) {
  const result = await graphqlApi(
    `mutation createApp($input: CreateAppInput!){
      action:createApp(input:$input){
        ${AppNodeField}
      }
    }`, { input });

  if (result?.data?.action) {
    return result?.data?.action as App;
  } else {
    return null;
  }
}

/**
 * 删除应用信息
 * @param appId
 * @returns
 */
export async function delAppInfo(appId: string) {
  const result = await graphqlApi(
    `mutation deleteApp{
      action:deleteApp(appID: "${appId}")
    }`);

  if (result?.data?.action) {
    return result?.data?.action as boolean;
  } else {
    return null;
  }
}

