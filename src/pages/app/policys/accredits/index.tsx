
import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Button, Space, Modal, message, Alert } from 'antd';
import { useRef, useState } from 'react';
import { Link, useSearchParams } from '@ice/runtime';
import { getAppPolicyInfo } from '@/services/adminx/app/policy';
import { assignOrgAppPolicy, revokeOrgAppPolicy } from '@/services/adminx/org/policy';
import ModalOrg from '@/pages/org/components/modalOrg';
import { getAppPolicyAssignedOrgList } from '@/services/adminx/app/org';
import { useTranslation } from 'react-i18next';
import Auth from '@/components/auth';
import { AppPolicy, Org, OrgWhereInput } from '@/generated/adminx/graphql';


export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    [appPolicyInfo, setAppPolicyInfo] = useState<AppPolicy>(),
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
            <Auth authKey="revokeOrganizationAppPolicy">
              {record.isAllowRevokeAppPolicy ? <a key="del" onClick={() => onDel(record)}>
                {t('disauthorization')}
              </a> : ''}
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
      const appPolicyId = searchParams.get('id');
      if (appPolicyId) {
        const restult = await getAppPolicyInfo(appPolicyId);
        if (restult?.id) {
          setAppPolicyInfo(restult as AppPolicy);
          return restult;
        }
      }
      return null;
    },
    onDel = (record: Org) => {
      if (appPolicyInfo) {
        Modal.confirm({
          title: t('disauthorization'),
          content: `${t('confirm_disauthorization')}：${record.name}`,
          onOk: async (close) => {
            const result = await revokeOrgAppPolicy(record.id, appPolicyInfo.id);
            if (result) {
              message.success(t('submit_success'));
              proTableRef.current?.reload();
              close();
            }
          },
        });
      }
    };

  return (
    <PageContainer
      header={{
        title: t('app_permission_policy_auth'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: <Link to={'/system/app'}>{t('app_manage')}</Link> },
            { title: <Link to={`/app/policys?id=${appPolicyInfo?.appID}`}>{t('policy')}</Link> },
            { title: t('app_permission_policy_auth') },
          ],
        },
        children: <Alert showIcon message={t('app_permission_policy_auth_alert_children')} />,

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
          title: <Space>
            <span>{t('app')}：{appPolicyInfo?.app?.name || '-'}</span>
            <span>{t('policy')}：{appPolicyInfo?.name || '-'}</span>
          </Space>,
          actions: [
            <Auth authKey="assignOrganizationAppPolicy">
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
        request={async (params) => {
          const table = { data: [] as Org[], success: true, total: 0 },
            where: OrgWhereInput = {},
            info = searchParams.get('id') == appPolicyInfo?.id ? appPolicyInfo : await getInfo();
          where.nameContains = params.nameContains;
          if (info) {
            const result = await getAppPolicyAssignedOrgList(info.id, where, {
              appPolicyId: info.id,
            });
            if (result) {
              table.data = result as Org[];
              table.total = result.length;
            }
          }
          setSelectedRowKeys([]);
          return table;
        }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys); },
          type: 'checkbox',
        }}
      />
      <ModalOrg
        x-if={appPolicyInfo}
        open={modal.open}
        title={t('search_org')}
        tableTitle={`${t('app')}：${appPolicyInfo?.app?.name} ${t('auth_org_list', { field: t('auth_org') })}`}
        appId={appPolicyInfo?.appID || ''}
        onClose={async (selectData) => {
          const sdata = selectData?.[0];
          if (sdata && appPolicyInfo) {
            const result = await assignOrgAppPolicy(sdata.id, appPolicyInfo.id);
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
