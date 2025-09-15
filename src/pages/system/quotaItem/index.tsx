import { KeepAlive } from '@knockout-js/layout';
import { definePageConfig, Link } from 'ice';
import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { Quota, QuotaItem, QuotaItemResourceType, QuotaItemWhereInput } from '@/generated/adminx/graphql';
import { useTranslation } from 'react-i18next';
import { Space, Modal, Button} from 'antd';
import { delQuotaItem, getQuotaItemList } from '@/services/adminx/quotaItem';
import { title } from 'process';
import Auth from '@/components/auth';
import { delDataSource, saveDataSource } from '@/util';
import Create from './components/create';

const PageQuotaItemList = () => {
  const { token } = useToken(),
  { t } = useTranslation(),
  // 表格相关
  proTableRef = useRef<ActionType>(),
  columns: ProColumns<QuotaItem>[] = [
    // 有需要排序配置  sorter: true
    {
      title: t('name'),
      dataIndex: 'name',
      width: 120,
    },
    {
      title: t('code'),
      dataIndex: 'code',
      width: 120,
    },
    {
      title: t('resource_type'),
      dataIndex: 'resourceType',
      width: 120,
      valueEnum: {
        number: { text: t('resource_type_number') },
        network: { text: t('resource_type_network') },
        storage: { text: t('resource_type_storage') },
      },
    },
    {
      title: t('default_limit'),
      dataIndex: 'defaultLimit',
      width: 120,
    },
    {
      title: t('unit'),
      dataIndex: 'unit',
      width: 120,
    },
    {
      title: t('description'),
      dataIndex: 'description',
      width: 120,
    },
    {
      title: t('active_status'),
      dataIndex: 'active',
      width: 120,
      valueEnum: {
        true: { text: t('enable') },
        false: { text: t('disable') },
      },
    },
  ],
  [dataSource, setDataSource] = useState<QuotaItem[]>([]),
  [modal, setModal] = useState({
    open: false,
    title: '',
    id: '',
  });

  columns.push({
    title: t('operation'),
    dataIndex: 'actions',
    fixed: 'right',
    align: 'center',
    search: false,
    width: 170,
    render: (_, record) => {
      return (
        <Space>
          <Auth authKey="updateQuotaItem" >
            <a
              key="viewer"
              onClick={() => {
                setModal({ open: true, title: `${t('edit_quota_item')}:${record.name}`, id: record.id });
              }}
            >
              {t('edit')}
            </a>
          </Auth>
          <Link key="quotaItem" to={`/system/quotaItem/quota?id=${record.id}`} >
            {t('detail')}
          </Link>
          <Auth authKey="deleteQuotaItem" >
            <a key="del" onClick={() => {
              Modal.confirm({
                title: t('delete'),
                content: `${t('confirm_delete')}：${record.name}?`,
                onOk: async (close) => {
                  const result = await delQuotaItem(record.id);
                  if (result === true) {
                    setDataSource(delDataSource(dataSource, record.id));
                    if (dataSource.length === 0) {
                      const pageInfo = { ...proTableRef.current?.pageInfo };
                      pageInfo.current = pageInfo.current ? pageInfo.current > 2 ? pageInfo.current - 1 : 1 : 1;
                      proTableRef.current?.reload({ ...pageInfo });
                    }
                  }
                  close();
                },
              });
            }}>
              {t('delete')}
            </a>
          </Auth>
        </Space>
      );
    },
  });
  return (
    <>
      <PageContainer header={{
        title: t('quota_item_manage'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: t('quota_item_manage') },
          ],
        },
      }}
      >
        <ProTable
          actionRef={proTableRef}
          rowKey={'id'}
          search={{
            searchText: `${t('query')}`,
            resetText: `${t('reset')}`,
            labelWidth: 'auto',
          }}
          toolbar={{
            title: t('quota_item_manage'),
            actions: [
              <Auth authKey="createQuotaItem">
                <Button
                  key="create"
                  type="primary"
                  onClick={
                    () => {
                      setModal({ open: true, title: t('add_quota_item'), id: '' });
                    }
                  }
                >
                  {t('add_quota_item')}
                </Button >
              </Auth>,
            ],
          }}
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={dataSource}
          request={async (params) => {
            const table = { data: [] as QuotaItem[], success: true, total: 0 },
              where: QuotaItemWhereInput = {};
            where.nameContains = params.nameContains;
            where.codeContains = params.codeContains;
            const result = await getQuotaItemList({
              current: params.current,
              pageSize: params.pageSize,
              where: where,
            });
            if (result?.totalCount && result.edges) {
              for (const item of result.edges) {
                if (item?.node) {
                  table.data.push(item.node as QuotaItem);
                }
              }
              table.total = result.totalCount;
            }
            setDataSource(table.data);
            return table;
          }}
          pagination={{ showSizeChanger: true }}
        />
        <Create
          open={modal.open}
          title={modal.title}
          id={modal.id}
          onClose={(isSuccess, newInfo) => {
            if (isSuccess && newInfo) {
              setDataSource(saveDataSource(dataSource, newInfo));
            }
            setModal({ open: false, title: '', id: '' });
          }}
        />
      </PageContainer>
    </>
  );
};

export default () => {
  return (
    <KeepAlive clearAlive>
      <PageQuotaItemList/>
    </KeepAlive>
  );
};

export const pageConfig = definePageConfig(() => ({
  auth: ['/system/quotaItem'],
}));
