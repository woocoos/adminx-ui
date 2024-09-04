
import Auth from '@/components/auth';
import { FileSource, FileSourceKind, FileSourceWhereInput } from '@/generated/adminx/graphql';
import { EnumFileSourceKind, delFileSource, getFileSourceList } from '@/services/adminx/file/source';
import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { KeepAlive } from '@knockout-js/layout';
import { Button, Modal, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Create from './components/create';
import { definePageConfig, Link } from 'ice';
import { SortOrder } from 'antd/es/table/interface';

const PageFileSourceList = () => {
  const { t } = useTranslation(),
    { token } = useToken(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<FileSource>[] = [
      // 有需要排序配置  sorter: true
      {
        title: "ID",
        dataIndex: 'id',
        width: 80,
        search: false,
      },
      {
        title: t('file_source_kind'),
        dataIndex: 'kind',
        width: 90,
        valueEnum: EnumFileSourceKind,
      },
      {
        title: "Bucket",
        dataIndex: 'bucket',
        width: 100,
      },
      {
        title: "Bucket Url",
        dataIndex: 'bucketURL',
        width: 100,
      },
      {
        title: "Region",
        dataIndex: 'region',
        width: 100,
      },
      {
        title: "Endpoint",
        dataIndex: 'endpoint',
        width: 100,
      },
      {
        title: "Sts Endpoint",
        dataIndex: 'stsEndpoint',
        width: 100,
      },
      {
        title: t('custDomain'), dataIndex: 'endpointImmutable', width: 100, search: false,
        render: (text, record) => {
          return record.endpointImmutable ? t('yes') : t('no');
        }
      },
      { title: t('description'), dataIndex: 'comments', width: 120, search: false },
      {
        title: t('operation'),
        dataIndex: 'actions',
        fixed: 'right',
        align: 'center',
        search: false,
        width: 120,
        render: (text, record) => {
          return (<Space>
            <Auth authKey="updateFileSource">
              <a key="editor" onClick={() => {
                setModal({ open: true, title: t(`${t('edit')}-${record.bucket}`), id: record.id });
              }}>
                {t('edit')}
              </a>
            </Auth>
            <Link key="proof" to={`/system/file/identity?fs_id=${record.id}`}>
              {t('proof')}
            </Link>
            <Auth authKey="deleteFileSource">
              <a key="delete" onClick={() => {
                Modal.confirm({
                  title: t('delete'),
                  content: `${t('confirm_delete')}：${record.bucket}?`,
                  onOk: async (close) => {
                    const result = await delFileSource(record.id);
                    if (result === true) {
                      const idx = dataSource.findIndex(item => item.id === record.id);
                      dataSource.splice(idx, 1);
                      setDataSource([...dataSource]);
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
    [dataSource, setDataSource] = useState<FileSource[]>([]);


  return (<PageContainer
    header={{
      title: t('file_source'),
      style: { background: token.colorBgContainer },
      breadcrumb: {
        items: [
          { title: t('system_conf') },
          { title: t('file_source') },
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
        title: t('file_source_list'),
        actions: [
          <Auth authKey={'createFileSource'}>
            <Button
              type="primary"
              onClick={() => {
                setModal({ open: true, title: t('create_file_source') });
              }}
            >
              {t('create_file_source')}
            </Button>
          </Auth>,
        ],
      }}
      scroll={{ x: 'max-content' }}
      columns={columns}
      dataSource={dataSource}
      request={async (params) => {
        const table = { data: [] as FileSource[], success: true, total: 0 },
          where: FileSourceWhereInput = {}
        where.kind = params.kind;
        where.bucketContains = params.bucket;
        where.regionContains = params.region;
        where.endpointContains = params.endpoint;
        where.bucketURLContains = params.bucketURL;
        where.stsEndpointContains = params.stsEndpoint;
        const result = await getFileSourceList({
          current: params.current,
          pageSize: params.pageSize,
          where,
        });
        if (result?.totalCount) {
          table.total = result.totalCount;
          result.edges?.forEach(item => {
            if (item?.node) {
              table.data.push(item.node as FileSource);
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
          const idx = dataSource.findIndex(item => item.id == newInfo.id)
          if (idx === -1) {
            dataSource.unshift(newInfo)
          } else {
            dataSource[idx] = newInfo
          }
          setDataSource([...dataSource])
        }
        setModal({ open: false, title: modal.title })
      }}
    />
  </PageContainer>)
}

export default () => {
  return (<KeepAlive clearAlive>
    <PageFileSourceList />
  </KeepAlive>);
};


export const pageConfig = definePageConfig(() => ({
  auth: ['/system/file/source'],
}));
