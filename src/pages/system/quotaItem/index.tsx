import { KeepAlive } from '@knockout-js/layout';
import { definePageConfig, Link } from 'ice';
import { ActionType, PageContainer, ProColumns, ProTable, useToken } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import { Quota, QuotaItem, QuotaItemWhereInput } from "@/generated/adminx/graphql";
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
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    
    },
    {
      title: t('name'),
      dataIndex: 'name',
      width: 120,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      width: 120,
    },
    {
      title: '资源类型',
      dataIndex: 'resourceType',
      width: 120,
      
    },
    {
      title:'默认限制值',
      dataIndex: 'defaultLimit',
      width: 120,
    },
    {
      title:'单位',
      dataIndex: 'unit',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 120,
    },
    {
      title: '是否启用',
      dataIndex: 'active',
      width: 120,
      valueEnum: {
        true: { text: '是' },
        false: { text: '否' },
      },
    }
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
        title: '配额定义管理',
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: '配额定义管理' },
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
            title: '配额定义管理',
            actions: [
              <Auth authKey="createQuotaItem">
                <Button
                  key="create"
                  type="primary"
                  onClick={
                    () => {
                      setModal({ open: true, title: '创建配额定义', id: '' });
                    }
                  }
                >
                  创建配额定义
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
