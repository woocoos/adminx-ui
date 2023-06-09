import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Button, Space, Modal, Alert } from 'antd';
import { useRef, useState } from 'react';
import { TableSort, TableParams, TableFilter } from '@/services/graphql';
import { App, getAppInfo } from '@/services/app';
import { AppPolicy, EnumAppPolicyStatus, delAppPolicy, getAppPolicyList } from '@/services/app/policy';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from '@ice/runtime';
import Auth from '@/components/Auth';
import KeepAlive from '@/components/KeepAlive';


const PageAppPolicys = (props: {
  appId?: string;
}) => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [appInfo, setAppInfo] = useState<App>(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<AppPolicy>[] = [
      // 有需要排序配置  sorter: true
      { title: t('name'), dataIndex: 'name', width: 120 },
      {
        title: t('auto_authorization'),
        dataIndex: 'autoGrant',
        width: 120,
        search: false,
        render: (text, record) => {
          return record.autoGrant ? t('yes') : t('no');
        },
      },
      { title: t('status'), dataIndex: 'status', width: 120, valueEnum: EnumAppPolicyStatus },
      { title: t('description'), dataIndex: 'comments', width: 120, search: false },
      {
        title: t('operation'),
        dataIndex: 'actions',
        fixed: 'right',
        align: 'center',
        search: false,
        width: 110,
        render: (text, record) => {
          return (<Space>
            <Auth authKey="updateAppPolicy">
              <Link key="editor" to={`/app/policys/viewer?id=${record.id}`} >
                {t('edit')}
              </Link>
            </Auth>
            <Link key="org" to={`/app/policys/accredits?id=${record.id}`} >
              {t('authorization')}
            </Link>
            <Auth authKey="deleteAppPolicy">
              <a key="del" onClick={() => onDel(record)}>
                {t('delete')}
              </a>
            </Auth>
          </Space>);
        },
      },
    ],
    [dataSource, setDataSource] = useState<AppPolicy[]>([]),
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);


  const
    getApp = async () => {
      let info: App | null = null;
      if (props.appId) {
        info = await getAppInfo(props.appId);
        if (info?.id) {
          setAppInfo(info);
        }
      }
      return info;
    },
    getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
      const table = { data: [] as AppPolicy[], success: true, total: 0 },
        info = props.appId == appInfo?.id ? appInfo : await getApp();
      if (info) {
        const result = await getAppPolicyList(info.id, params, filter, sort);
        if (result) {
          // 前端过滤
          table.data = result.filter(item => {
            let isTrue = true;
            if (params.name) {
              isTrue = item.name.indexOf(params.name) > -1;
            }
            if (isTrue && params.status) {
              isTrue = item.status === params.status;
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
    onDel = (record: AppPolicy) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t('confirm_delete')}：${record.name}`,
        onOk: async (close) => {
          const result = await delAppPolicy(record.id);
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
    <PageContainer
      header={{
        title: t('policy'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: t('app_manage') },
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
        rowKey={'id'}
        search={{
          searchText: `${t('query')}`,
          resetText: `${t('reset')}`,
          labelWidth: 'auto',
        }}
        toolbar={{
          title: `${t('app')}:${appInfo?.name || '-'}`,
          actions: [
            <Auth authKey="createAppPolicy">
              <Button key="created" type="primary">
                <Link to={`/app/policys/viewer?appId=${appInfo?.id || ''}`}>
                  {t('create_policy')}
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
  );
};


export default () => {
  const [searchParams] = useSearchParams(),
    appId = searchParams.get('id') || '';

  return (<KeepAlive clearAlive={true}>
    <PageAppPolicys appId={appId} />
  </KeepAlive>);
};
