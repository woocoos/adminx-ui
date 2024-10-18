
import Auth from '@/components/auth';
import { ActionType, DragSortTable, PageContainer, ProColumns, ProTable, useToken } from '@ant-design/pro-components';
import { KeepAlive } from '@knockout-js/layout';
import { Button, Col, Modal, Row, Space } from 'antd';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Create from './components/create';
import { definePageConfig, Link } from 'ice';
import { delDataSource, saveDataSource, searchMoveList } from '@/util';
import { delCountryInfo, EnumCountryStatus, getCountryList, moveCountryInfo } from '@/services/adminx/country';
import { Country, CountryWhereInput } from '@/generated/adminx/graphql';

const PageList = () => {
  const { t } = useTranslation(),
    { token } = useToken(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<Country>[] = [
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
        title: t('name_en'),
        dataIndex: 'nameEn',
        width: 100,
      },
      {
        title: t('status'),
        dataIndex: 'status',
        width: 90,
        search: false,
        valueEnum: EnumCountryStatus,
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
            <Auth authKey="updateCountry">
              <a key="editor" onClick={() => {
                setModal({ open: true, title: t(`${t('edit')}-${record.name}`), id: record.id });
              }}>
                {t('edit')}
              </a>
            </Auth>
            <Link key="region" to={`/system/country/region?id=${record.id}`}>
              {t('region')}
            </Link>
            <Auth authKey="deleteCountry">
              <a key="delete" onClick={() => {
                Modal.confirm({
                  title: t('delete'),
                  content: `${t('confirm_delete')}：${record.name}?`,
                  onOk: async (close) => {
                    const result = await delCountryInfo(record.id);
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
    [dataSource, setDataSource] = useState<Country[]>([]),
    [isDragSort, setIsDragSort] = useState(false);


  return (<PageContainer
    header={{
      title: t('country_list'),
      extra: <Auth authKey={'moveCountry'}>
        <Button size="small" onClick={() => {
          setIsDragSort(!isDragSort);
        }}>{isDragSort ? t('cancel') : t('drag')}</Button>
      </Auth>,
      style: { background: token.colorBgContainer },
      breadcrumb: {
        items: [
          { title: t('system_conf') },
          { title: t('country_region_title') },
        ]
      },
    }}
  >
    {isDragSort ?
      <DragSortTable
        columns={columns.filter(item => item.dataIndex !== 'actions')}
        dataSource={dataSource}
        rowKey={'id'}
        pagination={false}
        dragSortKey="id"
        search={false}
        options={false}
        toolbar={{
          title: t('country_list'),
        }}
        onDragSortEnd={async (newDataSource) => {
          const moveData = searchMoveList(dataSource, newDataSource)
          if (moveData) {
            const result = await moveCountryInfo(moveData.sourceId, moveData.targetId, moveData.action);
            if (result) {
              setDataSource(newDataSource);
            }
          }
        }}
      />
      : <ProTable
        actionRef={proTableRef}
        rowKey={'id'}
        search={{
          labelWidth: 100,
        }}
        toolbar={{
          title: t('country_list'),
          actions: [
            <Auth authKey={'createCountry'}>
              <Button
                type="primary"
                onClick={() => {
                  setModal({ open: true, title: t('create_country') });
                }}
              >
                {t('create_country')}
              </Button>
            </Auth>,
          ],
        }}
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={dataSource}
        request={async (params) => {
          const table = { data: [] as Country[], success: true, total: 0 },
            where: CountryWhereInput = {}
          where.codeContains = params.code;
          where.nameContains = params.name;
          where.nameEnContains = params.nameEn;
          const result = await getCountryList({
            current: params.current,
            pageSize: params.pageSize,
            where,
          });
          if (result?.totalCount) {
            table.total = result.totalCount;
            result.edges?.forEach(item => {
              if (item?.node) {
                table.data.push(item.node as Country);
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
      />}


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
  auth: ['/system/country'],
}));
