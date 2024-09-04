import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Button, Space, Modal } from 'antd';
import { MutableRefObject, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { getAppInfo } from '@/services/adminx/app';
import CreateAppAction from './components/create';
import { EnumAppActionKind, EnumAppActionMethod, delAppAction, getAppActionList } from '@/services/adminx/app/action';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from '@ice/runtime';
import Auth from '@/components/auth';
import { App, AppAction, AppActionKind, AppActionWhereInput } from '@/generated/adminx/graphql';

export type AppActionListRef = {
  getSelect: () => AppAction[];
  reload: (resetPageIndex?: boolean) => void;
};

const AppActionList = (props: {
  appId?: string;
  title?: string;
  ref?: MutableRefObject<AppActionListRef>;
}, ref: MutableRefObject<AppActionListRef>) => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    appId = props?.appId || searchParams.get('id'),
    [appInfo, setAppInfo] = useState<App>(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<AppAction>[] = [
      // 有需要排序配置  sorter: true
      {
        title: t('name'),
        dataIndex: 'name',
        width: 120,
        search: {
          transform: (value) => ({ nameContains: value || undefined }),
        },
      },
      { title: t('type'), dataIndex: 'kind', width: 120, valueEnum: EnumAppActionKind },
      { title: t('method'), dataIndex: 'method', width: 120, valueEnum: EnumAppActionMethod },
      { title: t('remarks'), dataIndex: 'comments', width: 120, search: false },
    ],
    [dataSource, setDataSource] = useState<AppAction[]>([]),
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
    // 弹出层处理
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
      id: string;
    }>({
      open: false,
      title: '',
      id: '',
    });

  columns.push(
    {
      title: t('operation'),
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      search: false,
      width: 80,
      render: (text, record) => {
        return record.kind !== AppActionKind.Route ? (<Space>
          <Auth authKey={'updateAppAction'}>
            <a
              key="editor"
              onClick={() => {
                setModal({
                  open: true, title: `${t('edit')}:${record.name}`, id: record.id,
                });
              }}
            >
              {t('edit')}
            </a>
          </Auth>
          <Auth authKey={'deleteAppAction'}>
            <a key="del" onClick={() => onDel(record)}>
              {t('delete')}
            </a>
          </Auth>
        </Space>) : <></>;
      },
    },
  );

  const
    getApp = async () => {
      if (appId) {
        const result = await getAppInfo(appId);
        if (result?.id) {
          setAppInfo(result as App);
          return result;
        }
      }
      return null;
    },
    onDel = (record: AppAction) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t('confirm_delete')}：${record.name}?`,
        onOk: async (close) => {
          const result = await delAppAction(record.id);
          if (result === true) {
            const idx = dataSource.findIndex(item => item.id === record.id);
            dataSource.splice(idx, 1);
            setDataSource([...dataSource]);
            if (dataSource.length === 0) {
              const pageInfo = { ...proTableRef.current?.pageInfo };
              pageInfo.current = pageInfo.current ? pageInfo.current > 2 ? pageInfo.current - 1 : 1 : 1;
              proTableRef.current?.setPageInfo?.(pageInfo);
              proTableRef.current?.reload();
            }
            close();
          }
        },
      });
    },
    onDrawerClose = (isSuccess: boolean, newInfo?: AppAction) => {
      if (isSuccess && newInfo) {
        const idx = dataSource.findIndex(item => item.id == newInfo.id)
        if (idx === -1) {
          dataSource.unshift(newInfo)
        } else {
          dataSource[idx] = newInfo
        }
        setDataSource([...dataSource])
      }
      setModal({ open: false, title: '', id: '' });
    };

  useImperativeHandle(ref, () => {
    return {
      getSelect: () => {
        return dataSource.filter(item => selectedRowKeys.includes(item.id));
      },
      reload: (resetPageIndex?: boolean) => {
        proTableRef.current?.reload(resetPageIndex);
      },
    };
  });


  return (<>
    <PageContainer
      header={{
        title: t('app_auth'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: <Link to={'/system/app'}>{t('app_manage')}</Link> },
            { title: t('app_auth') },
          ],
        },

      }}
    >
      <ProTable
        actionRef={proTableRef}
        search={{
          searchText: `${t('query')}`,
          resetText: `${t('reset')}`,
          labelWidth: 'auto',
        }}
        rowKey={'id'}
        toolbar={{
          title: `${t('app')}:${appInfo?.name || '-'}`,
          actions: [
            <Auth authKey="createAppActions">
              <Button
                key="created"
                type="primary"
                onClick={() => {
                  setModal({ open: true, title: t('create_permission'), id: '' });
                }}
              >
                {t('create_permission')}
              </Button>
            </Auth>,
          ],
        }}
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={dataSource}
        request={async (params) => {
          const table = { data: [] as AppAction[], success: true, total: 0 },
            where: AppActionWhereInput = {},
            info = appInfo?.id === appId ? appInfo : await getApp();
          where.nameContains = params.nameContains;
          where.kind = params.kind;
          where.method = params.method;
          if (info) {
            const result = await getAppActionList(info.id, {
              current: params.current,
              pageSize: params.pageSize,
              where,
            });
            if (result?.totalCount) {
              table.data = result.edges?.map(item => item?.node) as AppAction[];
              table.total = result.totalCount;
            }
          }
          setSelectedRowKeys([]);
          setDataSource(table.data);
          return table;
        }}
        pagination={{ showSizeChanger: true }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys); },
          type: 'checkbox',
        }}
      />
      <CreateAppAction
        open={modal.open}
        title={modal.title}
        id={modal.id}
        appId={appInfo?.id}
        onClose={onDrawerClose}
      />
    </PageContainer >
  </>);
};


export default forwardRef(AppActionList);
