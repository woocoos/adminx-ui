import i18n from '@/i18n';
import store from '@/store';
import { message } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import jwtDcode, { JwtPayload } from 'jwt-decode';
import { ReactNode } from 'react';
import { makeOperation, mapExchange } from 'urql';
import { refreshToken } from './basis';

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

export type TreeEditorAction = 'editor' | 'peer' | 'child';

let refreshTokenFn: NodeJS.Timeout;

export const urglMapExchange = mapExchange({
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
  onResult(result) {
    if (result.data) {
      clearTimeout(refreshTokenFn);
      refreshTokenFn = setTimeout(async () => {
        const basisState = store.getModelState('basis');
        if (basisState.token && basisState.refreshToken) {
          const jwt = jwtDcode<JwtPayload>(basisState.token);
          if ((jwt.exp || 0) * 1000 - Date.now() < 30 * 60 * 1000) {
            // 小于30分钟的时候需要刷新token
            const tr = await refreshToken(basisState.refreshToken);
            if (tr.accessToken) {
              store.dispatch.basis.updateToken(tr.accessToken);
            }
          }
        }
      }, 2000);
    }
    return result;
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
});
