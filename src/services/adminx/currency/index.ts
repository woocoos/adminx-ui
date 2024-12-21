import { gql } from '@/generated/adminx';
import { mutation, paging, query } from '@knockout-js/ice-urql/request'
import { gid } from '@knockout-js/api';
import { CreateCurrencyInput, CurrencyOrder, CurrencyOrderField, CurrencyWhereInput, OrderDirection, UpdateCurrencyInput } from '@/generated/adminx/graphql';

export const EnumCurrencyStatus = {
  active: { text: 'active', status: 'success' },
  inactive: { text: 'inactive', status: 'default' },
  disabled: { text: 'disabled', status: 'default' },
  processing: { text: 'processing', status: 'warning' },
};

const queryList = gql(/* GraphQL */`query currencyList($first: Int,$orderBy:CurrencyOrder,$where:CurrencyWhereInput){
  currencies(first:$first,orderBy: $orderBy,where: $where){
    totalCount,pageInfo{ hasNextPage,hasPreviousPage,startCursor,endCursor }
    edges{
      cursor,node{
        id,name,code,sign,status,createdAt
      }
    }
  }
}`);

const queryInfo = gql(/* GraphQL */`query currencyInfo($gid:GID!){
  node(id:$gid){
    ... on Currency{
      id,name,code,sign,status,createdAt
    }
  }
}`);

const mutationUpdate = gql(/* GraphQL */`mutation updateCurrency($id:ID!,$input: UpdateCurrencyInput!){
  updateCurrency(currencyID:$id,input:$input){
    id,name,code,sign,status,createdAt
  }
}`);

const mutationCreate = gql(/* GraphQL */`mutation createCurrency($input: CreateCurrencyInput!){
  createCurrency(input:$input){
    id,name,code,sign,status,createdAt
  }
}`);

const mutationDel = gql(/* GraphQL */`mutation delCurrency($id:ID!){
  deleteCurrency(currencyID: $id)
}`);


/**
 * 获取信息
 * @param params
 * @param filter
 * @param sort
 * @returns
 */
export async function getCurrencyList(
  gather: {
    current?: number;
    pageSize?: number;
    where?: CurrencyWhereInput;
    orderBy?: CurrencyOrder;
  },
) {
  const
    result = await paging(
      queryList, {
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy ?? {
        direction: OrderDirection.Desc,
        field: CurrencyOrderField.CreatedAt
      },
    }, gather.current || 1);

  if (result.data?.currencies) {
    return result.data.currencies;
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
export async function getCacheCurrencyList(
  gather: {
    current?: number;
    pageSize?: number;
    where?: CurrencyWhereInput;
    orderBy?: CurrencyOrder;
  },
) {
  const
    result = await paging(
      queryList, {
      first: gather.pageSize || 20,
      where: gather.where,
      orderBy: gather.orderBy ?? {
        direction: OrderDirection.Desc,
        field: CurrencyOrderField.CreatedAt
      },
    }, gather.current || 1, {
      requestPolicy: "cache-first"
    });

  if (result.data?.currencies) {
    return result.data.currencies;
  }
  return null;
}


/**
 * 获取信息
 * @param id
 * @returns
 */
export async function getCurrencyInfo(id: string) {
  const
    result = await query(
      queryInfo, {
      gid: gid('Currency', id),
    });

  if (result.data?.node?.__typename === "Currency") {
    return result.data.node;
  }
  return null;
}


/**
 * 创建
 * @param input
 * @returns
 */
export async function createCurrencyInfo(input: CreateCurrencyInput) {
  const
    result = await mutation(
      mutationCreate, {
      input,
    });

  if (result.data?.createCurrency?.id) {
    return result.data.createCurrency;
  }
  return null;
}


/**
 * 更新
 * @param id
 * @param input
 * @returns
 */
export async function updateCurrencyInfo(id: string, input: UpdateCurrencyInput) {
  const
    result = await mutation(
      mutationUpdate, {
      id,
      input,
    });

  if (result.data?.updateCurrency?.id) {
    return result.data.updateCurrency;
  }
  return null;
}

/**
 * 删除
 * @param id
 * @returns
 */
export async function delCurrencyInfo(id: string) {
  const
    result = await mutation(
      mutationDel, {
      id,
    });

  if (result.data?.deleteCurrency) {
    return result.data.deleteCurrency;
  }
  return null;
}
