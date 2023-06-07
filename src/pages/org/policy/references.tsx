import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
  useToken,
} from '@ant-design/pro-components';
import { Space, Modal, Alert } from 'antd';
import { useRef, useState } from 'react';
import { TableParams, TableSort, TableFilter } from '@/services/graphql';
import { useSearchParams } from '@ice/runtime';
import { EnumPermissionPrincipalKind, Permission, delPermssion, getOrgPolicyReferenceList } from '@/services/permission';
import { OrgPolicy, getOrgPolicyInfo } from '@/services/org/policy';
import { useTranslation } from 'react-i18next';
import Auth from '@/components/Auth';

export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    [searchParams] = useSearchParams(),
    [orgPolicyInfo, setOrgPolicy] = useState<OrgPolicy>(),
    columns: ProColumns<Permission>[] = [
      // 有需要排序配置  sorter: true
      {
        title: t('name'),
        dataIndex: 'keyword',
        width: 120,
        render: (text, record) => {
          return record.principalKind === 'role' ? record.role?.name : record.user?.displayName;
        },
      },
      {
        title: t('type'),
        dataIndex: 'principalKind',
        filters: true,
        search: false,
        width: 100,
        valueEnum: EnumPermissionPrincipalKind,
      },
      // {
      //     title: t('status'), dataIndex: 'status', filters: true, search: false, width: 100,
      //     valueEnum: EnumPermissionStatus,
      // },
      {
        title: t('operation'),
        dataIndex: 'actions',
        fixed: 'right',
        align: 'center',
        search: false,
        width: 170,
        render: (text, record) => {
          return record.isAllowRevoke ? <Space>
            <Auth authKey="revoke">
              <a onClick={() => {
                revokeOrg(record);
              }}
              >
                {t('disauthorization')}
              </a>
            </Auth>
          </Space> : '';
        },
      },
    ],
    [dataSource, setDataSource] = useState<Permission[]>([]);


  const
    getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
      const table = { data: [] as Permission[], success: true, total: 0 },
        orgPolicyId = searchParams.get('id');
      if (orgPolicyId) {
        const info = orgPolicyInfo?.id == orgPolicyId ? orgPolicyInfo : await getOrgPolicyInfo(orgPolicyId);
        if (info?.id) {
          setOrgPolicy(info);
          if (params.keyword) {
            params.or = [
              { hasRoleWith: { nameContains: params.keyword } },
              { hasUserWith: { displayNameContains: params.keyword } },
            ];
          }
          delete params.keyword;
          const result = await getOrgPolicyReferenceList(orgPolicyId, params, filter, sort);
          if (result) {
            table.data = result.edges.map(item => item.node);
            table.total = result.totalCount;
          } else {
            table.total = 0;
          }
        }
      }
      setDataSource(table.data);
      return table;
    },
    revokeOrg = (record: Permission) => {
      Modal.confirm({
        title: t('disauthorization'),
        content: `${t('confirm disauthorization')}${EnumPermissionPrincipalKind[record.principalKind].text}：${record.role?.name}?`,
        onOk: async (close) => {
          const result = await delPermssion(record.id, record.orgID);
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
    };

  return (
    <>
      <PageContainer
        header={{
          title: t('reference record'),
          style: { background: token.colorBgContainer },
          breadcrumb: {
            items: [
              { title: t('System configuration') },
              { title: t('{{field}} management', { field: t('organization') }) },
              { title: t('policy') },
              { title: t('reference record') },
            ],
          },
          children: <Alert showIcon message={t('Reference records are used to view the authorization status of the permission policy')} />,
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
            title: `${t('policy')}：${orgPolicyInfo?.name || '-'}`,
          }}
          scroll={{ x: 'max-content' }}
          columns={columns}
          request={getRequest}
          pagination={{ showSizeChanger: true }}
        />
      </PageContainer >
    </>
  );
};

