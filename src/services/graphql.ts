import { SortOrder } from 'antd/lib/table/interface';
import { request } from 'ice';

export interface OrderBy {
  direction: "ASC" | "DESC"
  field: string
}

export interface ListPageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string
  endCursor: string
}

export interface List<T> {
  totalCount: number
  pageInfo: ListPageInfo
  edges: {
    cursor: string
    node: T
  }[]
}

export interface PagingParams {
  /**
   * 返回列表中位于指定游标后面的元素。
   */
  after?: string
  /**
   * 返回列表中的前n个元素。
   */
  first?: number
  /**
   * 返回列表中位于指定游标之前的元素。
   */
  before?: string
  /**
   * 返回列表中的最后n个元素。
   */
  last?: number
}

export interface TableParams {
  pageSize: number;
  current: number;
  [appKey: string]: any
}
export interface TableSort {
  [field: string]: SortOrder
}
export interface JsonFieldAny {
  [field: string]: any
}

/**
 * 获取GID
 * @param type 
 * @param id 
 * @returns 
 */
export async function getGID(type: string, id: string | number) {
  const result = await graphqlApi(
    `query globalID{
      globalID(type:"${type}",id:"${id}")
    }`,
  )

  if (result?.data?.globalID) {
    return result?.data?.globalID as string
  } else {
    return null
  }
}

/**
 * 处理 过滤和排序
 * @param params 
 * @param filter 
 * @returns 
 */
export function getGraphqlFilter(params?: TableParams, filter?: JsonFieldAny, sort?: TableSort) {
  let where: JsonFieldAny = { ...filter }, orderBy: OrderBy | undefined;
  for (let key in params) {
    if (!["pageSize", "current"].includes(key) && filter && !Object.keys(filter).includes(key)) {
      where[key] = params[key]
    }
  }

  for (let key in where) {
    if (Array.isArray(where[key])) {
      where[`${key}In`] = where[key]
      delete where[key]
    }
  }
  if (sort) {
    const sortKey = Object.keys(sort)[0]
    if (sortKey) {
      orderBy = {
        field: sortKey,
        direction: sort[sortKey] === 'descend' ? 'DESC' : 'ASC',
      }
    }
  }

  return { where, orderBy }
}

/**
 * 处理 updateinput中clearField:true
 * @param input 
 * @returns 
 */
export function setClearInputField(input: JsonFieldAny) {
  for (let key in input) {
    if (!input[key]) {
      const clearKey = `clear${key.slice(0, 1).toUpperCase()}${key.slice(1)}`
      input[clearKey] = true
    }
  }
  return input
}


/**
 * 基础gql接口
 * @param query 
 * @param variables 
 * @param headers 
 * @returns 
 */
export async function graphqlApi(query: string, variables?: any, headers?: any) {
  return await request({
    url: '/graphql/query',
    method: 'post',
    data: {
      query,
      variables,
    },
    headers
  })
}