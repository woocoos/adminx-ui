
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Space, Modal, message, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { TableParams } from '@/services/graphql';
import { delPermssion, getUserExtendGroupPolicyList, getUserPermissionList } from '@/services/adminx/permission';
import DrawerRolePolicy from '@/pages/org/components/drawerRolePolicy';
import { useTranslation } from 'react-i18next';
import store from '@/store';
import { getUserJoinGroupList } from '@/services/adminx/org/role';
import Auth from '@/components/Auth';
import { OrgRole, Permission, PermissionPrincipalKind, PermissionWhereInput, User } from '@/__generated__/adminx/graphql';


export default (props: {
  userInfo: User;
  isExtendGroup?: boolean;
  principalKind: PermissionPrincipalKind;
}) => {
  const { t } = useTranslation(),
    [basisState] = store.useModel('basis'),
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
        search: false,
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
            placeholder={t('please_select')}
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
    [allUserGroup, setAllUserGroup] = useState<OrgRole[]>([]),
    // 弹出层处理
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
    }>({
      open: false,
      title: '',
    });

  if (props.principalKind === 'role') {
    columns.unshift({
      title: t('user_group'),
      dataIndex: 'orgRoleId',
      width: 120,
      renderFormItem(schema, config, form) {
        return (<Select
          placeholder={t('please_select')}
          allowClear
          options={allUserGroup.map(item => ({ label: item.name, value: item.id }))}
          onChange={(value) => {
            form.setFieldValue('orgRoleId', value);
          }}
        />);
      },
      render: (text, record) => {
        return record.role?.name;
      },
    });
  } else if (props.principalKind === 'user') {
    columns.push({
      title: t('operation'),
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      search: false,
      width: 110,
      render: (text, record) => {
        return record.isAllowRevoke ? <Space>
          <Auth authKey="revoke">
            <a key="del" onClick={() => onDel(record)}>
              {t('disauthorization')}
            </a>
          </Auth>
        </Space> : '';
      },
    });
  }


  const
    getUserGroup = async () => {
      const result = await getUserJoinGroupList(props.userInfo.id, {
        pageSize: 999,
      });
      if (result?.totalCount) {
        setAllUserGroup(result.edges?.map(item => item?.node) as OrgRole[]);
      } else {
        setAllUserGroup([]);
      }
    },
    getRequest = async (params: TableParams) => {
      const table = { data: [] as Permission[], success: true, total: 0 },
        where: PermissionWhereInput = {};
      where.principalKind = props.principalKind;
      where.orgID = basisState.tenantId;
      if (params.orgRoleId) {
        where.hasRoleWith = [{
          id: params.orgRoleId || undefined,
        }];
      }
      if (params.name || params.comments || params.type) {
        where.hasOrgPolicyWith = [{
          nameContains: params.name || null,
          commentsContains: params.comments || null,
          appPolicyIDNotNil: params.type === 'sys' ? true : undefined,
          appPolicyIDIsNil: params.type === 'cust' ? true : undefined,
        }];
      }

      const result = props.isExtendGroup ? await getUserExtendGroupPolicyList(props.userInfo.id, {
        current: params.current,
        pageSize: params.pageSize,
        where,
      }) : await getUserPermissionList(props.userInfo.id, {
        current: params.current,
        pageSize: params.pageSize,
        where,
      });
      if (result?.totalCount) {
        table.data = result.edges?.map(item => item?.node) as Permission[] || [];
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
          const result = await delPermssion(record.id, record.orgID);
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

  useEffect(() => {
    getUserGroup();
  }, []);

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
          actions: props.principalKind === 'user' ? [
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
          ] : [],
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
        orgId={basisState.tenantId}
        userInfo={props.userInfo}
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
