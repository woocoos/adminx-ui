import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Space } from 'antd';
import { useRef, useState } from 'react';
import { TableParams } from '@/services/graphql';
import { getAppInfo } from '@/services/adminx/app';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from '@ice/runtime';
import { getAppResList } from '@/services/adminx/app/resource';
import CreateRes from './components/createRes';
import Auth from '@/components/Auth';
import { App, AppRes, AppResWhereInput } from '@/__generated__/adminx/graphql';


export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    [appInfo, setAppInfo] = useState<App>(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<AppRes>[] = [
      // 有需要排序配置  sorter: true
      {
        title: t('name'),
        dataIndex: 'name',
        width: 120,
        search: {
          transform: (value) => ({ nameContains: value || undefined }),
        },
      },
      {
        title: t('type_name'),
        dataIndex: 'typeName',
        width: 120,
        search: {
          transform: (value) => ({ typeNameContains: value || undefined }),
        },
      },
      { title: t('expression'), dataIndex: 'arnPattern', width: 120, search: false },
      {
        title: t('operation'),
        dataIndex: 'actions',
        fixed: 'right',
        align: 'center',
        search: false,
        width: 110,
        render: (text, record) => {
          return (<Space>
            <Auth authKey="updateAppRes">
              <a
                key="edit"
                onClick={() => {
                  setModal({ open: true, title: t('amend_{{field}}', { field: record.name }), id: record.id });
                }}
              >
                {t('edit')}
              </a>
            </Auth>
          </Space>);
        },
      },
    ],
    [, setDataSource] = useState<AppRes[]>([]),
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


  const
    getApp = async () => {
      const appId = searchParams.get('id');
      if (appId) {
        const result = await getAppInfo(appId);
        if (result?.id) {
          setAppInfo(result as App);
          return result;
        }
      }
      return null;
    },
    getRequest = async (params: TableParams) => {
      const table = { data: [] as AppRes[], success: true, total: 0 },
        where: AppResWhereInput = {},
        info = searchParams.get('id') == appInfo?.id ? appInfo : await getApp();
      where.nameContains = params.nameContains;
      where.typeNameContains = params.typeNameContains;
      if (info) {
        const result = await getAppResList(info.id, {
          current: params.current,
          pageSize: params.pageSize,
          where,
        });
        if (result?.totalCount) {
          table.data = result.edges?.map(item => item?.node) as AppRes[];
          table.total = result.totalCount;
        }
      }
      setSelectedRowKeys([]);
      setDataSource(table.data);
      return table;
      // },
      // onDel = (record: AppRes) => {
      //   Modal.confirm({
      //     title: t('delete'),
      //     content: `${t('confirm_delete')}：${record.name}`,
      //     onOk: async (close) => {
      //       // 没有接口
      //       // const result =
      //       // if (result === true) {
      //       //     if (dataSource.length === 1) {
      //       //         const pageInfo = { ...proTableRef.current?.pageInfo }
      //       //         pageInfo.current = pageInfo.current ? pageInfo.current > 2 ? pageInfo.current - 1 : 1 : 1
      //       //         proTableRef.current?.setPageInfo?.(pageInfo)
      //       //     }
      //       //     proTableRef.current?.reload();
      //       //     close();
      //       // }
      //     },
      //   });
    };

  return (
    <PageContainer
      header={{
        title: t('app_res'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: <Link to={'/system/app'}>{t('app_manage')}</Link> },
            { title: t('app_res') },
          ],
        },
      }}
    >
      <ProTable
        actionRef={proTableRef}
        rowKey={'id'}
        search={{
          searchText: `${t('query')}`,
          resetText: `${t('reset')}`,
          labelWidth: 'auto',
        }}
        toolbar={{
          title: `${t('app')}:${appInfo?.name || '-'}`,
          actions: [],
        }}
        scroll={{ x: 'max-content' }}
        columns={columns}
        request={getRequest}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys); },
          type: 'checkbox',
        }}
      />
      {
        appInfo ? <CreateRes
          open={modal.open}
          title={modal.title}
          id={modal.id}
          appId={appInfo?.id}
          onClose={(isSuccess) => {
            if (isSuccess) { proTableRef.current?.reload(); }
            setModal({ open: false, title: modal.title, id: '' });
          }}
        />
          : <></>
      }

    </PageContainer>
  );
};
