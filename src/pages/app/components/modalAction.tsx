import { Modal } from 'antd';
import { EnumAppActionKind, EnumAppActionMethod, getAppActionList } from '@/services/app/action';
import { useTranslation } from 'react-i18next';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { useState } from 'react';
import { TableParams } from '@/services/graphql';
import { AppAction, AppActionWhereInput } from '@/__generated__/graphql';

export default (props: {
  open: boolean;
  isMultiple?: boolean;
  title: string;
  tableTitle?: string;
  appId: string;
  onClose: (selectData?: AppAction[]) => void;
}) => {
  const { t } = useTranslation(),
    columns: ProColumns<AppAction>[] = [
      // 有需要排序配置  sorter: true
      {
        title: t('name'),
        dataIndex: 'name',
        width: 120,
        search: {
          transform: (value) => ({ nameContains: value || undefined }),
        },
      },
      { title: t('type'), dataIndex: 'kind', width: 120, valueEnum: EnumAppActionKind },
      { title: t('method'), dataIndex: 'method', width: 120, valueEnum: EnumAppActionMethod },
      { title: t('remarks'), dataIndex: 'comments', width: 120, search: false },
    ],
    [dataSource, setDataSource] = useState<AppAction[]>([]),
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);


  const
    getRequest = async (params: TableParams) => {
      const table = { data: [] as AppAction[], success: true, total: 0 },
        where: AppActionWhereInput = {};
      where.nameContains = params.nameContains;
      where.kind = params.kind;
      where.method = params.method;
      const result = await getAppActionList(props.appId, {
        current: params.current,
        pageSize: params.pageSize,
        where,
      });
      if (result?.totalCount) {
        table.data = result.edges?.map(item => item?.node) as AppAction[];
        table.total = result.totalCount;
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
        size="small"
        rowKey={'id'}
        search={{
          searchText: `${t('query')}`,
          resetText: `${t('reset')}`,
          labelWidth: 'auto',
        }}
        scroll={{ x: 'max-content', y: 300 }}
        options={false}
        columns={columns}
        request={getRequest}
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
