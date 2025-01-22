import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Button, Space, Modal } from 'antd';
import { MutableRefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { getAppInfo } from '@/services/adminx/app';
import { getUserDevices, delUserDevice, EnumUserDeviceStatus, getUserInfo } from '@/services/adminx/user';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from '@ice/runtime';
import Auth from '@/components/auth';
import { User, UserDevice, UserDeviceWhereInput } from '@/generated/adminx/graphql';
import { delDataSource, saveDataSource, getDate } from '@/util';

export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    userId = searchParams.get('id'),
    [userInfo, setUserInfo] = useState<User>(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<UserDevice>[] = [
      // 有需要排序配置  sorter: true
      {
        title: t('device_name'),
        dataIndex: 'deviceName',
        width: 120,
        search: {
          transform: (value) => ({ deviceNameContains: value || undefined }),
        },
      },
      {
        title: t('device_model'), dataIndex: 'deviceModel', width: 120, search: {
          transform: (value) => ({ deviceModelContains: value || undefined }),
        },
      },
      { title: t('system_version'), dataIndex: 'systemVersion', width: 120, search: false },
      { title: t('device_uid'), dataIndex: 'deviceUID', width: 120, search: false },
      { title: 'app' + t('version'), dataIndex: 'appVersion', width: 120, search: false },
      {
        title: t('status'),
        dataIndex: 'status',
        filters: true,
        search: false,
        width: 100,
        valueEnum: EnumUserDeviceStatus,
      },
      {
        title: t('login_time'), dataIndex: 'createdAt', width: 160, valueType: 'dateTime', search: false, render: (text, record) => {
          let date = record?.createdAt ? record?.createdAt : record?.updatedAt;
          return <div>{getDate(date, 'YYYY-MM-DD HH:mm:ss') as string}</div>;
        },
      },
      { title: t('description'), dataIndex: 'comments', width: 120, search: false },
    ],
    [dataSource, setDataSource] = useState<UserDevice[]>([]),
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  columns.push(
    {
      title: t('operation'),
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      search: false,
      width: 80,
      render: (text, record) => {
        return (<Space>
          <Auth authKey={'deleteUserDevice'}>
            <a key="del" onClick={() => onDel(record)}>
              {t('delete')}
            </a>
          </Auth>
        </Space>);
      },
    },
  );

  useEffect(() => {
    getUserInfo(userId || '').then(result => {
      if (result && result.id) {
        setUserInfo(result as User);
      }
    });
  }, []);

  const
    onDel = (record: UserDevice) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t('confirm_delete')}：${record.deviceName}?`,
        onOk: async (close) => {
          if (!userId) {
            return;
          }
          const result = await delUserDevice(userId, record.id);
          if (result === true) {
            setDataSource(delDataSource(dataSource, record.id));
            if (dataSource.length === 0) {
              const pageInfo = { ...proTableRef.current?.pageInfo };
              pageInfo.current = pageInfo.current ? pageInfo.current > 2 ? pageInfo.current - 1 : 1 : 1;
              proTableRef.current?.setPageInfo?.(pageInfo);
              proTableRef.current?.reload();
            }
            close();
          }
        },
      });
    };

  return (<>
    <PageContainer
      header={{
        title: t('user_devices'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('org_cooperation') },
            { title: <Link to={`/org/users`} >{t('user_manage')}</Link> },
            { title: t('user_devices') },
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
          title: `${t('user')}：${userInfo?.displayName || '-'}`,
          actions: [
          ],
        }}
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={dataSource}
        request={async (params) => {
          if (!userId) return [];
          const table = { data: [] as UserDevice[], success: true, total: 0 },
            where: UserDeviceWhereInput = {};
          where.userID = userId;
          where.deviceNameContains = params.deviceNameContains;
          where.deviceModelContains = params.deviceModelContains;
          const result = await getUserDevices({
            current: params.current,
            pageSize: params.pageSize,
            where,
            userId: userId,
          });
          if (result?.totalCount) {
            table.data = result.edges?.map(item => item?.node) as UserDevice[];
            table.total = result.totalCount;
          }
          setSelectedRowKeys([]);
          setDataSource(table.data);
          return table;
        }}
        pagination={{ showSizeChanger: true }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys); },
          type: 'checkbox',
        }}
      />
    </PageContainer >
  </>);
};
