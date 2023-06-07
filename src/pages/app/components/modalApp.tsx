import { App, EnumAppKind, EnumAppStatus, getAppList } from '@/services/app';
import { Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { List, TableFilter, TableParams, TableSort } from '@/services/graphql';
import { getOrgAppList } from '@/services/org/app';
import defaultApp from '@/assets/images/default-app.png';

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
      const table = { data: [] as App[], success: true, total: 0 };
      let result: List<App> | null = null;
      if (props.orgId) {
        result = await getOrgAppList(props.orgId, params, filter, sort);
      } else {
        result = await getAppList(params, filter, sort);
      }

      if (result) {
        table.data = result.edges.map(item => {
          item.node.logo = item.node.logo || defaultApp;
          return item.node;
        });
        table.total = result.totalCount;
      } else {
        table.total = 0;
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
