import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
  useToken,
} from '@ant-design/pro-components';
import { Button, Space, Dropdown, Modal, message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { MutableRefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { TableParams, TableSort, TableFilter, List } from '@/services/graphql';
import { Link, useAuth } from 'ice';
import { EnumUserStatus, User, UserType, delUserInfo, getUserList, resetUserPasswordByEmail } from '@/services/user';
import AccountCreate from '../list/components/create';
import { getOrgRoleUserList, getOrgUserList, removeOrgUser } from '@/services/org/user';
import { OrgRole, revokeOrgRoleUser } from '@/services/org/role';
import DrawerUser from '@/pages/account/components/drawerUser';
import { useTranslation } from 'react-i18next';
import { Org } from '@/services/org';
import DrawerRole from '@/pages/org/components/drawerRole';
import DrawerRolePolicy from '@/pages/org/components/drawerRolePolicy';
import Auth, { checkAuth } from '@/components/Auth';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import store from '@/store';

type UserListProps = {
  title?: string;
  orgId?: string;
  orgRole?: OrgRole;
  orgInfo?: Org;
  scene?: 'user' | 'orgUser' | 'roleUser';
  userType?: UserType;
  isMultiple?: boolean;
  ref?: MutableRefObject<UserListRef>;
};

export type UserListRef = {
  getSelect: () => User[];
  reload: (resetPageIndex?: boolean) => void;
};

const UserList = (props: UserListProps, ref: MutableRefObject<UserListRef>) => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [auth] = useAuth(),
    [basisState] = store.useModel('basis'),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    [dataSource, setDataSource] = useState<User[]>([]),
    columns: ProColumns<User>[] = [
      // 有需要排序配置  sorter: true
      {
        title: t('principal_name'),
        dataIndex: 'principalName',
        width: 90,
        search: {
          transform: (value) => ({ principalNameContains: value || undefined }),
        },
      },
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
        title: t('status'),
        dataIndex: 'status',
        filters: true,
        search: false,
        width: 100,
        valueEnum: EnumUserStatus,
      },
      { title: t('created_at'), dataIndex: 'createdAt', width: 160, valueType: 'dateTime', sorter: true },

    ],
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
    // 弹出层处理
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
      data?: User;
      scene: 'add' | 'create' | 'addGroup' | 'addPermission' | '';
    }>({
      open: false,
      title: '',
      scene: '',
    });

  columns.push(
    {
      title: t('operation'),
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      search: false,
      width: 100,
      render: (text, record) => {
        const items: ItemType[] = [];

        if (props.scene === 'orgUser' && props.orgInfo?.kind === 'root') {
          if (checkAuth('assignRoleUser', auth)) {
            items.push(
              {
                key: 'addGroup',
                label: <a onClick={() => {
                  setModal({ open: true, data: record, title: t('add_user_group'), scene: 'addGroup' });
                }}
                >
                  {t('add_user_group')}
                </a>,
              },
            );
          }
          if (checkAuth('grant', auth)) {
            items.push(
              {
                key: 'addPermission',
                label: <a onClick={() => {
                  setModal({ open: true, data: record, title: t('add_permission'), scene: 'addPermission' });
                }}
                >
                  {t('add_permission')}
                </a>,
              },
            );
          }
        }

        if (checkAuth('resetUserPasswordByEmail', auth)) {
          items.push(
            { key: 'resetPwd', label: <a onClick={() => onResetPwd(record)}>{t('reset_pwd')}</a> },
          );
        }
        if (props.scene === 'orgUser') {
          if (props.orgInfo?.kind === 'org' || record.userType === 'member') {
            if (checkAuth('removeOrganizationUser', auth)) {
              items.push(
                { key: 'delete', label: <a onClick={() => onRemoveOrg(record)}>{t('remove')}</a> },
              );
            }
          }
        } else {
          if (checkAuth('deleteUser', auth)) {
            items.push(
              { key: 'delete', label: <a onClick={() => onDelUser(record)}>{t('delete')}</a> },
            );
          }
        }
        return props.scene === 'roleUser' ? <Space>
          <Auth authKey="revokeRoleUser">
            {record.isAllowRevokeRole ? <a onClick={() => onRemoveRole(record)}>{t('remove')}</a> : ''}
          </Auth>
        </Space> : props.scene === 'orgUser' ? <Space>
          <Link key="editor" to={`/account/viewer?id=${record.id}`}>
            {t('detail')}
          </Link>
          {
            items.length ? <Dropdown
              trigger={['click']}
              menu={{
                items,
              }}
            >
              <a><EllipsisOutlined /></a>
            </Dropdown> : ''
          }

        </Space> : <Space>
          <Link key="editor" to={`/account/viewer?id=${record.id}`}>
            {t('detail')}
          </Link>
          {
            items.length ? <Dropdown
              trigger={['click']}
              menu={{
                items,
              }}
            >
              <a><EllipsisOutlined /></a>
            </Dropdown> : ''
          }

        </Space>;
      },
    },
  );

  const
    getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
      const table = { data: [] as User[], success: true, total: 0 };
      let result: List<User> | null;
      params['userType'] = props.userType;
      if (props.orgRole) {
        result = await getOrgRoleUserList(props.orgRole.id, params, filter, sort, {
          orgRoleId: props.orgRole.id,
        });
      } else if (props.orgId) {
        result = await getOrgUserList(props.orgId, params, filter, sort);
      } else {
        result = await getUserList(params, filter, sort);
      }

      if (result) {
        table.data = result.edges.map(item => item.node);
        table.total = result.totalCount;
      }
      setSelectedRowKeys([]);
      setDataSource(table.data);
      return table;
    },
    onResetPwd = (record: User) => {
      Modal.confirm({
        title: `${t('reset_pwd')} ${record.displayName}`,
        content: <>
          <div>{t("reset_pwd_confirm_content_1")}</div>
          <div>{t('reset_pwd_confirm_content_2')}</div>
        </>,
        onOk: async (close) => {
          const result = await resetUserPasswordByEmail(record.id);
          if (result) {
            message.success(t('submit_success'));
            close();
          }
        },
      });
    },
    onDelUser = (record: User) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t('confirm_delete')}：${record.displayName} ?`,
        onOk: async (close) => {
          const result = await delUserInfo(record.id);
          if (result === true) {
            if (dataSource.length === 1) {
              const pageInfo = { ...proTableRef.current?.pageInfo };
              pageInfo.current = pageInfo.current ? pageInfo.current > 2 ? pageInfo.current - 1 : 1 : 1;
              proTableRef.current?.setPageInfo?.(pageInfo);
            }
            proTableRef.current?.reload();
            message.success(t('submit_success'));
            close();
          }
        },
      });
    },
    onRemoveOrg = (record: User) => {
      Modal.confirm({
        title: t('remove'),
        content: `${t('confirm_remove')}：${record.displayName} ?`,
        onOk: async (close) => {
          if (props?.orgId) {
            const result = props.orgInfo?.kind === 'root' ? await delUserInfo(record.id) : await removeOrgUser(props.orgId, record.id);
            if (result === true) {
              if (dataSource.length === 1) {
                const pageInfo = { ...proTableRef.current?.pageInfo };
                pageInfo.current = pageInfo.current ? pageInfo.current > 2 ? pageInfo.current - 1 : 1 : 1;
                proTableRef.current?.setPageInfo?.(pageInfo);
              }
              proTableRef.current?.reload();
              message.success(t('submit_success'));
              close();
            }
          }
        },
      });
    },
    onRemoveRole = (record: User) => {
      Modal.confirm({
        title: t('remove'),
        content: `${t('confirm_remove')}：${record.displayName}`,
        onOk: async (close) => {
          if (props.orgRole) {
            const result = await revokeOrgRoleUser(props.orgRole.id, record.id);
            if (result === true) {
              if (dataSource.length === 1) {
                const pageInfo = { ...proTableRef.current?.pageInfo };
                pageInfo.current = pageInfo.current ? pageInfo.current > 2 ? pageInfo.current - 1 : 1 : 1;
                proTableRef.current?.setPageInfo?.(pageInfo);
              }
              proTableRef.current?.reload();
              message.success(t('submit_success'));
              close();
            }
          }
        },
      });
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

  useEffect(() => {
    proTableRef.current?.reload(true);
  }, [props?.orgId]);

  return (
    <>
      {
        ['modal', 'orgUser', 'roleUser'].includes(props?.scene || '') ? (
          <ProTable
            actionRef={proTableRef}
            search={{
              searchText: `${t('query')}`,
              resetText: `${t('reset')}`,
              labelWidth: 'auto',
            }}
            rowKey={'id'}
            toolbar={{
              title: props.title || (props.userType === 'account' ? t('account_list') : t('member_list')),
              actions: props.scene === 'roleUser' ? [
                <Auth authKey="assignRoleUser">
                  <Button
                    type="primary"
                    onClick={() => {
                      setModal({ open: true, title: t('add_member'), scene: 'add' });
                    }}
                  >
                    {t('add_member')}
                  </Button>
                </Auth>,
              ] : props.scene === 'orgUser' ? [
                props.orgInfo?.kind === 'root'
                  ? <Auth authKey="createOrganizationUser">
                    <Button
                      type="primary"
                      onClick={() => {
                        setModal({ open: true, title: t('create_user'), scene: 'create' });
                      }}
                    >
                      {t('create_user')}
                    </Button>
                  </Auth> : '',
                props.orgInfo?.kind === 'root'
                  ? <Button>
                    <Link to="/account/recycle">{t('recycle_bin')}</Link>
                  </Button> : '',
                props.orgInfo?.kind === 'org' ? <Auth authKey="allotOrganizationUser">
                  <Button
                    type="primary"
                    onClick={() => {
                      setModal({ open: true, title: t('add_user'), scene: 'add' });
                    }}
                  >
                    {t('add_user')}
                  </Button>
                </Auth> : '',
              ] : [],
            }}
            scroll={{ x: 'max-content' }}
            columns={columns}
            request={getRequest}
            pagination={{ showSizeChanger: true }}
            rowSelection={false}
          />
        ) : (
          <PageContainer
            header={{
              title: props.userType === 'account' ? t('account_manage') : t('member_manage'),
              style: { background: token.colorBgContainer },
              breadcrumb: {
                items: [
                  { title: t('system_conf') },
                  { title: props.userType === 'account' ? t('account_manage') : t('member_manage') },
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
                title: props?.title || props.userType === 'account' ? t('account_list') : t('member_list'),
                actions: [
                  <Auth authKey="createOrganizationAccount">
                    <Button
                      type="primary"
                      onClick={() => {
                        setModal({
                          open: true,
                          title: props.userType === 'account' ? t('create_account') : t('create_member'),
                          scene: 'create',
                        });
                      }}
                    >
                      {props.userType === 'account' ? t('create_account') : t('create_member')}
                    </Button>
                  </Auth>,
                ],
              }}
              scroll={{ x: 'max-content' }}
              columns={columns}
              request={getRequest}
              pagination={{ showSizeChanger: true }}
            />
          </PageContainer>
        )
      }
      {modal.scene === 'create' ? <AccountCreate
        open={modal.open}
        title={modal.title}
        orgId={basisState.tenantId}
        userType={props.userType || 'member'}
        scene="create"
        onClose={(isSuccess) => {
          if (isSuccess) {
            proTableRef.current?.reload();
            message.success(t('submit_success'));
          }
          setModal({ open: false, title: '', scene: modal.scene });
        }}
      /> : ''}

      {
        // 添加用户
        modal.scene === 'add' && props.orgId && modal.open ? <DrawerUser
          open={modal.open}
          title={modal.title}
          orgId={basisState.tenantId}
          orgRole={props.orgRole}
          orgInfo={props.orgInfo}
          userType={props.userType}
          onClose={(isSuccess) => {
            if (isSuccess) {
              proTableRef.current?.reload();
              message.success(t('submit_success'));
            }
            setModal({ open: false, title: '', scene: modal.scene });
          }}
        />
          : ''
      }
      {
        modal.scene === 'addGroup' && props.orgId && modal.open ? <DrawerRole
          title={modal.title}
          open={modal.open}
          orgId={props.orgId}
          kind={'group'}
          userInfo={modal.data}
          onClose={(isSuccess) => {
            if (isSuccess) {
              proTableRef.current?.reload();
              message.success(t('submit_success'));
            }
            setModal({ open: false, title: '', scene: modal.scene });
          }}
        /> : ''
      }
      {
        modal.scene === 'addPermission' && props.orgId && modal.open ? <DrawerRolePolicy
          orgId={props.orgId}
          userInfo={modal.data}
          open={modal.open}
          title={modal.title}
          onClose={(isSuccess) => {
            if (isSuccess) {
              proTableRef.current?.reload();
              message.success(t('submit_success'));
            }
            setModal({ open: false, title: '', scene: modal.scene });
          }}
        /> : ''
      }
    </>
  );
};


export default forwardRef(UserList);
