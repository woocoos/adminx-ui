import { gql } from '@/__generated__/knockout';
import { gid } from '@/util';
import { koClient } from '../';
import { AppActionOrder, AppActionWhereInput, CreateAppActionInput, UpdateAppActionInput } from '@/__generated__/knockout/graphql';

export const EnumAppActionKind = {
  restful: { text: 'restful' },
  graphql: { text: 'graphql' },
  rpc: { text: 'rpc' },
  function: { text: 'function' },
};

export const EnumAppActionMethod = {
  read: { text: 'read' },
  write: { text: 'write' },
  list: { text: 'list' },
};

const queryAppActionList = gql(/* GraphQL */`query appActionList($gid: GID!,$first: Int,$orderBy:AppActionOrder,$where:AppActionWhereInput){
  node(id:$gid){
    ... on App{
      id,
      list:actions(first:$first,orderBy: $orderBy,where: $where){
        totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
        edges{
          cursor,node{
            id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments
          }
        }
      }
    }
  }
}`);

const queryAppActionInfo = gql(/* GraphQL */`query AppActionInfo($gid:GID!){
  node(id:$gid){
    ... on AppAction{
      id,createdBy,createdAt,updatedBy,updatedAt,appID,name,kind,method,comments
    }
  }
}`);

const mutationCreateAppAction = gql(/* GraphQL */`mutation createAppAction($appId:ID!,$input: [CreateAppActionInput!]){
  action:createAppActions(appID:$appId,input:$input){id}
}`);

const mutationUpdateAppAction = gql(/* GraphQL */`mutation updateAppAction($appActionId:ID!,$input: UpdateAppActionInput!){
  action:updateAppAction(actionID:$appActionId,input:$input){id}
}`);

const mutationDelAppAction = gql(/* GraphQL */`mutation delAppAction($appActionId:ID!){
  action:deleteAppAction(actionID: $appActionId)
}`);

/**
 * 获取应用权限
 * @param appId
 * @returns
 */
export async function getAppActionList(
  appId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: AppActionWhereInput;
    orderBy?: AppActionOrder;
  }) {
  const koc = koClient(),
    result = await koc.client.query(
      queryAppActionList, {
      gid: gid('app', appId),
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, {
      url: `${koc.url}?p=${gather.current || 1}`,
    }).toPromise();

  if (result.data?.node?.__typename === 'App') {
    return result.data.node.list;
  }
  return null;
}


/**
 * 获取应用权限
 * @param appActionId
 * @returns
 */
export async function getAppActionInfo(appActionId: string) {
  const koc = koClient(),
    result = await koc.client.query(
      queryAppActionInfo, {
      gid: gid('app_action', appActionId),
    }).toPromise();

  if (result.data?.node?.__typename === 'AppAction') {
    return result.data.node;
  }
  return null;
}


/**
 * 创建
 * @param input
 * @returns
 */
export async function createAppAction(appId: string, input: CreateAppActionInput | CreateAppActionInput[]) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationCreateAppAction, {
      appId,
      input,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
  }
  return null;
}

/**
 * 创建
 * @param input
 * @returns
 */
export async function createAppActions() {
}

/**
 * 更新
 * @param appActionId
 * @param input
 * @returns
 */
export async function updateAppAction(appActionId: string, input: UpdateAppActionInput) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationUpdateAppAction, {
      appActionId,
      input,
    }).toPromise();

  if (result.data?.action?.id) {
    return result.data.action;
  }
  return null;
}

/**
 * 删除
 * @param appActionId
 * @returns
 */
export async function delAppAction(appActionId: string) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationDelAppAction, {
      appActionId,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
  }
  return null;
}
