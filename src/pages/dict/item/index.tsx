import { ActionType, PageContainer, ProColumns, DragSortTable, useToken } from '@ant-design/pro-components';
import { Button, Space, Modal } from 'antd';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Auth from '@/components/auth';
import { AppDict, AppDictItem, OrgKind, TreeAction, } from '@/generated/adminx/graphql';
import { EnumAppDictItemStatus, delAppDictItemInfo, getAppDictItemList, moveAppDictItemInfo } from '@/services/adminx/dict';
import InputOrg from '@/pages/org/components/inputOrg';
import Create from './components/create';
import { Link, useSearchParams } from '@ice/runtime';
import { delDataSource, saveDataSource } from '@/util';

export default () => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<AppDictItem>[] = [
      // 有需要排序配置  sorter: true
      {
        title: '排序',
        dataIndex: 'displaySort',
        width: 60,
        className: 'drag-visible',
      },
      {
        title: t('name'),
        dataIndex: 'name',
        width: 120,
      },
      {
        title: t('code'),
        dataIndex: 'code',
        width: 100,
      },
      {
        title: t('org'),
        dataIndex: 'org',
        width: 120,
        renderFormItem: () => {
          return <InputOrg kind={OrgKind.Root} />
        },
        renderText: (text, record) => {
          return record.org?.name;
        },
      },
      { title: t('description'), dataIndex: 'comments', width: 160, search: false },
      { title: t('state'), dataIndex: 'status', width: 160, valueEnum: EnumAppDictItemStatus }
    ],
    [dictInfo, setDictInfo] = useState<AppDict>(),
    [dataSource, setDataSource] = useState<AppDictItem[]>([]),
    // 弹出层处理
    [modal, setModal] = useState({
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
      width: 170,
      render: (text, record) => {
        return <Space>
          <Auth authKey="updateAppDictItem" >
            <a key="viewer" onClick={() => {
              setModal({ open: true, title: `${t('edit_app_dict_item')}: ${record.code}`, id: record.id });
            }}>
              {t('edit')}
            </a>
          </Auth>
          <Auth authKey="deleteAppDictItem" >
            <a key="del" onClick={() => {
              Modal.confirm({
                title: t('delete'),
                content: `${t('confirm_delete')}：${record.name}?`,
                onOk: async (close) => {
                  const result = await delAppDictItemInfo(record.id);
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
        </Space>;
      },
    },
  );

  return (
    <>
      <PageContainer
        header={{
          title: t('app_dict_item'),
          style: { background: token.colorBgContainer },
          breadcrumb: {
            items: [
              { title: t('system_conf') },
              { title: <Link to="/dict">{t('app_dict')}</Link> },
              { title: t('app_dict_item') },
            ],
          },
        }}
      >
        <DragSortTable
          actionRef={proTableRef}
          rowKey={'id'}
          search={{
            searchText: `${t('query')}`,
            resetText: `${t('reset')}`,
            labelWidth: 'auto',
          }}
          toolbar={{
            title: `${t('app_dict')}: ${dictInfo?.name}`,
            actions: [
              <Auth authKey="createAppDictItem">
                <Button
                  key="create"
                  type="primary"
                  onClick={
                    () => {
                      setModal({ open: true, title: t('create_app_dict_item'), id: '' });
                    }
                  }
                >
                  {t('create_app_dict_item')}
                </Button >
              </Auth>,
            ],
          }}
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={dataSource}
          request={async (params, sort, filter) => {
            const table = { data: [] as AppDictItem[], success: true, total: 0 };
            const result = await getAppDictItemList(searchParams.get('id') ?? '');
            if (result?.id) {
              setDictInfo(result as AppDict);
            }
            if (result?.items) {
              result.items.forEach(item => {
                let isPubsh = true;
                if (params.name) {
                  isPubsh = isPubsh && item.name.indexOf(params.name) > -1
                }
                if (params.code) {
                  isPubsh = isPubsh && item.code.indexOf(params.code) > -1
                }
                if (params.org) {
                  isPubsh = isPubsh && item.orgID == params.org.id
                }
                if (params.status) {
                  isPubsh = isPubsh && item.status == params.status
                }
                if (isPubsh) {
                  table.data.push(item as AppDictItem);
                }
              })
            }
            table.total = table.data.length;
            setDataSource(table.data);
            return table;
          }}
          pagination={false}
          dragSortKey="displaySort"
          onDragSortEnd={async (newDataSource) => {
            /**
             * 往下移动
             * o  [1, 2, 3, 4, 5]
             * n  [2, 1, 3, 4, 5]
             * changeIdx=0 nidByOidx=1 oidByNidx=1
             *
             * o  [1, 2, 3, 4, 5]
             * n  [2, 3, 4, 1, 5]
             * changeIdx=0 nidByOidx=1 oidByNidx=3
             *
             * 往上移动
             * o  [1, 2, 3, 4, 5]
             * n  [1, 2, 3, 5, 4]
             * changeIdx=3 nidByOidx=4 oidByNidx=4
             *
             * o  [1, 2, 3, 4, 5]
             * n  [5, 1, 2, 3, 4]
             * changeIdx=0 nidByOidx=4 oidByNidx=1
             *  */
            let sourceId = "", targetId = "", action: TreeAction = TreeAction.Down;
            // 数据变化的位置
            const changeIdx = newDataSource.findIndex((item, idx) => dataSource[idx].id != item.id);
            // 新数组id在旧数组的位置
            const nidByOidx = dataSource.findIndex(item => item.id == newDataSource[changeIdx].id);
            // 旧数组id在新数组的位置
            const oidByNidx = newDataSource.findIndex(item => item.id == dataSource[changeIdx].id);

            if (nidByOidx < oidByNidx) {
              // 往下移动
              sourceId = dataSource[changeIdx].id;
              targetId = newDataSource[oidByNidx - 1].id;
            } else if (nidByOidx > oidByNidx) {
              // 往上移动
              sourceId = newDataSource[changeIdx].id;
              targetId = newDataSource[oidByNidx].id;
              action = TreeAction.Up;
            } else {
              // 这个是相邻互换位置
              sourceId = dataSource[changeIdx].id;
              targetId = dataSource[changeIdx + 1].id;
            }

            const result = await moveAppDictItemInfo(sourceId, targetId, action);
            if (result) {
              setDataSource(newDataSource);
            }
          }
          }
        />
        {
          dictInfo ? <Create
            open={modal.open}
            title={modal.title}
            appDictId={dictInfo.id}
            id={modal.id}
            onClose={(isSuccess, newInfo) => {
              if (isSuccess && newInfo) {
                setDataSource(saveDataSource(dataSource, newInfo))
              }
              setModal({ open: false, title: '', id: '' });
            }}
          /> : <></>
        }

      </PageContainer >
    </>
  );
};
