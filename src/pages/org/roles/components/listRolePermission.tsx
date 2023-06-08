
import { ActionType, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Button, Space, Modal, message, Select } from 'antd';
import { useRef, useState } from 'react';
import { TableSort, TableParams, TableFilter } from '@/services/graphql';
import { Permission, delPermssion, getOrgPermissionList } from '@/services/permission';
import DrawerRolePolicy from '../../components/drawerRolePolicy';
import { OrgRole } from '@/services/org/role';
import { useTranslation } from 'react-i18next';
import Auth from '@/components/Auth';


export default (props: {
  orgRoleInfo: OrgRole;
  readonly?: boolean;
}) => {
  const { } = useToken(),
    { t } = useTranslation(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<Permission>[] = [
      // 有需要排序配置  sorter: true
      {
        title: t('name'),
        dataIndex: 'name',
        width: 120,
        render: (text, record) => {
          return record.orgPolicy?.name;
        },
      },
      {
        title: t('description'),
        dataIndex: 'comments',
        width: 120,
        render: (text, record) => {
          return record.orgPolicy?.comments;
        },
      },
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
        render: (text, record) => {
          return record.orgPolicy?.appPolicyID ? t('system_strategy') : t('custom_policy');
        },
      },

    ],
    [dataSource, setDataSource] = useState<Permission[]>([]),
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
  if (!props.readonly) {
    columns.push({
      title: t('operation'),
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      search: false,
      width: 110,
      render: (text, record) => {
        return (<Space>
          <Auth authKey="revoke">
            <a key="del" onClick={() => onDel(record)}>
              {t('disauthorization')}
            </a>
          </Auth>
        </Space>);
      },
    });
  }

  const
    getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
      const table = { data: [] as Permission[], success: true, total: 0 };
      params.principalKind = 'role';
      params.roleID = props.orgRoleInfo.id;
      if (params.name || params.comments || params.type) {
        params.hasOrgPolicyWith = {
          nameContains: params.name || null,
          commentsContains: params.comments || null,
          appPolicyIDNotNil: params.type === 'sys' ? true : undefined,
          appPolicyIDIsNil: params.type === 'cust' ? true : undefined,
        };
      }
      delete params.name;
      delete params.comments;
      delete params.type;
      const result = await getOrgPermissionList(props.orgRoleInfo.orgID, params, filter, sort);
      if (result?.totalCount) {
        table.data = result.edges.map(item => item.node);
        table.total = result.totalCount;
      }
      setSelectedRowKeys([]);
      setDataSource(table.data);
      return table;
    },
    onDel = (record: Permission) => {
      Modal.confirm({
        title: t('disauthorization'),
        content: `${t('confirm_disauthorization')}：${record.orgPolicy?.name}?`,
        onOk: async (close) => {
          const result = await delPermssion(record.id, props.orgRoleInfo.orgID);
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
          title: t('policy_list'),
          actions: props.readonly ? [] : [
            <Auth authKey="grant">
              <Button
                type="primary"
                onClick={() => {
                  setModal({ open: true, title: '' });
                }}
              >
                {t('add_auth')}
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
      {modal.open ? <DrawerRolePolicy
        orgId={props.orgRoleInfo.orgID}
        orgRoleInfo={props.orgRoleInfo}
        open={modal.open}
        title={`${t('add_permission')}`}
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
