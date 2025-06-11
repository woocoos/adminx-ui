import { ActionType, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { Button, Space, Modal, message, Upload } from 'antd';
import { MutableRefObject, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { getAppInfo } from '@/services/adminx/app';
import CreateAppAction from './components/create';
import { EnumAppActionKind, EnumAppActionMethod, createAppAction, delAppAction, getAppActionList } from '@/services/adminx/app/action';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from '@ice/runtime';
import Auth from '@/components/auth';
import { App, AppAction, AppActionKind, AppActionMethod, AppActionWhereInput, CreateAppActionInput } from '@/generated/adminx/graphql';
import { delDataSource, getDate, saveDataSource } from '@/util';
import { exportExecel, importExcel, SheetData } from '@/util/excel';

export type AppActionListRef = {
  getSelect: () => AppAction[];
  reload: (resetPageIndex?: boolean) => void;
};

const AppActionList = (props: {
  appId?: string;
  title?: string;
  ref?: MutableRefObject<AppActionListRef>;
}, ref: MutableRefObject<AppActionListRef>) => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    appId = props?.appId || searchParams.get('id'),
    [appInfo, setAppInfo] = useState<App>(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
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
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
    [importLoading, setImportLoading] = useState(false),
    [exportLoading, setExportLoading] = useState(false),
    // 弹出层处理
    [modal, setModal] = useState<{
      open: boolean;
      title: string;
      id: string;
    }>({
      open: false,
      title: '',
      id: '',
    });

  columns.push(
    {
      title: t('operation'),
      dataIndex: 'actions',
      fixed: 'right',
      align: 'center',
      search: false,
      width: 80,
      render: (text, record) => {
        return record.kind !== AppActionKind.Route ? (<Space>
          <Auth authKey={'updateAppAction'}>
            <a
              key="editor"
              onClick={() => {
                setModal({
                  open: true, title: `${t('edit')}:${record.name}`, id: record.id,
                });
              }}
            >
              {t('edit')}
            </a>
          </Auth>
          <Auth authKey={'deleteAppAction'}>
            <a key="del" onClick={() => onDel(record)}>
              {t('delete')}
            </a>
          </Auth>
        </Space>) : <></>;
      },
    },
  );

  const
    getApp = async () => {
      if (appId) {
        const result = await getAppInfo(appId);
        if (result?.id) {
          setAppInfo(result as App);
          return result;
        }
      }
      return null;
    },
    onDel = (record: AppAction) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t('confirm_delete')}：${record.name}?`,
        onOk: async (close) => {
          const result = await delAppAction(record.id);
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
    },
    onDrawerClose = (isSuccess: boolean, newInfo?: AppAction) => {
      if (isSuccess && newInfo) {
        setDataSource(saveDataSource(dataSource, newInfo))
      }
      setModal({ open: false, title: '', id: '' });
    };

  useImperativeHandle(ref, () => {
    return {
      getSelect: () => {
        return dataSource.filter(item => selectedRowKeys.includes(item.id));
      },
      reload: (resetPageIndex?: boolean) => {
        proTableRef.current?.reload(resetPageIndex);
      },
    };
  });


  return (<>
    <PageContainer
      header={{
        title: t('app_auth'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: <Link to={'/system/app'}>{t('app_manage')}</Link> },
            { title: t('app_auth') },
          ],
        },

      }}
    >
      <ProTable
        actionRef={proTableRef}
        search={{
          searchText: `${t('query')}`,
          resetText: `${t('reset')}`,
          labelWidth: 'auto',
        }}
        rowKey={'id'}
        toolbar={{
          title: `${t('app')}:${appInfo?.name || '-'}`,
          actions: [
            <Auth authKey="importAppActions">
              <Upload
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                showUploadList={false}
                beforeUpload={async (file) => {
                  if (appInfo) {
                    setImportLoading(true);
                    importExcel(file, async (sheetData) => {
                      const list = sheetData[0]?.data?.filter(item => `${item[0]}`.trim().length > 0) ?? [];
                      if (list.length) {
                        const inputs: CreateAppActionInput[] = []
                        list.forEach(item => {
                          inputs.push({
                            appID: appInfo.id,
                            name: item[0] as string,
                            kind: item[1] as AppActionKind,
                            method: item[2] as AppActionMethod,
                            comments: item[3] as string,
                          })
                        })
                        const result = await createAppAction(appInfo.id, inputs)
                        if (result?.[0]?.id) {
                          message.success(t('submit_success'))
                        }
                      }
                      setImportLoading(false);
                    });
                  }
                  return false;
                }}
              >
                <Button
                  key="import"
                  type="primary"
                  loading={importLoading}
                >
                  {t('import')}
                </Button>
              </Upload>
            </Auth>,
            <Auth authKey="exportAppActions">
              <Button
                key="export"
                type="primary"
                loading={exportLoading}
                onClick={() => {
                  if (selectedRowKeys.length) {
                    setExportLoading(true)
                    const outData: SheetData = {
                      sheetName: t('app_auth'),
                      data: [],
                    }
                    selectedRowKeys.forEach(srkId => {
                      const d = dataSource.find(dsItem => dsItem.id === srkId)
                      if (d) {
                        outData.data.push([
                          d.name.trim(),
                          d.kind,
                          d.method,
                          d.comments?.trim() ?? '',
                        ])
                      }
                    })
                    exportExecel(`${appInfo?.name ?? ''}${getDate(new Date())}${t('app_auth')}`, [outData]);
                    setExportLoading(false)
                  } else {
                    message.warning(t('please_select_export_row'));
                  }
                }}
              >
                {t('export')}
              </Button>
            </Auth>,
            <Auth authKey="createAppActions">
              <Button
                key="created"
                type="primary"
                onClick={() => {
                  setModal({ open: true, title: t('create_permission'), id: '' });
                }}
              >
                {t('create_permission')}
              </Button>
            </Auth>,
          ],
        }}
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={dataSource}
        request={async (params) => {
          const table = { data: [] as AppAction[], success: true, total: 0 },
            where: AppActionWhereInput = {},
            info = appInfo?.id === appId ? appInfo : await getApp();
          where.nameContains = params.nameContains;
          where.kind = params.kind;
          where.method = params.method;
          if (info) {
            const result = await getAppActionList(info.id, {
              current: params.current,
              pageSize: params.pageSize,
              where,
            });
            if (result?.totalCount) {
              table.data = result.edges?.map(item => item?.node) as AppAction[];
              table.total = result.totalCount;
            }
          }
          setSelectedRowKeys([]);
          setDataSource(table.data);
          return table;
        }}
        pagination={{ showSizeChanger: true }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys); },
          type: 'checkbox',
        }}
      />
      <CreateAppAction
        open={modal.open}
        title={modal.title}
        id={modal.id}
        appId={appInfo?.id}
        onClose={onDrawerClose}
      />
    </PageContainer >
  </>);
};


export default forwardRef(AppActionList);
