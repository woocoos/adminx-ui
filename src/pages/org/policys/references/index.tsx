import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Space, Modal, Alert } from 'antd';
import { useRef, useState } from 'react';
import { Link, useSearchParams } from '@ice/runtime';
import { EnumPermissionPrincipalKind, delPermssion, getOrgPolicyReferenceList } from '@/services/adminx/permission';
import { getOrgPolicyInfo } from '@/services/adminx/org/policy';
import { useTranslation } from 'react-i18next';
import Auth from '@/components/Auth';
import { OrgPolicy, Permission, PermissionPrincipalKind, PermissionWhereInput } from '@/generated/adminx/graphql';

export default (props: {
  isFromSystem?: boolean;
}) => {
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
    revokeOrg = (record: Permission) => {
      Modal.confirm({
        title: t('disauthorization'),
        content: `${t('confirm_disauthorization')}${EnumPermissionPrincipalKind[record.principalKind].text}：${record.role?.name}?`,
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
          title: t('reference_record'),
          style: { background: token.colorBgContainer },
          breadcrumb: {
            items: props.isFromSystem ? [
              { title: t('system_conf') },
              { title: <Link to={'/system/org'}>{t('org_manage')}</Link> },
              { title: <Link to={`/system/org/policys?id=${orgPolicyInfo?.orgID}`}>{t('policy')}</Link> },
              { title: t('reference_record') },
            ] : [
              { title: t('org_cooperation') },
              { title: <Link to={'/org/policys'}>{t('policy')}</Link> },
              { title: t('reference_record') },
            ],
          },
          children: <Alert showIcon message={t('reference_record_alert_msg')} />,
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
          request={async (params, sort, filter) => {
            const table = { data: [] as Permission[], success: true, total: 0 },
              orgPolicyId = searchParams.get('id');
            if (orgPolicyId) {
              const info = orgPolicyInfo?.id == orgPolicyId ? orgPolicyInfo : await getOrgPolicyInfo(orgPolicyId);
              if (info?.id) {
                setOrgPolicy(info as OrgPolicy);
                const where: PermissionWhereInput = {};
                if (params.keyword) {
                  where.or = [
                    { hasRoleWith: [{ nameContains: params.keyword }] },
                    { hasUserWith: [{ displayNameContains: params.keyword }] },
                  ];
                }
                where.principalKindIn = filter.principalKind as PermissionPrincipalKind[] | null;
                const result = await getOrgPolicyReferenceList(orgPolicyId, {
                  current: params.current,
                  pageSize: params.pageSize,
                  where,
                });
                if (result) {
                  table.data = result.edges?.map(item => item?.node) as Permission[] || [];
                  table.total = result.totalCount;
                } else {
                  table.total = 0;
                }
              }
            }
            setDataSource(table.data);
            return table;
          }}
          pagination={{ showSizeChanger: true }}
        />
      </PageContainer >
    </>
  );
};

