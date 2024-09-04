
import Auth from '@/components/auth';
import { FileIdentity, FileIdentityWhereInput, FileSource, } from '@/generated/adminx/graphql';
import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { KeepAlive } from '@knockout-js/layout';
import { Button, message, Modal, Space, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Create from './components/create';
import { definePageConfig, useSearchParams } from 'ice';
import { delFileIdentity, getFileIdentityList, setDefaultFileIdentity } from '@/services/adminx/file/identities';
import { getFileSourceInfo } from '@/services/adminx/file/source';
import { delDataSource, saveDataSource } from '@/util';

const PageFileSourceList = () => {
  const { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    [fileSourceInfo, setFileSourceInfo] = useState<FileSource>(),
    { token } = useToken(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<FileIdentity>[] = [
      // 有需要排序配置  sorter: true
      {
        title: "ID",
        dataIndex: 'id',
        width: 80,
        search: false,
      },
      {
        title: "AccessKeyID",
        dataIndex: 'accessKeyID',
        width: 100,
      },
      {
        title: "RoleArn",
        dataIndex: 'roleArn',
        width: 100,
        search: false,
      },
      {
        title: t('default'),
        dataIndex: 'isDefault',
        width: 100,
        search: false,
        render: (text, record) => {
          return record.isDefault ? t('yes') : t('no');
        }
      },
      {
        title: `STS ${t('validity')}(s)`,
        dataIndex: 'durationSeconds',
        width: 110,
        align: 'center',
        search: false,
      },
      {
        title: t('policy'), dataIndex: 'policy', width: 150, search: false,
        render: (text, record) => {
          const str = record.policy?.slice(0, 20)
          return str ? <Tooltip title={record.policy}>{(record.policy?.length ?? 0) > 20 ? `${str}...` : str}</Tooltip > : '-';
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
                setModal({ open: true, title: t(`${t('edit')}-${record.accessKeyID}`), id: record.id });
              }}>
                {t('edit')}
              </a>
            </Auth>
            <Auth authKey="deleteFileSource">
              <a key="editor" onClick={() => {
                Modal.confirm({
                  title: t('delete'),
                  content: `${t('confirm_delete')}：${record.accessKeyID}?`,
                  onOk: async (close) => {
                    const result = await delFileIdentity(record.id);
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
    [dataSource, setDataSource] = useState<FileIdentity[]>([]),
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
    // 弹出层处理
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
      id?: string;
    }>({
      open: false,
      title: '',
    }),
    getFsInfo = async () => {
      const fsId = searchParams.get('fs_id') || ''
      if (fileSourceInfo) {
        return fileSourceInfo
      } else if (fsId) {
        const result = await getFileSourceInfo(fsId);
        if (result?.id) {
          setFileSourceInfo(result as FileSource)
          return result as FileSource
        }
      }
      return undefined
    }



  return (<PageContainer
    header={{
      title: t('file_source_identity'),
      style: { background: token.colorBgContainer },
      breadcrumb: {
        items: [
          { title: t('system_conf') },
          { title: t('file_source'), href: '/system/file/source' },
          { title: t('file_source_identity') },
        ]
      },
    }}
  >
    <ProTable
      actionRef={proTableRef}
      rowKey={'id'}
      search={{
        labelWidth: 110,
      }}
      toolbar={{
        title: `${fileSourceInfo?.bucketURL ?? ''}:${t('file_source_identity_list')}`,
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
          <Auth authKey={'setDefaultFileIdentity'}>
            <Button
              type="default"
              onClick={() => {
                const dsData = dataSource.find(item => item.id == selectedRowKeys[0]);
                if (dsData) {
                  Modal.confirm({
                    title: t('set_default'),
                    content: t('confirm_set_default_{{field}}', {
                      field: `ID: ${dsData.id}`
                    }),
                    onOk: async (close) => {
                      const result = await setDefaultFileIdentity(dsData.id, dsData.tenantID);
                      if (result) {
                        message.success(`${t('submit_success')}`)
                        close();
                        proTableRef.current?.reload()
                      }
                    },
                  })
                } else {
                  message.warning(`${t('please_select_list_item')}`)
                }
              }}
            >
              {t('set_default')}
            </Button>
          </Auth>,
        ],
      }}
      scroll={{ x: 'max-content' }}
      columns={columns}
      dataSource={dataSource}
      request={async (params) => {
        const table = { data: [] as FileIdentity[], success: true, total: 0 },
          where: FileIdentityWhereInput = {}, fsInfo = await getFsInfo();
        if (fsInfo) {
          where.fileSourceID = fsInfo.id;
          where.accessKeyIDContains = params.accessKeyID;
          const result = await getFileIdentityList({
            current: params.current,
            pageSize: params.pageSize,
            where,
          });
          if (result?.totalCount) {
            table.total = result.totalCount;
            result.edges?.forEach(item => {
              if (item?.node) {
                table.data.push(item.node as FileIdentity);
              }
            })
          }
          setSelectedRowKeys([]);
          setDataSource(table.data);
        }
        return table;
      }}
      pagination={{ showSizeChanger: true }}
      rowSelection={{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys); },
        type: 'radio',
      }}
    />
    <Create
      open={modal.open}
      title={modal.title}
      id={modal.id}
      fsId={fileSourceInfo?.id ?? ''}
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
  return (
    <PageFileSourceList />
  );
  // return (<KeepAlive clearAlive>
  //   <PageFileSourceList />
  // </KeepAlive>);
};


// export const pageConfig = definePageConfig(() => ({
//   auth: ['/system/file/identity'],
// }));
