import { firstUpper } from '@/util';
import { SortOrder } from 'antd/lib/table/interface';
import { request } from 'ice';
import { ReactNode } from 'react';

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

/**
 * 游标分页组合图解
 *  last            first
 *      <- cursor ->
 * before          after
 */
export interface PagingParams {
  /**
   * 返回列表中位于指定游标后面的元素。
   */
  after?: string
  /**
   * 返回列表中的前n个元素。0 1 2 3
   */
  first?: number
  /**
   * 返回列表中位于指定游标之前的元素。
   */
  before?: string
  /**
   * 返回列表中的最后n个元素。-3 -2 -1 0
   */
  last?: number
  /**
   * 方向
   */
  direction?: "up" | "down"
  /**
   * 页码
   */
  pageSize?: number
}

export type TreeMoveAction = "child" | "up" | "down"

export type TreeDataState<T> = {
  key: string
  title: string | ReactNode
  children?: TreeDataState<T>[]
  parentId: string
  node?: T
}

export interface TablePage {
  pageSize?: number
  current?: number
  startCursor?: string
  endCursor?: string
}

export interface TableParams {
  pageSize?: number
  current?: number
  keyword?: string
  [field: string]: any
}

export type TableFilter = Record<string, (string | number)[] | null>

export type TableSort = Record<string, SortOrder>

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
export function getGraphqlFilter(params: TableParams, filter: TableFilter, sort: TableSort) {
  let where: Record<string, any> = { ...filter }, orderBy: OrderBy | undefined;
  for (let key in params) {
    if (!["pageSize", "current"].includes(key) && filter && !Object.keys(filter).includes(key)) {
      where[key] = params[key]
    }
  }

  for (let key in where) {
    if (!['or', 'and'].includes(key) && Array.isArray(where[key])) {
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
export function setClearInputField(input: Record<string, any>) {
  for (let key in input) {
    if (!input[key]) {
      const clearKey = `clear${firstUpper(key)}`
      if (!Object.keys(input).includes(clearKey)) {
        if (key === 'actionID') {
          input['clearAction'] = true
        } else {
          input[clearKey] = true
        }
      }
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
export async function graphqlApi(query: string, variables?: Record<string, any>, headers?: Record<string, any>) {
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

/**
 * 基础gql接口
 * @param query 
 * @param variables 
 * @param headers 
 * @returns 
 */
export async function graphqlPageApi(query: string, variables: Record<string, any>, current?: number) {
  return await request({
    url: `/graphql/query${current ? `?p=${current}` : ''}`,
    method: 'post',
    data: {
      query,
      variables,
    },
  })
}

