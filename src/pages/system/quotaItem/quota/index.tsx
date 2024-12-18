import { KeepAlive } from '@knockout-js/layout';
import { definePageConfig, Link, useSearchParams } from 'ice';
import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { Quota, QuotaWhereInput } from '@/generated/adminx/graphql';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Space } from 'antd';
import Auth from '@/components/auth';
import { delDataSource, saveDataSource } from '@/util';
import Create from './components/create';
import { delQuota, getQuotaList } from '@/services/adminx/quotaItem/quota';

const PageQuotaList = () => {
  const {token} = useToken(),
    {t} = useTranslation(),
    [searchParams] = useSearchParams(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<Quota>[] = [
      // 有需要排序配置  sorter: true
      {
        title: t('tenant'),
        dataIndex: 'tenant',
        width: 120,
      },
      {
        title: t('user'),
        dataIndex: 'user',
        width: 120,
      },
      {
        title: t('limit'),
        dataIndex: 'limit',
        width: 120,

      },
      {
        title: t('used'),
        dataIndex: 'used',
        width: 120,
      },
      {
        title: t('start_at'),
        dataIndex: 'startAt',
        width: 120,
      },
      {
        title: t('end_at'),
        dataIndex: 'endAt',
        width: 120,
      },
    ],
    [dataSource, setDataSource] = useState<Quota[]>([]),
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
          <Auth authKey="updateQuota">
            <a
              key="viewer"
              onClick={() => {
                setModal({open: true, title: `${t('edit_quota')}:${record.id}`, id: record.id});
              }}
            >
              {t('edit')}
            </a>
          </Auth>
          <Auth authKey="deleteQuota">
            <a key="del" onClick={() => {
              Modal.confirm({
                title: t('delete'),
                content: `${t('confirm_delete')}：${record.id}?`,
                onOk: async (close) => {
                  const result = await delQuota(record.id);
                  if (result === true) {
                    setDataSource(delDataSource(dataSource, record.id));
                    if (dataSource.length === 0) {
                      const pageInfo = {...proTableRef.current?.pageInfo};
                      pageInfo.current = pageInfo.current ? pageInfo.current > 2 ? pageInfo.current - 1 : 1 : 1;
                      proTableRef.current?.reload({...pageInfo});
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
        title: t('quota_manage'),
        style: {background: token.colorBgContainer},
        breadcrumb: {
          items: [
            {title: t('system_conf')},
            {title: t('quota_item_manage')},
            {title: t('quota_manage')},
          ],
        }
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
            title: t('quota_manage'),
            actions: [
              <Auth authKey="createQuota">
                <Button
                  key="create"
                  type="primary"
                  onClick={
                    () => {
                      setModal({open: true, title: t('add_quota'), id: ''});
                    }
                  }
                >
                  {t('add_quota')}
                </Button>
              </Auth>,
            ],
          }}
          scroll={{x: 'max-content'}}
          columns={columns}
          dataSource={dataSource}
          request={async (params) => {
            const table = {data: [] as Quota[], success: true, total: 0},
              where: QuotaWhereInput = {};
            where.quotaItemID = searchParams.get('id');
            where.tenantID = params.tenantID;
            where.userID = params.userID;
            const result = await getQuotaList({
              current: params.current,
              pageSize: params.pageSize,
              where: where,
            });
            if (result?.totalCount && result.edges) {
              for (const item of result.edges) {
                if (item?.node) {
                  table.data.push(item.node as Quota);
                }
              }
              table.total = result.totalCount;
            }
            setDataSource(table.data);
            return table;
          }}
          pagination={{showSizeChanger: true}}
        />
        <Create
          open={modal.open}
          title={modal.title}
          id={modal.id}
          onClose={(isSuccess, newInfo) => {
            if (isSuccess && newInfo) {
              setDataSource(saveDataSource(dataSource, newInfo));
            }
            setModal({open: false, title: '', id: ''});
          }}
        />
      </PageContainer>
    </>
  );
};

export default () => {
  return (
    <KeepAlive clearAlive>
      <PageQuotaList />
    </KeepAlive>
  );
};

