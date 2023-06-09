import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
  useToken,
} from '@ant-design/pro-components';
import { Button, Space, Modal, message, Alert, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { TableSort, TableParams, TableFilter } from '@/services/graphql';
import { Link, useSearchParams } from '@ice/runtime';
import { Org, getOrgInfo } from '@/services/org';
import { OrgPolicy, delOrgPolicy, getOrgPolicyList } from '@/services/org/policy';
import store from '@/store';
import { useTranslation } from 'react-i18next';
import Auth from '@/components/Auth';
import KeepAlive from '@/components/KeepAlive';


export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [basisState] = store.useModel('basis'),
    [searchParams] = useSearchParams(),
    [orgInfo, setOrgInfo] = useState<Org>(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<OrgPolicy>[] = [
      // 有需要排序配置  sorter: true
      {
        title: t('name'),
        dataIndex: 'name',
        width: 120,
        search: {
          transform: (value) => ({ nameContains: value || undefined }),
        },
      },
      { title: t('description'), dataIndex: 'comments', width: 120, search: false },
      {
        title: t('policy_type'),
        dataIndex: 'type',
        width: 120,
        renderFormItem(schema, config, form) {
          return (<Select
            allowClear
            options={[
              { label: t('system_strategy'), value: 'sys' },
              { label: t('custom_policy'), value: 'cust' },
            ]}
            onChange={(value) => {
              form.setFieldValue('type', value);
            }}
          />);
        },
        render: (text, record) => (<span>{record.appPolicyID ? t('system_strategy') : t('custom_policy')}</span>),
      },
      {
        title: t('operation'),
        dataIndex: 'actions',
        fixed: 'right',
        align: 'center',
        search: false,
        width: 110,
        render: (text, record) => {
          return record.appPolicyID ? <Space>
            <Link key="editor" to={`/org/policys/references?id=${record.id}`} >
              {t('reference_record')}
            </Link>
          </Space> : <Space>
            <Link key="editor" to={`/org/policys/viewer?id=${record.id}`} >
              {t('view')}
            </Link>
            <Link key="reference" to={`/org/policys/references?id=${record.id}`} >
              {t('reference_record')}
            </Link>
            <Auth authKey="deleteOrganizationPolicy">
              <a key="del" onClick={() => onDel(record)}>
                {t('delete')}
              </a>
            </Auth>
          </Space>;
        },
      },
    ],
    [dataSource, setDataSource] = useState<OrgPolicy[]>([]),
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);


  const
    getOrg = async () => {
      let result: Org | null = null;
      const orgId = searchParams.get('id') || basisState.tenantId;
      if (orgId) {
        result = await getOrgInfo(orgId);
        if (result?.id) {
          setOrgInfo(result);
        }
      }
      return result;
    },
    getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
      const table = { data: [] as OrgPolicy[], success: true, total: 0 },
        info = await getOrg();
      if (info?.id) {
        if (params.type) {
          params.appPolicyIDNotNil = params.type === 'sys' ? true : undefined;
          params.appPolicyIDIsNil = params.type === 'cust' ? true : undefined;
        }
        delete params.type;
        const result = await getOrgPolicyList(info?.id, params, filter, sort);
        if (result) {
          table.data = result.edges.map(item => item.node);
          table.total = result.totalCount;
        } else {
          table.total = 0;
        }
      }
      setSelectedRowKeys([]);
      setDataSource(table.data);
      return table;
    },
    onDel = (record: OrgPolicy) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t('confirm_delete')}：${record.name}?`,
        onOk: async (close) => {
          const result = await delOrgPolicy(record.id);
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
    };

  useEffect(() => {
    proTableRef.current?.reload(true);
  }, [searchParams]);

  return (
    <KeepAlive clearAlive={true}>
      <PageContainer
        header={{
          title: t('policy'),
          style: { background: token.colorBgContainer },
          breadcrumb: {
            items: searchParams.get('id') ? [
              { title: t('system_conf') },
              { title: t('org_manage') },
              { title: t('policy') },
            ] : [
              { title: t('org_cooperation') },
              { title: t('policy') },
            ],
          },
          children: <Alert
            showIcon
            message={
              <>
                <div key="1">{t('app_manage_policy_alert_childre_1')}</div>
                <div key="2">{t('system_strategy')}：{t('app_manage_policy_alert_childre_2')}</div>
                <div key="3">{t('custom_policy')}：{t('app_manage_policy_alert_childre_3')}</div>
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
            title: `${t('organization')}:${orgInfo?.name || '-'}`,
            actions: [
              <Auth authKey="createOrganizationPolicy">
                <Button type="primary">
                  <Link key="editor" to={`/org/policys/viewer?orgId=${orgInfo?.id}`} >
                    {t('custom_policy')}
                  </Link>
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
      </PageContainer>
    </KeepAlive>
  );
};
