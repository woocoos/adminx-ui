import { Org, OrgKind, OrgWhereInput } from '@/generated/adminx/graphql';
import { getAppOrgList } from '@/services/adminx/app/org';
import { EnumOrgKind, getOrgList, getOrgPathList } from '@/services/adminx/org';
import store from '@/store';
import { formatTreeData } from '@/util';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';


export default (props: {
  open: boolean;
  isMultiple?: boolean;
  title: string;
  orgId?: string;
  appId?: string;
  kind?: OrgKind;
  tableTitle?: string;
  onClose: (selectData?: Org[]) => void;
}) => {
  const { t } = useTranslation(),
    [userState] = store.useModel('user'),
    columns: ProColumns<Org>[] = [
      // 有需要排序配置  sorter: true
      { title: t('name'), dataIndex: 'name', width: 120 },
      { title: t('code'), dataIndex: 'code', width: 120 },
      { title: t('type'), dataIndex: 'kind', width: 120, valueEnum: EnumOrgKind },
      { title: t('domain'), dataIndex: 'domain', width: 120, search: false },
      { title: t('country_region'), dataIndex: 'countryCode', width: 120, search: false },
      {
        title: t('manage_account'),
        dataIndex: 'owner',
        width: 120,
        search: false,
        render: (text, record) => {
          return <div>{record?.owner?.displayName || '-'}</div>;
        },
      },
      { title: t('description'), dataIndex: 'profile', width: 120, search: false },
    ],
    [allList, setAllList] = useState<Org[]>([]),
    [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]),
    [, setDataSource] = useState<Org[]>([]),
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  return (
    <Modal
      title={props.title}
      open={props.open}
      onOk={() => {
        props?.onClose(allList.filter(item => selectedRowKeys.includes(item.id)));
      }}
      onCancel={() => {
        props?.onClose();
      }}
      width={900}
    >
      <ProTable
        size="small"
        rowKey={'id'}
        search={props.appId ? {
          searchText: `${t('query')}`,
          resetText: `${t('reset')}`,
          labelWidth: 'auto',
        } : false}
        options={false}
        expandable={{
          expandedRowKeys: expandedRowKeys,
          onExpandedRowsChange: (expandedKeys: string[]) => {
            setExpandedRowKeys(expandedKeys);
          },
        }}
        scroll={{ x: 'max-content', y: 300 }}
        columns={columns}
        request={async (params) => {
          const table = { data: [] as Org[], success: true, total: 0 },
            where: OrgWhereInput = {};
          setExpandedRowKeys([]);
          if (props.appId) {
            where.nameContains = params.name;
            where.codeContains = params.code;
            where.kind = params.kind;
            const data = await getAppOrgList(props.appId, {
              current: params.current,
              pageSize: params.pageSize,
              where,
            });
            if (data?.totalCount) {
              table.data = data.edges?.map(item => item?.node) as Org[];
              table.total = data.totalCount;
            }
            setAllList(table.data);
          } else {
            let list: Org[] = [];
            if (props.kind === 'org') {
              list = await getOrgPathList(props.orgId || userState.tenantId, props.kind);
              table.total = list.length;
            } else {
              where.kind = props.kind;
              const result = await getOrgList({
                pageSize: 999,
                where,
              });
              if (result?.totalCount) {
                list = result.edges?.map(item => item?.node) as Org[];
                table.total = result.totalCount;
              }
            }

            if (list.length) {
              table.data = formatTreeData(list, undefined, { key: 'id', parentId: 'parentID' });
              setExpandedRowKeys(list.map(item => item.id));
            }
            setAllList(list);
          }
          setSelectedRowKeys([]);
          setDataSource(table.data);
          return table;
        }}
        pagination={false}
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
