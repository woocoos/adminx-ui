import { Modal } from 'antd';
import { useState } from 'react';
import { getOrgGroupList, getOrgRoleList } from '@/services/knockout/org/role';
import { useTranslation } from 'react-i18next';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { TableParams } from '@/services/graphql';
import { OrgRole, OrgRoleKind, OrgRoleWhereInput } from '@/__generated__/knockout/graphql';


export default (props: {
  kind: OrgRoleKind;
  open: boolean;
  title: string;
  isMultiple?: boolean;
  tableTitle?: string;
  orgId: string;
  onClose: (selectData?: OrgRole[]) => void;
}) => {
  const { t } = useTranslation(),
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
      { title: t('remarks'), dataIndex: 'comments', width: 120, search: false },

    ],
    [dataSource, setDataSource] = useState<OrgRole[]>([]),
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  if (props.kind === OrgRoleKind.Role) {
    columns.push({
      title: t('type'),
      dataIndex: 'actions',
      fixed: 'right',
      search: false,
      renderText(text, record) {
        return record.isAppRole ? t('system_role') : t('custom_role');
      },
    });
  }

  const
    getRequest = async (params: TableParams) => {
      const table = { data: [] as OrgRole[], success: true, total: 0 },
        where: OrgRoleWhereInput = {};
      where.kind = props.kind;
      where.orgID = props.orgId;
      where.nameContains = params.nameContains;
      const result = props.kind === OrgRoleKind.Role ? await getOrgRoleList({
        current: params.current,
        pageSize: params.pageSize,
        where,
      }) : await getOrgGroupList({
        current: params.current,
        pageSize: params.pageSize,
        where,
      });
      if (result?.totalCount) {
        table.data = result.edges?.map(item => item?.node) as OrgRole[];
        table.total = result.totalCount;
      }
      setDataSource(table.data);
      setSelectedRowKeys([]);
      return table;
    },
    handleOk = () => {
      props?.onClose(dataSource.filter(item => selectedRowKeys.includes(item.id)));
    },
    handleCancel = () => {
      props?.onClose(undefined);
    };

  return (
    <Modal
      title={props.title}
      open={props.open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={900}
    >
      <ProTable
        size="small"
        search={{
          searchText: `${t('query')}`,
          resetText: `${t('reset')}`,
          labelWidth: 'auto',
        }}
        rowKey={'id'}
        scroll={{ x: 'max-content', y: 300 }}
        options={false}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys); },
          type: props.isMultiple ? 'checkbox' : 'radio',
        }}
        columns={columns}
        request={getRequest}
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
