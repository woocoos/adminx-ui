import { gql } from '@/__generated__';
import store from '@/store';
import { SortOrder } from 'antd/lib/table/interface';
import { ReactNode } from 'react';
import { Client, cacheExchange, errorExchange, fetchExchange, mapExchange } from 'urql';

export type TreeDataState<T> = {
  key: string;
  title: string | ReactNode;
  children?: TreeDataState<T>[];
  parentId: string | number;
  node?: T;
};

export interface TableParams {
  pageSize?: number;
  current?: number;
  keyword?: string;
  [field: string]: any;
}

export type TableFilter = Record<string, (string | number)[] | null>;

export type TableSort = Record<string, SortOrder>;

const queryGlobalId = gql(/* GraphQL */`query globalID($type:String!,$id:ID!){
  globalID(type:$type,id:$id)
}`)

/**
 * 获取GID
 * @param type
 * @param id
 * @returns
 */
export async function getGID(type: string, id: string | number) {
  const koc = koClient(),
    result = await koc.client.query(
      queryGlobalId, {
      type,
      id,
    }).toPromise()

  if (result.data?.globalID) {
    return result.data?.globalID
  }
  return null
}


const clients: Record<string, Client | null> = {
  ko: null
}

/**
 * ko项目的client
 * @returns
 */
export function koClient() {
  const url = '/api/graphql/query';

  if (!clients.ko) {
    const basisState = store.getModelState('basis');
    clients.ko = new Client({
      url,
      requestPolicy: "cache-and-network",
      fetchOptions: {
        headers: {
          "Authorization": basisState.token ? `Bearer ${basisState.token}` : "",
          "X-Tenant-ID": basisState.tenantId || "",
        },
      },
      exchanges: [cacheExchange, fetchExchange, mapExchange({
        onResult: (result) => {
          console.log('onResult', result);
        },
        onError: (error, operation) => {
          console.log('onError', error, operation)
        }
      }), errorExchange({
        onResult: (result) => {
          console.log('--onResult', result);
        },
        onError: (error, operation) => {
          console.log('--onError', error, operation)
        }
      })],
    });
  }
  return {
    client: clients.ko,
    url,
  }
}
