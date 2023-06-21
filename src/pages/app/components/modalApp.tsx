import { EnumAppKind, EnumAppStatus, getAppList } from '@/services/app';
import { Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { TableFilter, TableParams, TableSort } from '@/services/graphql';
import { getOrgAppList } from '@/services/org/app';
import defaultApp from '@/assets/images/default-app.png';
import { App, AppKind, AppWhereInput } from '@/__generated__/knockout/graphql';

export default (props: {
  open: boolean;
  orgId?: string;
  isMultiple?: boolean;
  title: string;
  tableTitle?: string;
  onClose: (selectData?: App[]) => void;
}) => {
  const { t } = useTranslation(),
    columns: ProColumns<App>[] = [
      // 有需要排序配置  sorter: true
      { title: 'LOGO', dataIndex: 'logo', width: 90, align: 'center', valueType: 'image', search: false },
      {
        title: t('name'),
        dataIndex: 'name',
        width: 120,
        search: {
          transform: (value) => ({ nameContains: value || undefined }),
        },
      },
      {
        title: t('code'),
        dataIndex: 'code',
        width: 120,
        search: {
          transform: (value) => ({ codeContains: value || undefined }),
        },
      },
      {
        title: t('type'),
        dataIndex: 'kind',
        filters: true,
        search: false,
        width: 100,
        valueEnum: EnumAppKind,
      },
      { title: t('description'), dataIndex: 'comments', width: 160, search: false },
      {
        title: t('status'),
        dataIndex: 'status',
        filters: true,
        search: false,
        width: 100,
        valueEnum: EnumAppStatus,
      },
    ],
    [dataSource, setDataSource] = useState<App[]>([]),
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const
    getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
      const table = { data: [] as App[], success: true, total: 0 },
        where: AppWhereInput = {};
      where.nameContains = params.nameContains;
      where.codeContains = params.codeContains;
      where.kindIn = filter.kind as AppKind[];

      if (props.orgId) {
        const result = await getOrgAppList(props.orgId, {
          current: params.current,
          pageSize: params.pageSize,
          where,
        });
        if (result?.totalCount) {
          table.data = result.edges?.map(item => {
            if (item?.node) {
              item.node.logo = item?.node?.logo || defaultApp;
            }
            return item?.node;
          }) as App[];
          table.total = result.totalCount;
        }
      } else {
        const result = await getAppList({
          current: params.current,
          pageSize: params.pageSize,
          where,
        });
        if (result?.totalCount) {
          table.data = result.edges?.map(item => {
            if (item?.node) {
              item.node.logo = item?.node?.logo || defaultApp;
            }
            return item?.node;
          }) as App[];
          table.total = result.totalCount;
        }
      }
      setSelectedRowKeys([]);
      setDataSource(table.data);
      return table;
    },
    handleOk = () => {
      props?.onClose(dataSource.filter(item => selectedRowKeys.includes(item.id)));
    },
    handleCancel = () => {
      props?.onClose();
    };

  return (
    <Modal title={props.title} open={props.open} onOk={handleOk} onCancel={handleCancel} width={900}>
      <ProTable
        rowKey={'id'}
        size="small"
        search={{
          searchText: `${t('query')}`,
          resetText: `${t('reset')}`,
          labelWidth: 'auto',
        }}
        options={false}
        scroll={{ x: 'max-content', y: 300 }}
        columns={columns}
        request={getRequest}
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
