import { Modal } from 'antd';
import { useState } from 'react';
import { EnumUserStatus, getUserList } from '@/services/adminx/user';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { getOrgRoleUserList, getOrgUserList } from '@/services/adminx/org/user';
import { OrderDirection, User, UserOrder, UserOrderField, UserSimpleStatus, UserUserType, UserWhereInput } from '@/generated/adminx/graphql';

export default (props: {
  open: boolean;
  title: string;
  userType?: UserUserType;
  isMultiple?: boolean;
  tableTitle?: string;
  orgId?: string;
  orgRoleId?: string;
  onClose: (selectData?: User[]) => void;
}) => {
  const { t } = useTranslation(),
    columns: ProColumns<User>[] = [
      // 有需要排序配置  sorter: true
      {
        title: t('principal_name'),
        dataIndex: 'principalName',
        width: 90,
        search: {
          transform: (value) => ({ principalNameContains: value || undefined }),
        },
      },
      {
        title: t('display_name'),
        dataIndex: 'displayName',
        width: 120,
        search: {
          transform: (value) => ({ displayNameContains: value || undefined }),
        },
      },
      {
        title: t('email'),
        dataIndex: 'email',
        width: 120,
        search: {
          transform: (value) => ({ emailContains: value || undefined }),
        },
      },
      {
        title: t('mobile'),
        dataIndex: 'mobile',
        width: 160,
        search: {
          transform: (value) => ({ mobileContains: value || undefined }),
        },
      },
      {
        title: t('status'),
        dataIndex: 'status',
        filters: true,
        search: false,
        width: 100,
        valueEnum: EnumUserStatus,
      },
      { title: t('created_at'), dataIndex: 'createdAt', width: 160, valueType: 'dateTime', sorter: true },

    ],
    [dataSource, setDataSource] = useState<User[]>([]),
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const
    handleOk = () => {
      props?.onClose(dataSource.filter(item => selectedRowKeys.includes(item.id)));
    },
    handleCancel = () => {
      props?.onClose();
    };

  return (
    <Modal
      title={props.title}
      open={props.open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={900}
      destroyOnClose
    >
      <ProTable
        search={{
          searchText: `${t('query')}`,
          resetText: `${t('reset')}`,
          labelWidth: 'auto',
        }}
        size="small"
        rowKey={'id'}
        scroll={{ x: 'max-content', y: 300 }}
        columns={columns}
        options={false}
        request={async (params, sort, filter) => {
          const table = { data: [] as User[], success: true, total: 0 },
            where: UserWhereInput = {};
          let orderBy: UserOrder | undefined;
          where.userType = props.userType;
          where.principalNameContains = params.principalNameContains;
          where.displayNameContains = params.displayNameContains;
          where.emailContains = params.emailContains;
          where.mobileContains = params.mobileContains;
          where.statusIn = filter.status as UserSimpleStatus[] | null;
          if (sort.createdAt) {
            orderBy = {
              direction: sort.createdAt === 'ascend' ? OrderDirection.Asc : OrderDirection.Desc,
              field: UserOrderField.CreatedAt,
            };
          }
          if (props.orgRoleId) {
            const result = await getOrgRoleUserList(props.orgRoleId, {
              current: params.current,
              pageSize: params.pageSize,
              where: where,
              orderBy: orderBy,
            });
            if (result?.totalCount) {
              table.data = result.edges?.map(item => item?.node) as User[] || [];
              table.total = result.totalCount;
            }
          } else if (props.orgId) {
            const result = await getOrgUserList(props.orgId, {
              current: params.current,
              pageSize: params.pageSize,
              where: where,
              orderBy: orderBy,
            });
            if (result?.totalCount) {
              table.data = result.edges?.map(item => item?.node) as User[] || [];
              table.total = result.totalCount;
            }
          } else {
            const result = await getUserList({
              current: params.current,
              pageSize: params.pageSize,
              where: where,
              orderBy: orderBy,
            });
            if (result?.totalCount) {
              table.data = result.edges?.map(item => item?.node) as User[] || [];
              table.total = result.totalCount;
            }
          }

          setSelectedRowKeys([]);
          setDataSource(table.data);
          return table;
        }}
        pagination={{ showSizeChanger: true }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys); },
          type: props.isMultiple ? 'checkbox' : 'radio',
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              if (props.isMultiple) {
                if (selectedRowKeys.includes(record.id)) {
                  setSelectedRowKeys(selectedRowKeys.filter(id => id != record.id));
                } else {
                  selectedRowKeys.push(record.id);
                  setSelectedRowKeys([...selectedRowKeys]);
                }
              } else {
                setSelectedRowKeys([record.id]);
              }
            },
          };
        }}
      />
    </Modal>
  );
};
