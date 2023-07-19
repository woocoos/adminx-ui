import { TableParams } from '@/services/graphql';
import { getRecycleUserList } from '@/services/adminx/user';
import store from '@/store';
import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Space, message } from 'antd';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreateAccount from '../list/components/create';
import Auth from '@/components/Auth';
import { User, UserOrder, UserUserType, UserWhereInput } from '@/__generated__/adminx/graphql';

export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [userState] = store.useModel('user'),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<User>[] = [
      {
        title: t('display_name'),
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
                setModal({ open: true, title: `${t('restore_user')}:${record.displayName}`, data: record });
              }}
              >{t('restore_user')}</a>
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
    getRequest = async (params: TableParams) => {
      const table = { data: [] as User[], success: true, total: 0 },
        where: UserWhereInput = {};
      let orderBy: UserOrder | undefined;
      where.displayNameContains = params.displayNameContains;
      where.emailContains = params.emailContains;
      where.mobileContains = params.mobileContains;
      const result = await getRecycleUserList({
        current: params.current,
        pageSize: params.pageSize,
        where: where,
        orderBy: orderBy,
      });
      if (result?.totalCount) {
        table.data = result.edges?.map(item => item?.node) as User[] || [];
        table.total = result.totalCount;
      }
      setDataSource(table.data);
      return table;
    };

  return (<PageContainer
    header={{
      title: t('recycle_bin'),
      style: { background: token.colorBgContainer },
      breadcrumb: {
        items: [
          { title: t('system_conf') },
          { title: t('account_manage') },
          { title: t('recycle_bin') },
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
        title: t('user_list'),
      }}
      scroll={{ x: 'max-content' }}
      columns={columns}
      request={getRequest}
      pagination={{ showSizeChanger: true }}
    />
    <CreateAccount
      open={modal.open}
      title={modal.title}
      orgId={userState.tenantId}
      recycleInfo={modal.data}
      scene="recycle"
      userType={UserUserType.Member}
      onClose={(isSuccess) => {
        if (isSuccess) {
          proTableRef.current?.reload();
          message.success(t('submit_success'));
        }
        setModal({ open: false, title: modal.title });
      }}
    />
  </PageContainer>);
};
