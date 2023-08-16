import { gql } from '@/generated/adminx';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'
import { AppMenuOrder, AppMenuOrderField, AppMenuWhereInput, CreateAppMenuInput, OrderDirection, TreeAction, UpdateAppMenuInput } from '@/generated/adminx/graphql';
import { gid } from '@knockout-js/api';

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
  updateAppMenu(menuID:$menuId,input:$input){id}
}`);

const mutationCreateAppMenu = gql(/* GraphQL */`mutation createAppMenu($appId:ID!,$input: [CreateAppMenuInput!]){
  createAppMenus(appID:$appId,input:$input){id}
}`);

const mutationDelAppMenu = gql(/* GraphQL */`mutation delAppMenu($menuId:ID!){
  deleteAppMenu(menuID: $menuId)
}`);

const mutationMoveAppMenu = gql(/* GraphQL */`mutation moveAppMenu($sourceId:ID!,$targetId:ID!,$action:TreeAction!){
  moveAppMenu(sourceID:$sourceId,targetID:$targetId,action:$action)
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
  const
    result = await paging(
      queryAppMenuList, {
      gid: gid('app', appId),
      first: gather.pageSize,
      where: gather.where,
      orderBy: gather.orderBy || {
        direction: OrderDirection.Asc,
        field: AppMenuOrderField.DisplaySort,
      },
    }, gather.current || 1);

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
  const
    result = await mutation(
      mutationUpdateAppMenu, {
      menuId,
      input,
    });

  if (result.data?.updateAppMenu?.id) {
    return result.data.updateAppMenu;
  }
  return null;
}

/**
 * 创建应用菜单
 * @param input
 * @returns
 */
export async function createAppMenu(appId: string, input: CreateAppMenuInput | CreateAppMenuInput[]) {
  const
    result = await mutation(
      mutationCreateAppMenu, {
      appId,
      input,
    });

  if (result.data?.createAppMenus) {
    return result.data.createAppMenus;
  }
  return null;
}

/**
 * 删除应用菜单
 * @param appId
 * @returns
 */
export async function delAppMenu(menuId: string) {
  const
    result = await mutation(
      mutationDelAppMenu, {
      menuId,
    });

  if (result.data?.deleteAppMenu) {
    return result.data.deleteAppMenu;
  }
  return null;
}


/**
 * 菜单位置移动
 * @param input
 * @returns
 */
export async function moveAppMenu(sourceId: string, targetId: string, action: TreeAction) {
  const
    result = await mutation(
      mutationMoveAppMenu, {
      sourceId,
      targetId,
      action,
    });

  if (result.data?.moveAppMenu) {
    return result.data.moveAppMenu;
  }
  return null;
}
