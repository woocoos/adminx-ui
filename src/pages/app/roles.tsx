import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Button, Space, Dropdown, Modal, Alert } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { TableSort, TableParams, TableFilter } from '@/services/graphql';
import { Link, useSearchParams } from '@ice/runtime';
import { App, getAppInfo } from '@/services/app';
import CreateAppRole from './components/createRole';
import { AppRole, delAppRole, getAppRoleList } from '@/services/app/role';
import { useTranslation } from 'react-i18next';
import DrawerRolePolicy from './components/drawerRolePolicy';
import Auth, { checkAuth } from '@/components/Auth';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { useAuth } from 'ice';
import KeepAlive from '@/components/KeepAlive';


export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [auth] = useAuth(),
    [searchParams] = useSearchParams(),
    [appInfo, setAppInfo] = useState<App>(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<AppRole>[] = [
      // 有需要排序配置  sorter: true
      { title: t('name'), dataIndex: 'name', width: 120 },
      { title: t('description'), dataIndex: 'comments', width: 120, search: false },
      {
        title: t('automatic authorization'),
        dataIndex: 'autoGrant',
        width: 120,
        search: false,
        sorter: true,
        render: (text, record) => {
          return record.autoGrant ? t('yes') : t('no');
        },
      },
      {
        title: t('post-authorization editing'),
        dataIndex: 'editable',
        width: 120,
        search: false,
        sorter: true,
        render: (text, record) => {
          return record.editable ? t('yes') : t('no');
        },
      },
      {
        title: t('operation'),
        dataIndex: 'actions',
        fixed: 'right',
        align: 'center',
        search: false,
        width: 120,
        render: (text, record) => {
          const items: ItemType[] = [];
          if (checkAuth('assignAppRolePolicy', auth)) {
            items.push(
              {
                key: 'policy',
                label: <Link to={`/app/role/policys?id=${record.id}`}>
                  {t('permission')}
                </Link>,
              },
            );
          }
          if (checkAuth('deleteAppRole', auth)) {
            items.push(
              { key: 'delete', label: <a onClick={() => onDel(record)}>{t('delete')}</a> },
            );
          }
          return (<Space>
            <Auth authKey="updateAppRole">
              <a
                key="editor"
                onClick={() => {
                  setModal({
                    open: true, title: `${t('edit')}:${record.name}`, id: record.id, scene: 'create',
                  });
                }}
              >
                {t('edit')}
              </a>
            </Auth>
            <Link key="sq" to={`/app/role/accredits?id=${record.id}`}>
              {t('authorization')}
            </Link>
            {items.length ? <Dropdown
              trigger={['click']}
              menu={{
                items,
              }}
            >
              <a><EllipsisOutlined /></a>
            </Dropdown> : ''}
          </Space>);
        },
      },
    ],
    [dataSource, setDataSource] = useState<AppRole[]>([]),
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
    // 弹出层处理
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
      id: string;
      roleInfo?: AppRole;
      scene: 'create' | 'addPolicy';
    }>({
      open: false,
      title: '',
      id: '',
      scene: 'create',
    });


  const
    getApp = async () => {
      let info: App | null = null,
        appId = searchParams.get('id');
      if (appId) {
        info = await getAppInfo(appId);
        if (info?.id) {
          setAppInfo(info);
        }
      }
      return info;
    },
    getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
      const table = { data: [] as AppRole[], success: true, total: 0 },
        info = searchParams.get('id') == appInfo?.id ? appInfo : await getApp();
      if (info) {
        const result = await getAppRoleList(info.id, params, filter, sort);
        if (result) {
          table.data = result.filter(item => {
            let isTrue = true;
            if (params.name) {
              isTrue = item.name.indexOf(params.name) > -1;
            }
            return isTrue;
          });
          table.total = table.data.length;
        }
      }
      setSelectedRowKeys([]);
      setDataSource(table.data);
      return table;
    },
    onDel = (record: AppRole) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t('confirm delete')}：${record.name}`,
        onOk: async (close) => {
          const result = await delAppRole(record.id);
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
    },
    onDrawerClose = (isSuccess: boolean) => {
      if (isSuccess) {
        proTableRef.current?.reload();
      }
      setModal({ open: false, title: '', id: '', scene: modal.scene });
    };


  return (
    <KeepAlive>
      <PageContainer
        header={{
          title: t('Application role'),
          style: { background: token.colorBgContainer },
          breadcrumb: {
            items: [
              { title: t('System configuration') },
              { title: t('{{field}} management', { field: t('app') }) },
              { title: t('Application role') },
            ],
          },
          children: <Alert
            showIcon
            message={
              <>
                <div key="1">{t('An application role is a set of application permission policies. When an application is authorized to a tenant, the role determines the application permission granted to the tenant')}</div>
                <div key="2">{t('automatic authorization')}：{t('When an application is authorized to a tenant, all roles of the automatic authorization type are authorized to the tenant and the administrator of the tenant')}</div>
                <div key="3">{t('manual authorization')}：{t('After an application is authorized to a tenant, the system administrator can use the xxx function to authorize the non-automatic role to the tenant')}</div>
              </>
            }
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
            title: `${t('app')}:${appInfo?.name || '-'}`,
            actions: [
              <Auth authKey="createAppRole">
                <Button
                  key="created"
                  type="primary"
                  onClick={() => {
                    setModal({ open: true, title: t('create {{field}}', { field: t('role') }), id: '', scene: 'create' });
                  }}
                >
                  {t('create {{field}}', { field: t('role') })}
                </Button>
              </Auth>,
            ],
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
        <CreateAppRole
          x-if={modal.scene === 'create'}
          open={modal.open}
          title={modal.title}
          id={modal.id}
          appId={appInfo?.id}
          onClose={onDrawerClose}
        />
        <DrawerRolePolicy
          x-if={modal.scene === 'addPolicy' && modal.open}
          open={modal.open}
          title={modal.title}
          appInfo={appInfo}
          roleInfo={modal.roleInfo}
          onClose={onDrawerClose}
        />
      </PageContainer>
    </KeepAlive>
  );
};
