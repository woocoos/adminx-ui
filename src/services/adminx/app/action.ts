import { gql } from '@/generated/adminx';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'
import { AppActionOrder, AppActionWhereInput, CreateAppActionInput, UpdateAppActionInput } from '@/generated/adminx/graphql';
import { gid } from '@knockout-js/api';

export const EnumAppActionKind = {
  restful: { text: 'restful' },
  graphql: { text: 'graphql' },
  rpc: { text: 'rpc' },
  route: { text: 'route' },
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
      actions(first:$first,orderBy: $orderBy,where: $where){
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
  createAppActions(appID:$appId,input:$input){id}
}`);

const mutationUpdateAppAction = gql(/* GraphQL */`mutation updateAppAction($appActionId:ID!,$input: UpdateAppActionInput!){
  updateAppAction(actionID:$appActionId,input:$input){id}
}`);

const mutationDelAppAction = gql(/* GraphQL */`mutation delAppAction($appActionId:ID!){
  deleteAppAction(actionID: $appActionId)
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
  const
    result = await paging(
      queryAppActionList, {
      gid: gid('app', appId),
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy,
    }, gather.current || 1);

  if (result.data?.node?.__typename === 'App') {
    return result.data.node.actions;
  }
  return null;
}


/**
 * 获取应用权限
 * @param appActionId
 * @returns
 */
export async function getAppActionInfo(appActionId: string) {
  const
    result = await query(
      queryAppActionInfo, {
      gid: gid('app_action', appActionId),
    });

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
  const
    result = await mutation(
      mutationCreateAppAction, {
      appId,
      input,
    });

  if (result.data?.createAppActions) {
    return result.data.createAppActions;
  }
  return null;
}

/**
 * 更新
 * @param appActionId
 * @param input
 * @returns
 */
export async function updateAppAction(appActionId: string, input: UpdateAppActionInput) {
  const
    result = await mutation(
      mutationUpdateAppAction, {
      appActionId,
      input,
    });

  if (result.data?.updateAppAction?.id) {
    return result.data.updateAppAction;
  }
  return null;
}

/**
 * 删除
 * @param appActionId
 * @returns
 */
export async function delAppAction(appActionId: string) {
  const
    result = await mutation(
      mutationDelAppAction, {
      appActionId,
    });

  if (result.data?.deleteAppAction) {
    return result.data.deleteAppAction;
  }
  return null;
}
