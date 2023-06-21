import i18n from '@/i18n';
import store from '@/store';
import { message } from 'antd';
import { Client, cacheExchange, fetchExchange, makeOperation, mapExchange } from 'urql';
import { gql } from '@/__generated__/knockout';

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

let client: Client

/**
 * ko项目的client
 * @returns
 */
export function koClient(headers?: Record<string, any>) {
  const url = '/api/graphql/query';

  if (!client) {
    client = new Client({
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
                msg = i18n.t('401');
                break;
              case 403:
                msg = i18n.t('403');
                break;
              case 404:
                msg = i18n.t('404');
                break;
              default:
                msg = error.toString();
            }
            if (msg) {
              message.error(msg);
            }
          },
        }),
        cacheExchange,
        fetchExchange,
      ],
    });
  }

  return {
    client,
    url,
  };
}
