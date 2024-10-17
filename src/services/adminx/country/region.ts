import { gql } from '@/generated/adminx';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'
import { gid } from '@knockout-js/api';
import { CreateRegionInput, OrderDirection, RegionOrder, RegionOrderField, RegionWhereInput, TreeAction, UpdateRegionInput } from '@/generated/adminx/graphql';



const queryRegionList = gql(/* GraphQL */`query regionList($first: Int,$orderBy:RegionOrder,$where:RegionWhereInput){
  regions(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt
      }
    }
  }
}`);

const queryRegionInfo = gql(/* GraphQL */`query regionInfo($gid:GID!){
  node(id:$gid){
    ... on Region{
      id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt
    }
  }
}`);


const mutationUpdateRegion = gql(/* GraphQL */`mutation updateRegion($regionId:ID!,$input: UpdateRegionInput!){
  updateRegion(regionID:$regionId,input:$input){
    id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt
  }
}`);

const mutationCreateRegion = gql(/* GraphQL */`mutation createRegion($input: CreateRegionInput!){
  createRegion(input:$input){
    id,countryID,parentID,name,nameEn,shortCode,zipCode,status,displaySort,createdAt
  }
}`);

const mutationDelRegion = gql(/* GraphQL */`mutation delRegion($regionId:ID!){
  deleteRegion(regionID: $regionId)
}`);

const mutationMoveRegion = gql(/* GraphQL */`mutation moveRegion($action:TreeAction!,$sourceId:ID!,$targetId:ID!){
  moveRegion(action: $action,sourceID:$sourceId,targetId:$targetId)
}`);


/**
 * 获取信息
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getRegionList(
  gather: {
    current?: number;
    pageSize?: number;
    where?: RegionWhereInput;
    orderBy?: RegionOrder;
  },
) {
  const
    result = await paging(
      queryRegionList, {
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy ?? {
        direction: OrderDirection.Desc,
        field: RegionOrderField.DisplaySort
      },
    }, gather.current || 1);

  if (result.data?.regions) {
    return result.data.regions;
  }
  return null;
}

/**
 * 获取信息
 * @param id
 * @returns
 */
export async function getRegionInfo(id: string) {
  const
    result = await query(
      queryRegionInfo, {
      gid: gid('region', id),
    });

  if (result.data?.node?.__typename === "Region") {
    return result.data.node;
  }
  return null;
}


/**
 * 创建
 * @param input
 * @returns
 */
export async function createRegionInfo(input: CreateRegionInput) {
  const
    result = await mutation(
      mutationCreateRegion, {
      input,
    });

  if (result.data?.createRegion?.id) {
    return result.data.createRegion;
  }
  return null;
}


/**
 * 更新
 * @param regionId
 * @param input
 * @returns
 */
export async function updateRegionInfo(regionId: string, input: UpdateRegionInput) {
  const
    result = await mutation(
      mutationUpdateRegion, {
      regionId,
      input,
    });

  if (result.data?.updateRegion?.id) {
    return result.data.updateRegion;
  }
  return null;
}

/**
 * 删除
 * @param regionId
 * @returns
 */
export async function delRegionInfo(regionId: string) {
  const
    result = await mutation(
      mutationDelRegion, {
      regionId,
    });

  if (result.data?.deleteRegion) {
    return result.data.deleteRegion;
  }
  return null;
}

/**
 * 移动
 * @param sourceId
 * @param targetId
 * @param action
 * @returns
 */
export async function moveRegionInfo(sourceId: string, targetId: string, action: TreeAction) {
  const
    result = await mutation(
      mutationMoveRegion, {
      action,
      sourceId,
      targetId,
    });

  if (result.data?.moveRegion) {
    return result.data.moveRegion;
  }
  return null;
}

