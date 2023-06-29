import i18n from '@/i18n';
import store from '@/store';
import { message } from 'antd';
import { Client, cacheExchange, fetchExchange, makeOperation, mapExchange } from 'urql';
import { gql } from '@/__generated__/adminx';

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

const baseURL = '/api-adminx'
let client: Client

/**
 * ko项目的client
 * @returns
 */
export function koClient() {
  const url = `${baseURL}/graphql/query`;

  if (!client) {
    client = new Client({
      url,
      requestPolicy: 'cache-and-network',
      exchanges: [
        mapExchange({
          onOperation(operation) {
            const basisState = store.getModelState('basis'), headers: Record<string, any> = {};
            if (operation.context.fetchOptions?.['headers']?.['Authorization']) {
              headers['Authorization'] = operation.context.fetchOptions?.['headers']?.['Authorization'];
            } else if (basisState.token) {
              headers['Authorization'] = `Bearer ${basisState.token}`;
            }
            if (operation.context.fetchOptions?.['headers']?.['X-Tenant-ID']) {
              headers['X-Tenant-ID'] = operation.context.fetchOptions?.['headers']?.['X-Tenant-ID'];
            } else if (basisState.tenantId) {
              headers['X-Tenant-ID'] = basisState.tenantId;
            }

            return makeOperation(operation.kind, operation, {
              fetchOptions: {
                headers,
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
