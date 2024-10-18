import { gql } from '@/generated/adminx';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'
import { gid } from '@knockout-js/api';
import { CountryOrder, CountryOrderField, CountryWhereInput, CreateCountryInput, ListAction, OrderDirection, UpdateCountryInput } from '@/generated/adminx/graphql';

export const EnumCountryStatus = {
  active: { text: 'active', status: 'success' },
  inactive: { text: 'inactive', status: 'default' },
  disabled: { text: 'disabled', status: 'default' },
  processing: { text: 'processing', status: 'warning' },
};

const queryCountryList = gql(/* GraphQL */`query countryList($first: Int,$orderBy:CountryOrder,$where:CountryWhereInput){
  countries(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,name,nameEn,code,status,displaySort,createdAt
      }
    }
  }
}`);

const queryCountryInfo = gql(/* GraphQL */`query countryInfo($gid:GID!){
  node(id:$gid){
    ... on Country{
      id,name,nameEn,code,status,displaySort,createdAt
    }
  }
}`);

const mutationUpdateCountry = gql(/* GraphQL */`mutation updateCountry($countryId:ID!,$input: UpdateCountryInput!){
  updateCountry(countryID:$countryId,input:$input){
    id,name,nameEn,code,status,displaySort,createdAt
  }
}`);

const mutationCreateCountry = gql(/* GraphQL */`mutation createCountry($input: CreateCountryInput!){
  createCountry(input:$input){
    id,name,nameEn,code,status,displaySort,createdAt
  }
}`);

const mutationDelCountry = gql(/* GraphQL */`mutation delCountry($countryId:ID!){
  deleteCountry(countryID: $countryId)
}`);

const mutationMoveCountry = gql(/* GraphQL */`mutation moveCountry($action:ListAction!,$sourceId:ID!,$targetId:ID!){
  moveCountry(action: $action,sourceID:$sourceId,targetId:$targetId)
}`);



/**
 * 获取信息
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getCountryList(
  gather: {
    current?: number;
    pageSize?: number;
    where?: CountryWhereInput;
    orderBy?: CountryOrder;
  },
) {
  const
    result = await paging(
      queryCountryList, {
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy ?? {
        direction: OrderDirection.Desc,
        field: CountryOrderField.DisplaySort
      },
    }, gather.current || 1);

  if (result.data?.countries) {
    return result.data.countries;
  }
  return null;
}

/**
 * 获取缓存信息
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getCacheCountryList(
  gather: {
    current?: number;
    pageSize?: number;
    where?: CountryWhereInput;
    orderBy?: CountryOrder;
  },
) {
  const
    result = await paging(
      queryCountryList, {
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy ?? {
        direction: OrderDirection.Desc,
        field: CountryOrderField.DisplaySort
      },
    }, gather.current || 1, {
      requestPolicy: "cache-first"
    });

  if (result.data?.countries) {
    return result.data.countries;
  }
  return null;
}


/**
 * 获取信息
 * @param id
 * @returns
 */
export async function getCountryInfo(id: string) {
  const
    result = await query(
      queryCountryInfo, {
      gid: gid('country', id),
    });

  if (result.data?.node?.__typename === "Country") {
    return result.data.node;
  }
  return null;
}


/**
 * 创建
 * @param input
 * @returns
 */
export async function createCountryInfo(input: CreateCountryInput) {
  const
    result = await mutation(
      mutationCreateCountry, {
      input,
    });

  if (result.data?.createCountry?.id) {
    return result.data.createCountry;
  }
  return null;
}


/**
 * 更新
 * @param countryId
 * @param input
 * @returns
 */
export async function updateCountryInfo(countryId: string, input: UpdateCountryInput) {
  const
    result = await mutation(
      mutationUpdateCountry, {
      countryId,
      input,
    });

  if (result.data?.updateCountry?.id) {
    return result.data.updateCountry;
  }
  return null;
}

/**
 * 删除
 * @param countryId
 * @returns
 */
export async function delCountryInfo(countryId: string) {
  const
    result = await mutation(
      mutationDelCountry, {
      countryId,
    });

  if (result.data?.deleteCountry) {
    return result.data.deleteCountry;
  }
  return null;
}

/**
 * 移动
 * @param action
 * @param sourceId
 * @param targetId
 * @returns
 */
export async function moveCountryInfo(sourceId: string, targetId: string, action: ListAction) {
  const
    result = await mutation(
      mutationMoveCountry, {
      action,
      sourceId,
      targetId,
    });

  if (result.data?.moveCountry) {
    return result.data.moveCountry;
  }
  return null;
}

