import { gid } from '@/util';
import { gql } from '@/__generated__/knockout';
import { koClient } from '../graphql';
import { AppMenuOrder, AppMenuOrderField, AppMenuWhereInput, CreateAppMenuInput, OrderDirection, TreeAction, UpdateAppMenuInput } from '@/__generated__/knockout/graphql';

const queryAppMenuList = gql(/* GraphQL */`query appMenuList($gid:GID!,$first: Int,$where: AppMenuWhereInput,$orderBy: AppMenuOrder){
  node(id:$gid){
    ... on App{
      id
      menus(first:$first,where:$where,orderBy:$orderBy){
        totalCount,
        edges{
          cursor,node{
            id,appID,parentID,kind,name,actionID,comments,displaySort,icon,route
            action{ id,name }
          }
        }
      }
    }
  }
}`);

const mutationUpdateAppMenu = gql(/* GraphQL */`mutation updateAppMenu($menuId:ID!,$input: UpdateAppMenuInput!){
  action:updateAppMenu(menuID:$menuId,input:$input){id}
}`);

const mutationCreateAppMenu = gql(/* GraphQL */`mutation createAppMenu($appId:ID!,$input: [CreateAppMenuInput!]){
  action:createAppMenus(appID:$appId,input:$input){id}
}`);

const mutationDelAppMenu = gql(/* GraphQL */`mutation delAppMenu($menuId:ID!){
  action:deleteAppMenu(menuID: $menuId)
}`);

const mutationMoveAppMenu = gql(/* GraphQL */`mutation moveAppMenu($sourceId:ID!,$targetId:ID!,$action:TreeAction!){
  action:moveAppMenu(sourceID:$sourceId,targetID:$targetId,action:$action)
}`);

/**
 * 获取应用菜单
 * @param appId
 * @returns
 */
export async function getAppMenus(
  appId: string,
  gather: {
    current?: number;
    pageSize?: number;
    where?: AppMenuWhereInput;
    orderBy?: AppMenuOrder;
  }) {
  const koc = koClient(),
    result = await koc.client.query(
      queryAppMenuList, {
      gid: gid('app', appId),
      first: gather.pageSize,
      where: gather.where,
      orderBy: gather.orderBy || {
        direction: OrderDirection.Asc,
        field: AppMenuOrderField.DisplaySort,
      },
    }, {
      url: `${koc.url}?p=${gather.current || 1}`,
    }).toPromise();

  if (result.data?.node?.__typename === 'App') {
    return result.data.node.menus;
  }
  return null;
}


/**
 * 更新应用菜单
 * @param appId
 * @param input
 * @returns
 */
export async function updateAppMenu(menuId: string, input: UpdateAppMenuInput) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationUpdateAppMenu, {
      menuId,
      input,
    }).toPromise();

  if (result.data?.action?.id) {
    return result.data.action;
  }
  return null;
}

/**
 * 创建应用菜单
 * @param input
 * @returns
 */
export async function createAppMenu(appId: string, input: CreateAppMenuInput | CreateAppMenuInput[]) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationCreateAppMenu, {
      appId,
      input,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
  }
  return null;
}

/**
 * 删除应用菜单
 * @param appId
 * @returns
 */
export async function delAppMenu(menuId: string) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationDelAppMenu, {
      menuId,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
  }
  return null;
}


/**
 * 菜单位置移动
 * @param input
 * @returns
 */
export async function moveAppMenu(sourceId: string, targetId: string, action: TreeAction) {
  const koc = koClient(),
    result = await koc.client.mutation(
      mutationMoveAppMenu, {
      sourceId,
      targetId,
      action,
    }).toPromise();

  if (result.data?.action) {
    return result.data.action;
  }
  return null;
}
