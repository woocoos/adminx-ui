import { gql } from '@/__generated__';
import i18n from '@/i18n';
import store from '@/store';
import { message } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { ReactNode } from 'react';
import { Client, cacheExchange, fetchExchange, makeOperation, mapExchange } from 'urql';

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
}`);

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
    }).toPromise();

  if (result.data?.globalID) {
    return result.data?.globalID;
  }
  return null;
}


const clients: Record<string, Client | null> = {
  ko: null,
};

/**
 * ko项目的client
 * @returns
 */
export function koClient(headers?: Record<string, any>) {
  const url = '/api/graphql/query';

  if (!clients.ko) {
    clients.ko = new Client({
      url,
      requestPolicy: 'cache-and-network',
      exchanges: [
        mapExchange({
          onOperation(operation) {
            const basisState = store.getModelState('basis');
            return makeOperation(operation.kind, operation, {
              fetchOptions: {
                headers: {
                  Authorization: basisState.token ? `Bearer ${basisState.token}` : '',
                  'X-Tenant-ID': basisState.tenantId || '',
                  ...headers,
                },
              },
            });
          },
          onError: (error) => {
            let msg = '';
            switch (error.response.status) {
              case 401:
                store.dispatch.basis.logout();
                if (!msg) {
                  msg = i18n.t('401');
                }
                break;
              case 403:
                if (!msg) {
                  msg = i18n.t('403');
                }
                break;
              case 404:
                if (!msg) {
                  msg = i18n.t('404');
                }
                break;
              case 500:
                if (!msg) {
                  msg = i18n.t('500');
                }
                break;
              default:
                if (!msg) {
                  msg = error.toString();
                }
            }
            if (msg) {
              message.error(msg);
            }

            console.dir('onError', error);
          },
        }),
        cacheExchange,
        fetchExchange,
      ],
    });
  }

  return {
    client: clients.ko,
    url,
  };
}
