
import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Button, Space, Modal, message, Alert } from 'antd';
import { useRef, useState } from 'react';
import { TableSort, TableParams, TableFilter } from '@/services/graphql';
import { useSearchParams } from '@ice/runtime';
import { Org } from '@/services/org';
import ModalOrg from '@/pages/org/components/modalOrg';
import { getAppRoleAssignedOrgList } from '@/services/app/org';
import { AppRole, getAppRoleInfo } from '@/services/app/role';
import { assignOrgAppRole, revokeOrgAppRole } from '@/services/org/role';
import { useTranslation } from 'react-i18next';
import Auth from '@/components/Auth';


export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    [appRoleInfo, setAppRoleInfo] = useState<AppRole>(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<Org>[] = [
      // 有需要排序配置  sorter: true
      {
        title: t('name'),
        dataIndex: 'name',
        width: 120,
        search: {
          transform: (value) => ({ nameContains: value || undefined }),
        },
      },
      { title: t('introduction'), dataIndex: 'profile', width: 120, search: false },
      {
        title: t('manage_user'),
        dataIndex: 'owner',
        width: 120,
        search: false,
        render: (text, record) => {
          return record.owner?.displayName;
        },
      },
      {
        title: t('operation'),
        dataIndex: 'actions',
        fixed: 'right',
        align: 'center',
        search: false,
        width: 110,
        render: (text, record) => {
          return (<Space>
            <Auth authKey="revokeOrganizationAppRole">
              <a key="del" onClick={() => onDel(record)}>
                {t('disauthorization')}
              </a>
            </Auth>
          </Space>);
        },
      },
    ],
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
    // 弹出层处理
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
    }>({
      open: false,
      title: '',
    });


  const
    getInfo = async () => {
      let info: AppRole | null = null,
        appRoleId = searchParams.get('id');
      if (appRoleInfo?.id == appRoleId) {
        return appRoleInfo;
      }
      if (appRoleId) {
        info = await getAppRoleInfo(appRoleId, ['app']);
        if (info?.id) {
          setAppRoleInfo(info);
        }
      }
      return info;
    },
    getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
      const table = { data: [] as Org[], success: true, total: 0 },
        info = await getInfo();
      if (info) {
        const result = await getAppRoleAssignedOrgList(info.id, params, filter, sort);
        if (result) {
          table.data = result;
          table.total = result.length;
        }
      }
      setSelectedRowKeys([]);
      return table;
    },
    onDel = (record: Org) => {
      if (appRoleInfo) {
        Modal.confirm({
          title: t('disauthorization'),
          content: `${t('confirm_disauthorization')}：${record.name}?`,
          onOk: async (close) => {
            const result = await revokeOrgAppRole(record.id, appRoleInfo.id);
            if (result) {
              proTableRef.current?.reload();
              message.success(t('submit_success'));
              close();
            }
          },
        });
      }
    };

  return (
    <PageContainer
      header={{
        title: t('app_role_auth'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: t('app_manage') },
            { title: t('app_role') },
            { title: t('app_role_auth') },
          ],
        },
        children: <Alert showIcon message={t('app_role_auth_alert_children')} />,

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
          title: <Space>
            <span>{t('app')}：{appRoleInfo?.app?.name || '-'}</span>
            <span>{t('role')}：{appRoleInfo?.name || '-'}</span>
          </Space>,
          actions: [
            <Auth authKey="assignOrganizationAppRole">
              <Button
                type="primary"
                onClick={() => {
                  setModal({ open: true, title: '' });
                }}
              >
                {t('add_org_auth')}
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
      <ModalOrg
        x-if={appRoleInfo}
        open={modal.open}
        title={t('search_org')}
        tableTitle={`${t('app')}：${appRoleInfo?.app?.name} ${t('auth_org_list')}`}
        appId={appRoleInfo?.appID}
        onClose={async (selectData) => {
          const sdata = selectData?.[0];
          if (sdata && appRoleInfo) {
            const result = await assignOrgAppRole(sdata.id, appRoleInfo.id);
            if (result) {
              proTableRef.current?.reload();
              message.success(t('submit_success'));
            }
          }
          setModal({ open: false, title: '' });
        }}
      />
    </PageContainer>
  );
};
