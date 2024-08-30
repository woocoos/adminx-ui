import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Button, Space, Modal } from 'antd';
import { useRef, useState } from 'react';
import { Link, definePageConfig } from 'ice';
import { useTranslation } from 'react-i18next';
import Auth from '@/components/auth';
import { AppDict, AppDictWhereInput } from '@/generated/adminx/graphql';
import { delAppDictInfo, getAppDictList } from '@/services/adminx/dict';
import InputApp from '../app/components/inputApp';
import Create from './components/create';

export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<AppDict>[] = [
      // 有需要排序配置  sorter: true
      {
        title: t('app'),
        dataIndex: 'app',
        width: 120,
        renderFormItem: () => {
          return <InputApp />
        },
        renderText: (text, record) => {
          return record.app?.name;
        },
      },
      {
        title: t('name'),
        dataIndex: 'name',
        width: 120,
      },
      {
        title: t('code'),
        dataIndex: 'code',
        width: 100,
      },
      { title: t('description'), dataIndex: 'comments', width: 160, search: false },
    ],
    [dataSource, setDataSource] = useState<AppDict[]>([]),
    // 弹出层处理
    [modal, setModal] = useState({
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
      width: 170,
      render: (text, record) => {
        return <Space>
          <Auth authKey="updateAppDict" >
            <a key="viewer" onClick={() => {
              setModal({ open: true, title: `${t('edit_app_dict')}: ${record.code}`, id: record.id });
            }}>
              {t('edit')}
            </a>
          </Auth>
          <Link key="dictItem" to={`/dict/item?id=${record.id}`} >
            {t('detail')}
          </Link>
          <Auth authKey="deleteAppDict" >
            <a key="del" onClick={() => {
              Modal.confirm({
                title: t('delete'),
                content: `${t('confirm_delete')}：${record.name}?`,
                onOk: async (close) => {
                  const result = await delAppDictInfo(record.id);
                  if (result === true) {
                    if (dataSource.length === 1) {
                      const pageInfo = { ...proTableRef.current?.pageInfo };
                      pageInfo.current = pageInfo.current ? pageInfo.current > 2 ? pageInfo.current - 1 : 1 : 1;
                      proTableRef.current?.setPageInfo?.(pageInfo);
                    }
                    proTableRef.current?.reload();
                    close();
                  }
                },
              });
            }}>
              {t('delete')}
            </a>
          </Auth>
        </Space>;
      },
    },
  );

  return (
    <>
      <PageContainer
        header={{
          title: t('app_dict'),
          style: { background: token.colorBgContainer },
          breadcrumb: {
            items: [
              { title: t('system_conf') },
              { title: t('app_dict') },
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
            title: t('app_dict'),
            actions: [
              <Auth authKey="createAppDict">
                <Button
                  key="create"
                  type="primary"
                  onClick={
                    () => {
                      setModal({ open: true, title: t('create_app_dict'), id: '' });
                    }
                  }
                >
                  {t('create_app_dict')}
                </Button >
              </Auth>,
            ],
          }}
          scroll={{ x: 'max-content' }}
          columns={columns}
          request={async (params, sort, filter) => {
            const table = { data: [] as AppDict[], success: true, total: 0 },
              where: AppDictWhereInput = {};
            where.nameContains = params.nameContains;
            where.codeContains = params.codeContains;
            where.appID = params.app?.id;

            const result = await getAppDictList({
              current: params.current,
              pageSize: params.pageSize,
              where,
            });
            if (result?.totalCount && result.edges) {
              for (const item of result.edges) {
                if (item?.node) {
                  table.data.push(item.node as AppDict);
                }
              }
              table.total = result.totalCount;
            }
            setDataSource(table.data);
            return table;
          }}
          pagination={{ showSizeChanger: true }}
        />
        <Create
          open={modal.open}
          title={modal.title}
          id={modal.id}
          onClose={(isSuccess) => {
            if (isSuccess) {
              proTableRef.current?.reload();
            }
            setModal({ open: false, title: '', id: '' });
          }}
        />
      </PageContainer >
    </>
  );
};



export const pageConfig = definePageConfig(() => ({
  auth: ['/dict'],
}));
