
import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Button, Space, Modal, message } from 'antd';
import { useRef, useState } from 'react';
import { TableParams } from '@/services/graphql';
import { Link, useSearchParams } from '@ice/runtime';
import { getAppRoleInfo, getAppRoleInfoPolicieList, revokeAppRolePolicy } from '@/services/app/role';
import { useTranslation } from 'react-i18next';
import Auth from '@/components/Auth';
import DrawerRolePolicy from '../../components/drawerRolePolicy';
import { AppRole, AppPolicy, App } from '@/__generated__/graphql';


export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    [appRoleInfo, setAppRoleInfo] = useState<AppRole>(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<AppPolicy>[] = [
      // 有需要排序配置  sorter: true
      { title: t('name'), dataIndex: 'name', width: 120 },
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
            <Auth authKey="revokeAppRolePolicy">
              <a key="del" onClick={() => onDel(record)}>
                {t('remove')}
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
      const appRoleId = searchParams.get('id');
      if (appRoleInfo?.id == appRoleId) {
        return appRoleInfo;
      }
      if (appRoleId) {
        const result = await getAppRoleInfo(appRoleId);
        if (result?.id) {
          setAppRoleInfo(result as AppRole);
          return result;
        }
      }
      return null;
    },
    getRequest = async (params: TableParams) => {
      const table = { data: [] as AppPolicy[], success: true, total: 0 },
        info = await getInfo();
      if (info) {
        const result = await getAppRoleInfoPolicieList(info.id);
        if (result) {
          table.data = result.policies?.filter(item => {
            if (params.name) {
              return item.name.indexOf(params.name) > -1;
            }
            return true;
          }) as AppPolicy[] || [];
          table.total = table.data?.length;
        }
      }
      setSelectedRowKeys([]);
      return table;
    },
    onDel = (record: AppPolicy) => {
      if (appRoleInfo) {
        Modal.confirm({
          title: t('remove'),
          content: `${t('confirm_remove')}：${record.name}?`,
          onOk: async (close) => {
            const result = await revokeAppRolePolicy(appRoleInfo.appID || '', appRoleInfo.id, [record.id]);
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
        title: t('app_role_permissions'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: <Link to={'/system/app'}>{t('app_manage')}</Link> },
            { title: <Link to={`/app/roles?id=${appRoleInfo?.appID}`}>{t('app_role')}</Link> },
            { title: t('app_role_permissions') },
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
          title: <Space>
            <span>{t('app')}：{appRoleInfo?.app?.name || '-'}</span>
            <span>{t('role')}：{appRoleInfo?.name || '-'}</span>
          </Space>,
          actions: [
            <Auth authKey="assignAppRolePolicy">
              <Button
                type="primary"
                onClick={() => {
                  setModal({ open: true, title: t('add_permission') });
                }}
              >
                {t('add_permission')}
              </Button>
            </Auth>,
          ],
        }}
        scroll={{ x: 'max-content', y: 500 }}
        columns={columns}
        request={getRequest}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys); },
          type: 'checkbox',
        }}
        pagination={false}
      />
      <DrawerRolePolicy
        x-if={modal.open}
        open={modal.open}
        title={modal.title}
        appInfo={appRoleInfo?.app as App}
        roleInfo={appRoleInfo}
        onClose={(isSuccess) => {
          if (isSuccess) {
            proTableRef.current?.reload();
          }
          setModal({ open: false, title: '' });
        }}
      />
    </PageContainer>
  );
};
