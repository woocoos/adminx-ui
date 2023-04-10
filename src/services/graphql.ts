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

export interface TablePage {
  pageSize: number
  current: number
  startCursor?: string
  endCursor?: string
}
export interface TableParams {
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
 * 处理分页参数
 * @param nPage 
 * @param oPage 
 * @returns 
 */
export function getGraphqlPaging(nPage: TablePage, oPage?: TablePage) {
  const paging: PagingParams = {},
    pageSize = nPage.pageSize;
  if (oPage) {
    if (nPage.current > oPage.current) {
      // 下一页
      paging.after = oPage.endCursor
      paging.first = (nPage.current - oPage.current) * pageSize
      paging.direction = 'down'
    } else if (nPage.current < oPage.current) {
      // 上一页
      paging.before = oPage.startCursor
      paging.last = (oPage.current - nPage.current) * pageSize
      paging.direction = 'up'
    } else {
      // 页码相等
      paging.before = oPage.startCursor
      paging.first = pageSize
      paging.direction = 'down'
    }
  } else {
    paging.first = pageSize
    paging.direction = 'down'
  }

  paging.pageSize = pageSize

  return paging
}

/**
 * 处理分页结果
 * @param list 
 * @returns 
 */
export function getGraphqlList<T>(list: List<T>, paging: PagingParams) {
  if (paging.pageSize) {
    const count = list.edges.length % paging.pageSize === 0 ? paging.pageSize : list.edges.length % paging.pageSize
    list.edges = list.edges.splice(paging.direction === 'up' ? 0 : -count, count)
    return list
  } else {
    return list
  }
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