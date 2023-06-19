import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Button, Space, Modal, Alert, message } from 'antd';
import { MutableRefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { TableParams } from '@/services/graphql';
import { Link, useSearchParams } from '@ice/runtime';
import CreateOrgRole from './components/create';
import { delOrgRole, getOrgGroupList, getOrgRoleList } from '@/services/org/role';
import store from '@/store';
import { useTranslation } from 'react-i18next';
import DrawerUser from '../../account/components/drawerUser';
import DrawerRolePolicy from '../components/drawerRolePolicy';
import DrawerAppRolePolicy from '@/pages/app/components/drawerRolePolicy';
import Auth from '@/components/Auth';
import KeepAlive from '@/components/KeepAlive';
import { OrgRole, OrgRoleKind, OrgRoleWhereInput } from '@/__generated__/graphql';

export type OrgRoleListRef = {
  getSelect: () => OrgRole[];
  reload: (resetPageIndex?: boolean) => void;
};

const PageOrgRoleList = (props: {
  kind?: OrgRoleKind;
  orgId: string;
  title?: string;
  isMultiple?: boolean;
  ref?: MutableRefObject<OrgRoleListRef>;

}, ref: MutableRefObject<OrgRoleListRef>) => {
  const { t } = useTranslation(),
    { token } = useToken(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    kind: OrgRoleKind = props.kind || OrgRoleKind.Role,
    columns: ProColumns<OrgRole>[] = [
      // 有需要排序配置  sorter: true
      {
        title: t('name'),
        dataIndex: 'name',
        width: 120,
        search: {
          transform: (value) => ({ nameContains: value || undefined }),
        },
      },
      { title: t('remarks'), dataIndex: 'comments', width: 120, search: false },

    ],
    [dataSource, setDataSource] = useState<OrgRole[]>([]),
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
    // 弹出层处理
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
      id: string;
      data?: OrgRole;
      scene: 'editor' | 'addUser' | 'addPermission' | 'addAppPermission';
    }>({
      open: false,
      title: '',
      id: '',
      scene: 'editor',
    });

  if (kind === 'role') {
    columns.push({
      title: t('type'),
      dataIndex: 'actions',
      fixed: 'right',
      search: false,
      renderText(text, record) {
        return record.isAppRole ? t('system_role') : t('custom_role');
      },
    });
  }

  columns.push({
    title: t('operation'),
    dataIndex: 'actions',
    fixed: 'right',
    align: 'center',
    search: false,
    width: 210,
    render: (text, record) => {
      return (<Space>
        {
          record.isAppRole ? <>
            <Link to={`/org/${record.kind}s/viewer?id=${record.id}`}>
              {t('view')}
            </Link>
            <Auth authKey="assignRoleUser">
              <a onClick={() => {
                setModal({ open: true, title: t('add_member'), id: '', data: record, scene: 'addUser' });
              }}
              >
                {t('add_member')}
              </a>
            </Auth>
          </>
            : <>
              <Link to={`/org/${record.kind}s/viewer?id=${record.id}`}>
                {t('view')}
              </Link>
              <Auth authKey="assignRoleUser">
                <a onClick={() => {
                  setModal({ open: true, title: t('add_member'), id: '', data: record, scene: 'addUser' });
                }}
                >
                  {t('add_member')}
                </a>
              </Auth>
              <Auth authKey="grant">
                <a onClick={() => {
                  setModal({ open: true, title: t('add_permission'), id: '', data: record, scene: 'addPermission' });
                }}
                >
                  {t('add_permission')}
                </a>
              </Auth>
              <Auth authKey="deleteRole">
                <a onClick={() => {
                  onDel(record);
                }}
                >
                  {t('delete')}
                </a>
              </Auth>
            </>
        }

      </Space>);
    },
  });


  const
    getRequest = async (params: TableParams) => {
      const table = { data: [] as OrgRole[], success: true, total: 0 },
        where: OrgRoleWhereInput = {};
      where.kind = kind;
      where.orgID = props.orgId;
      where.nameContains = params.nameContains;
      const result = kind === OrgRoleKind.Role ? await getOrgRoleList({
        current: params.current,
        pageSize: params.pageSize,
        where,
      }) : await getOrgGroupList({
        current: params.current,
        pageSize: params.pageSize,
        where,
      });
      if (result?.totalCount) {
        table.data = result.edges?.map(item => item?.node) as OrgRole[];
        table.total = result.totalCount;
      }
      setDataSource(table.data);
      setSelectedRowKeys([]);
      return table;
    },
    onDel = (record: OrgRole) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t('confirm_delete')}：${record.name}?`,
        onOk: async (close) => {
          const result = await delOrgRole(record.id);
          if (result === true) {
            if (dataSource.length === 1) {
              const pageInfo = { ...proTableRef.current?.pageInfo };
              pageInfo.current = pageInfo.current ? pageInfo.current > 2 ? pageInfo.current - 1 : 1 : 1;
              proTableRef.current?.setPageInfo?.(pageInfo);
            }
            proTableRef.current?.reload();
            message.success('submit_success');
            close();
          }
        },
      });
    },
    onDrawerClose = (isSuccess: boolean) => {
      if (isSuccess) {
        proTableRef.current?.reload();
      }
      setModal({ open: false, title: '', id: '', scene: 'editor' });
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
  }, [props.orgId]);

  return (
    <>

      <PageContainer
        header={{
          title: kind == 'role' ? t('role') : t('user_group'),
          style: { background: token.colorBgContainer },
          breadcrumb: {
            items: kind == 'role' ? [
              { title: t('org_cooperation') },
              { title: t('role') },
            ] : [
              { title: t('org_cooperation') },
              { title: t('user_group') },
            ],
          },
          children: <Alert
            showIcon
            message={kind == 'role' ? <>
              <div>{t('org_role_alert_msg')}</div>
            </> : <>
              <div>{t('org_user_group_alert_msg_1')}</div>
              <div>{t('org_user_group_alert_msg_2')}</div>
              <div>{t('org_user_group_alert_msg_3')}</div>
            </>}
          />,
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
            title: kind == 'role' ? t('role_list') : t('user_group_list'),
            actions: [
              <Auth authKey="createRole">
                <Button
                  type="primary"
                  onClick={() => {
                    setModal({ open: true, title: `${kind == 'role' ? t('create_role') : t('create_user_group')}`, id: '', scene: 'editor' });
                  }}
                >
                  {kind == 'role' ? t('create_role') : t('create_user_group')}
                </Button>
              </Auth>,
            ],
          }}
          scroll={{ x: 'max-content' }}
          columns={columns}
          request={getRequest}
        />
        <CreateOrgRole
          x-if={modal.scene === 'editor'}
          open={modal.open}
          title={modal.title}
          id={modal.id}
          kind={kind}
          orgId={props.orgId}
          onClose={onDrawerClose}
        />
        <DrawerUser
          x-if={modal.scene === 'addUser' && modal.open}
          open={modal.open}
          title={modal.title}
          orgId={props.orgId}
          orgRole={modal.data}
          onClose={(isSuccess) => {
            if (isSuccess) {
              proTableRef.current?.reload();
            }
            setModal({ open: false, title: modal.title, scene: modal.scene, id: '' });
          }}
        />
        <DrawerRolePolicy
          x-if={modal.scene === 'addPermission' && modal.open}
          orgId={props.orgId}
          orgRoleInfo={modal.data}
          open={modal.open}
          title={modal.title}
          onClose={(isSuccess) => {
            if (isSuccess) {
              proTableRef.current?.reload();
            }
            setModal({ open: false, title: modal.title, scene: modal.scene, id: '' });
          }}
        />
        <DrawerAppRolePolicy
          x-if={modal.scene === 'addAppPermission' && modal.open}
          open={modal.open}
          title={modal.title}
          onClose={(isSuccess) => {
            if (isSuccess) {
              proTableRef.current?.reload();
            }
            setModal({ open: false, title: modal.title, scene: modal.scene, id: '' });
          }}
        />
      </PageContainer>
    </>
  );
};

export const OrgRoleList = forwardRef(PageOrgRoleList);

export default () => {
  const [basisState] = store.useModel('basis'),
    [searchParams] = useSearchParams(),
    orgId = searchParams.get('id') || basisState.tenantId;

  return (<KeepAlive clearAlive>
    <OrgRoleList orgId={orgId} />
  </KeepAlive>);
};
