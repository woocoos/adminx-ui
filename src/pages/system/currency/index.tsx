
import Auth from '@/components/auth';
import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { KeepAlive } from '@knockout-js/layout';
import { Button, Col, Modal, Row, Space } from 'antd';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Create from './components/create';
import { definePageConfig, Link } from 'ice';
import { delDataSource, saveDataSource } from '@/util';
import { Currency, CurrencyWhereInput } from '@/generated/adminx/graphql';
import { delCurrencyInfo, EnumCurrencyStatus, getCurrencyList } from '@/services/adminx/currency';

const PageList = () => {
  const { t } = useTranslation(),
    { token } = useToken(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<Currency>[] = [
      // 有需要排序配置  sorter: true
      {
        title: "ID",
        dataIndex: 'id',
        width: 80,
        search: false,
      },
      {
        title: t('code'),
        dataIndex: 'code',
        width: 100,
      },
      {
        title: t('name'),
        dataIndex: 'name',
        width: 100,
      },
      {
        title: t('sign'),
        dataIndex: 'sign',
        width: 100,
      },
      {
        title: t('status'),
        dataIndex: 'status',
        width: 90,
        search: false,
        valueEnum: EnumCurrencyStatus,
      },
      {
        title: t('operation'),
        dataIndex: 'actions',
        fixed: 'right',
        align: 'center',
        search: false,
        width: 120,
        render: (text, record) => {
          return (<Space>
            <Auth authKey="updateCurrency">
              <a key="editor" onClick={() => {
                setModal({ open: true, title: t(`${t('edit')}-${record.name}`), id: record.id });
              }}>
                {t('edit')}
              </a>
            </Auth>
            <Auth authKey="deleteCurrency">
              <a key="delete" onClick={() => {
                Modal.confirm({
                  title: t('delete'),
                  content: `${t('confirm_delete')}：${record.name}?`,
                  onOk: async (close) => {
                    const result = await delCurrencyInfo(record.id);
                    if (result === true) {
                      setDataSource(delDataSource(dataSource, record.id));
                      if (dataSource.length === 0) {
                        const pageInfo = { ...proTableRef.current?.pageInfo };
                        pageInfo.current = pageInfo.current ? pageInfo.current > 2 ? pageInfo.current - 1 : 1 : 1;
                        proTableRef.current?.setPageInfo?.(pageInfo);
                        proTableRef.current?.reload();
                      }
                      close();
                    }
                  },
                });
              }}>
                {t('delete')}
              </a>
            </Auth>
          </Space>);
        },
      },
    ],
    // 弹出层处理
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
      id?: string;
    }>({
      open: false,
      title: '',
    }),
    [dataSource, setDataSource] = useState<Currency[]>([]);


  return (<PageContainer
    header={{
      title: t('currency_list'),
      style: { background: token.colorBgContainer },
      breadcrumb: {
        items: [
          { title: t('system_conf') },
          { title: t('currency_title') },
        ]
      },
    }}
  >
    <ProTable
      actionRef={proTableRef}
      rowKey={'id'}
      search={{
        labelWidth: 100,
      }}
      toolbar={{
        title: t('currency_list'),
        actions: [
          <Auth authKey={'createCurrency'}>
            <Button
              type="primary"
              onClick={() => {
                setModal({ open: true, title: t('created') });
              }}
            >
              {t('created')}
            </Button>
          </Auth>,
        ],
      }}
      scroll={{ x: 'max-content' }}
      columns={columns}
      dataSource={dataSource}
      request={async (params) => {
        const table = { data: [] as Currency[], success: true, total: 0 },
          where: CurrencyWhereInput = {}
        where.codeContains = params.code;
        where.nameContains = params.name;
        const result = await getCurrencyList({
          current: params.current,
          pageSize: params.pageSize,
          where,
        });
        if (result?.totalCount) {
          table.total = result.totalCount;
          result.edges?.forEach(item => {
            if (item?.node) {
              table.data.push(item.node as Currency);
            }
          })
        } else {
        }
        setDataSource(table.data);
        return table;
      }}
      pagination={{
        showSizeChanger: true,
      }}
    />


    <Create
      open={modal.open}
      title={modal.title}
      id={modal.id}
      onClose={(isSuccess, newInfo) => {
        if (isSuccess && newInfo) {
          setDataSource(saveDataSource(dataSource, newInfo))
        }
        setModal({ open: false, title: modal.title })
      }}
    />
  </PageContainer>)
}

export default () => {
  return (<KeepAlive clearAlive>
    <PageList />
  </KeepAlive>);
};


export const pageConfig = definePageConfig(() => ({
  auth: ['/system/currency'],
}));
