import { gql } from "@/generated/adminx";
import { AppDictOrder, AppDictOrderField, AppDictWhereInput, CreateAppDictInput, CreateAppDictItemInput, OrderDirection, TreeAction, UpdateAppDictInput, UpdateAppDictItemInput } from "@/generated/adminx/graphql";
import { gid } from "@knockout-js/api";
import { mutation, paging, query } from "@knockout-js/ice-urql/request";

export const EnumAppDictItemStatus = {
  active: { text: 'active', status: 'success' },
  inactive: { text: 'inactive', status: 'default' },
  disabled: { text: 'disabled', status: 'default' },
  processing: { text: 'processing', status: 'warning' },
};

const appDictListQuery = gql(/* GraphQL */`query appDictList($first: Int,$orderBy:AppDictOrder,$where:AppDictWhereInput){
  appDicts(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,
        app{id,name}
      }
    }
  }
}`);

const appDictInfoQuery = gql(/* GraphQL */`query appDictInfo($gid:GID!){
  node(id:$gid){
   ... on AppDict{
       id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,
       app{id,name}
     }
   }
 }`);

const appDictItemListQuery = gql(/* GraphQL */`query appDictItemList($gid:GID!){
  node(id:$gid){
   ... on AppDict{
       id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,
       items{
        id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,
        org{ id,name }
       }
     }
   }
 }`);

const appDictItemInfoQuery = gql(/* GraphQL */`query appDictItemInfo($gid:GID!){
  node(id:$gid){
   ... on AppDictItem{
      id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,
      org{ id,name }
     }
   }
 }`);

const mutationUpdateAppDict = gql(/* GraphQL */`mutation updateAppDict($dictId:ID!,$input: UpdateAppDictInput!){
  updateAppDict(dictID:$dictId,input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,
    app{id,name}
  }
}`);

const mutationCreateAppDict = gql(/* GraphQL */`mutation createAppDict($appId:ID!,$input: CreateAppDictInput!){
  createAppDict(appID:$appId,input:$input){
    id,createdBy,createdAt,updatedBy,updatedAt,appID,code,name,comments,
    app{id,name}
   }
}`);

const mutationDelAppDict = gql(/* GraphQL */`mutation deleteAppDict($dictId:ID!){
  deleteAppDict(dictID: $dictId)
}`);

const mutationUpdateAppDictItem = gql(/* GraphQL */`mutation updateAppDictItem($itemId:ID!,$input:  UpdateAppDictItemInput!){
  updateAppDictItem(itemID:$itemId,input:$input){
    id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,
    org{ id,name }
  }
}`);

const mutationCreateAppDictItem = gql(/* GraphQL */`mutation createAppDictItem($dictId:ID!,$input: CreateAppDictItemInput!){
  createAppDictItem(dictID:$dictId,input:$input){
    id,name,code,orgID,createdBy,createdAt,dictID,comments,displaySort,status,
    org{ id,name }
  }
}`);

const mutationDelAppDictItem = gql(/* GraphQL */`mutation deleteAppDictItem($itemId:ID!){
  deleteAppDictItem(itemID: $itemId)
}`);

const mutationMoveAppDictItem = gql(/* GraphQL */`mutation moveAppDictItem($sourceId:ID!,$targetId:ID!,$action:TreeAction!){
  moveAppDictItem(sourceID: $sourceId,targetID:$targetId,action:$action)
}`);


/**
 * 获取字典列表
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getAppDictList(
  gather: {
    current?: number;
    pageSize?: number;
    where?: AppDictWhereInput;
    orderBy?: AppDictOrder;
  },
) {
  const
    result = await paging(
      appDictListQuery, {
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy ?? {
        direction: OrderDirection.Desc,
        field: AppDictOrderField.CreatedAt
      },
    }, gather.current || 1);

  if (result.data?.appDicts) {
    return result.data.appDicts;
  }
  return null;
}

/**
 * 获取字典详情
 * @param appDictId
 * @returns
 */
export async function getAppDictInfo(appDictId: string) {
  const
    result = await query(
      appDictInfoQuery, {
      gid: gid('app_dict', appDictId),
    });

  if (result.data?.node?.__typename === "AppDict") {
    return result.data.node;
  }
  return null;
}

/**
 * 创建字典详情
 * @param appId
 * @param input
 * @returns
 */
export async function createAppDictInfo(appId: string, input: CreateAppDictInput) {
  const
    result = await mutation(
      mutationCreateAppDict, {
      appId,
      input,
    });

  if (result.data?.createAppDict?.id) {
    return result.data.createAppDict;
  }
  return null;
}

/**
 * 更新字典详情
 * @param dictId
 * @param input
 * @returns
 */
export async function updateAppDictInfo(dictId: string, input: UpdateAppDictInput) {
  const
    result = await mutation(
      mutationUpdateAppDict, {
      dictId,
      input,
    });

  if (result.data?.updateAppDict?.id) {
    return result.data.updateAppDict;
  }
  return null;
}

/**
 * 移除字典详情
 * @param dictId
 * @returns
 */
export async function delAppDictInfo(dictId: string) {
  const
    result = await mutation(
      mutationDelAppDict, {
      dictId,
    });

  if (result.data?.deleteAppDict) {
    return result.data.deleteAppDict;
  }
  return null;
}




/**
 * 获取字典项列表
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getAppDictItemList(
  appDictId: string,
) {
  const
    result = await query(
      appDictItemListQuery, {
      gid: gid('app_dict', appDictId)
    });

  if (result.data?.node?.__typename === 'AppDict') {
    return result.data.node;
  }
  return null;
}

/**
 * 获取字典项详情
 * @param appDictItemId
 * @returns
 */
export async function getAppDictItemInfo(appDictItemId: string) {
  const
    result = await query(
      appDictItemInfoQuery, {
      gid: gid('app_dict_item', appDictItemId),
    });

  if (result.data?.node?.__typename === "AppDictItem") {
    return result.data.node;
  }
  return null;
}

/**
 * 创建字典项详情
 * @param dictId
 * @param input
 * @returns
 */
export async function createAppDictItemInfo(dictId: string, input: CreateAppDictItemInput) {
  const
    result = await mutation(
      mutationCreateAppDictItem, {
      dictId,
      input,
    });

  if (result.data?.createAppDictItem?.id) {
    return result.data.createAppDictItem;
  }
  return null;
}

/**
 * 更新字典项详情
 * @param itemId
 * @param input
 * @returns
 */
export async function updateAppDictItemInfo(itemId: string, input: UpdateAppDictItemInput) {
  const
    result = await mutation(
      mutationUpdateAppDictItem, {
      itemId,
      input,
    });

  if (result.data?.updateAppDictItem?.id) {
    return result.data.updateAppDictItem;
  }
  return null;
}

/**
 * 移除字典项详情
 * @param itemId
 * @returns
 */
export async function delAppDictItemInfo(itemId: string) {
  const
    result = await mutation(
      mutationDelAppDictItem, {
      itemId,
    });

  if (result.data?.deleteAppDictItem) {
    return result.data.deleteAppDictItem;
  }
  return null;
}

/**
 * 移动字典项
 * @param itemId
 * @returns
 */
export async function moveAppDictItemInfo(
  sourceId: string,
  targetId: string,
  action: TreeAction) {
  const
    result = await mutation(
      mutationMoveAppDictItem, {
      sourceId,
      targetId,
      action,
    });

  if (result.data?.moveAppDictItem) {
    return result.data.moveAppDictItem;
  }
  return null;
}
