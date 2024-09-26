import { getRecycleUserList } from '@/services/adminx/user';
import store from '@/store';
import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Space, message } from 'antd';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreateAccount from '../list/components/create';
import Auth from '@/components/auth';
import { User, UserOrder, UserUserType, UserWhereInput, UserAddrAddrType } from '@/generated/adminx/graphql';
import { Link } from '@ice/runtime';

export default (props: {
  isFromSystem?: boolean;
  orgId?: string;
}) => {
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
        render: (text, record) => {
          return <div>{record?.contact?.email || '-'}</div>;
        },
      },
      {
        title: t('mobile'),
        dataIndex: 'mobile',
        width: 160,
        search: {
          transform: (value) => ({ mobileContains: value || undefined }),
        },
        render: (text, record) => {
          return <div>{record?.contact?.mobile || '-'}</div>;
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
    [dataSource, setDataSource] = useState<User[]>([]),
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
      data?: User;
    }>({
      open: false,
      title: '',
    });

  return (<PageContainer
    header={{
      title: t('recycle_bin'),
      style: { background: token.colorBgContainer },
      breadcrumb: {
        items: props.isFromSystem ? [
          { title: t('system_conf') },
          { title: <Link to="/system/org">{t('org_manage')}</Link> },
          { title: <Link to={`/system/org/users?id=${props.orgId}`}>{t('user_manage')}</Link> },
          { title: t('recycle_bin') },
        ] : [
          { title: t('system_conf') },
          { title: <Link to="/org/users">{t('user_manage')}</Link> },
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
      dataSource={dataSource}
      request={async (params) => {
        const table = { data: [] as User[], success: true, total: 0 },
          where: UserWhereInput = {};
        let orderBy: UserOrder | undefined;
        where.displayNameContains = params.displayNameContains;
        where.hasAddressesWith = []
        if (params.emailContains)
          where.hasAddressesWith.push({ emailContains: params.emailContains, addrType: UserAddrAddrType.Contact })
        if (params.mobileContains)
          where.hasAddressesWith.push({ mobileContains: params.mobileContains, addrType: UserAddrAddrType.Contact })
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
      }}
      pagination={{ showSizeChanger: true }}
    />
    <CreateAccount
      open={modal.open}
      title={modal.title}
      orgId={userState.tenantId}
      recycleInfo={modal.data}
      scene="recycle"
      userType={UserUserType.Member}
      onClose={(isSuccess, newInfo) => {
        if (isSuccess) {
          if (newInfo) {
            setDataSource(dataSource.filter(item => item.id !== newInfo.id));
          }
          message.success(t('submit_success'));
        }
        setModal({ open: false, title: modal.title });
      }}
    />
  </PageContainer>);
};
