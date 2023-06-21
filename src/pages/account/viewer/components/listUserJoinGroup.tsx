
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Space, Modal, message } from 'antd';
import { useRef, useState } from 'react';
import { TableParams } from '@/services/graphql';
import { useTranslation } from 'react-i18next';
import store from '@/store';
import { getUserJoinGroupList, revokeOrgRoleUser } from '@/services/org/role';
import DrawerRole from '@/pages/org/components/drawerRole';
import Auth from '@/components/Auth';
import { OrgRole, OrgRoleKind, OrgRoleWhereInput, User } from '@/__generated__/knockout/graphql';


export default (props: {
  userInfo: User;
}) => {
  const { t } = useTranslation(),
    [basisState] = store.useModel('basis'),
    // 表格相关
    proTableRef = useRef<ActionType>(),
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
      {
        title: t('description'), dataIndex: 'comments', width: 120, search: false,
      },
      {
        title: t('created_at'), dataIndex: 'createdAt', width: 120, valueType: 'dateTime',
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
            <Auth authKey="revokeRoleUser">
              <a key="del" onClick={() => onDel(record)}>
                {t('disauthorization')}
              </a>
            </Auth>
          </Space>);
        },
      },

    ],
    [dataSource, setDataSource] = useState<OrgRole[]>([]),
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
    getRequest = async (params: TableParams) => {
      const table = { data: [] as OrgRole[], success: true, total: 0 },
        where: OrgRoleWhereInput = {};
      where.nameContains = params.nameContains;
      where.createdAt = params.createdAt;
      const result = await getUserJoinGroupList(props.userInfo.id, {
        current: params.current,
        pageSize: params.pageSize,
        where,
      });
      if (result?.totalCount) {
        table.data = result.edges?.map(item => item?.node) as OrgRole[];
        table.total = result.totalCount;
      }
      setSelectedRowKeys([]);
      setDataSource(table.data);
      return table;
    },
    onDel = (record: OrgRole) => {
      Modal.confirm({
        title: t('disauthorization'),
        content: `${t('confirm_disauthorization')}：${record.name}?`,
        onOk: async (close) => {
          const result = await revokeOrgRoleUser(record.id, props.userInfo.id);
          if (result === true) {
            if (dataSource.length === 1) {
              const pageInfo = { ...proTableRef.current?.pageInfo };
              pageInfo.current = pageInfo.current ? pageInfo.current > 2 ? pageInfo.current - 1 : 1 : 1;
              proTableRef.current?.setPageInfo?.(pageInfo);
            }
            proTableRef.current?.reload();
            message.success(t('submit_success'));
            close();
          }
        },
      });
    };

  return (
    <>
      <ProTable
        className="innerTable"
        actionRef={proTableRef}
        rowKey={'id'}
        search={{
          searchText: `${t('query')}`,
          resetText: `${t('reset')}`,
          labelWidth: 'auto',
        }}
        toolbar={{
          title: t('user_group_list', { field: t('') }),
          actions: [
            <Auth authKey="assignRoleUser">
              <Button
                type="primary"
                onClick={() => {
                  setModal({ open: true, title: '' });
                }}
              >
                {t('add_user_group')}
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
      {modal.open ? <DrawerRole
        title={`${t('add_user_group')}`}
        open={modal.open}
        orgId={basisState.tenantId}
        kind={OrgRoleKind.Group}
        userInfo={props.userInfo}
        onClose={(isSuccess) => {
          if (isSuccess) {
            proTableRef.current?.reload();
          }
          setModal({ open: false, title: '' });
        }}
      /> : ''}
    </>
  );
};
