import { TableFilter, TableParams, TableSort } from '@/services/graphql';
import { User, getRecycleUserList } from '@/services/user';
import store from '@/store';
import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Space, message } from 'antd';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreateAccount from './components/create';
import Auth from '@/components/Auth';

export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [basisState] = store.useModel('basis'),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<User>[] = [
      {
        title: t('display name'),
        dataIndex: 'displayName',
        width: 120,
        search: {
          transform: (value) => ({ displayNameContains: value || undefined }),
        },
      },
      {
        title: t('email'),
        dataIndex: 'email',
        width: 120,
        search: {
          transform: (value) => ({ emailContains: value || undefined }),
        },
      },
      {
        title: t('mobile'),
        dataIndex: 'mobile',
        width: 160,
        search: {
          transform: (value) => ({ mobileContains: value || undefined }),
        },
      },
      {
        title: t('operation'),
        dataIndex: 'actions',
        fixed: 'right',
        align: 'center',
        search: false,
        width: 100,
        render: (text, record) => {
          return (<Space>
            <Auth authKey="recoverOrgUser">
              <a onClick={() => {
                setModal({ open: true, title: `${t('Restore user')}:${record.displayName}`, data: record });
              }}
              >{t('Restore user')}</a>
            </Auth>
          </Space>);
        },
      },
    ],
    [, setDataSource] = useState<User[]>([]),
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
      data?: User;
    }>({
      open: false,
      title: '',
    });

  const
    getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
      const table = { data: [] as User[], success: true, total: 0 };
      const result = await getRecycleUserList(params, filter, sort);
      if (result?.totalCount) {
        table.data = result.edges.map(item => item.node);
        table.total = result.totalCount;
      }
      setDataSource(table.data);
      return table;
    };

  return (<PageContainer
    header={{
      title: t('Recycling station'),
      style: { background: token.colorBgContainer },
      breadcrumb: {
        items: [
          { title: t('System configuration') },
          { title: t('{{field}} management', { field: t('account') }) },
          { title: t('Recycling station') },
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
        title: t('{{field}} list', { field: t('user') }),
      }}
      scroll={{ x: 'max-content' }}
      columns={columns}
      request={getRequest}
      pagination={{ showSizeChanger: true }}
    />
    <CreateAccount
      open={modal.open}
      title={modal.title}
      orgId={basisState.tenantId}
      recycleInfo={modal.data}
      scene="recycle"
      userType="member"
      onClose={(isSuccess) => {
        if (isSuccess) {
          proTableRef.current?.reload();
          message.success(t('submit success'));
        }
        setModal({ open: false, title: modal.title });
      }}
    />
  </PageContainer>);
};
