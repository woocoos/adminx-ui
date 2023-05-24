import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
  useToken,
} from "@ant-design/pro-components";
import { Button, Space, Dropdown, Modal } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { App, EnumAppKind, EnumAppStatus, delAppInfo, getAppList } from "@/services/app";
import defaultApp from "@/assets/images/default-app.png";
import AppCreate from "./components/create";
import { MutableRefObject, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { TableParams, TableSort, TableFilter, List } from "@/services/graphql";
import { Link, useAuth } from "ice";
import { assignOrgApp, getOrgAppList, revokeOrgApp } from "@/services/org/app";
import ModalApp from "./components/modalApp"
import { useTranslation } from "react-i18next";
import Auth, { checkAuth } from "@/components/Auth";
import { ItemType } from "antd/es/menu/hooks/useItems";
import KeepAlive from 'react-activation'

export type AppListRef = {
  getSelect: () => App[]
  reload: (resetPageIndex?: boolean) => void
}

const PageAppList = (props: {
  ref?: MutableRefObject<AppListRef>
  title?: string
  orgId?: string
  scene?: 'modal' | "orgApp",
  isMultiple?: boolean,
}, ref: MutableRefObject<AppListRef>) => {
  const { token } = useToken(),
    { t } = useTranslation(),
    [auth] = useAuth(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<App>[] = [
      // 有需要排序配置  sorter: true 
      { title: 'LOGO', dataIndex: 'logo', width: 90, align: 'center', valueType: "image", search: false },
      {
        title: t('name'), dataIndex: 'name', width: 120, search: {
          transform: (value) => ({ nameContains: value || undefined })
        }
      },
      { title: t('code'), dataIndex: 'code', width: 120, },
      {
        title: t('type'), dataIndex: 'kind',
        filters: true,
        search: false,
        width: 100,
        valueEnum: EnumAppKind,
      },
      { title: t('description'), dataIndex: 'comments', width: 160, search: false },
      {
        title: t('status'), dataIndex: 'status', filters: true, search: false, width: 100,
        valueEnum: EnumAppStatus,
      },
    ],
    [dataSource, setDataSource] = useState<App[]>([]),
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
    // 弹出层处理
    [modal, setModal] = useState({
      open: false,
      title: "",
      id: ""
    })

  if (!['modal'].includes(props.scene || '')) {
    columns.push(
      {
        title: t('operation'), dataIndex: 'actions', fixed: 'right',
        align: 'center', search: false, width: 170,
        render: (text, record) => {
          const items: ItemType[] = [
            { key: "policys", label: <Link to={`/app/policys?id=${record.id}`} >{t('policy')}</Link> },
            { key: "menu", label: <Link to={`/app/menu?id=${record.id}`} >{t('menu')}</Link> },
            { key: "roles", label: <Link to={`/app/roles?id=${record.id}`} >{t('role')}</Link> },
            { key: "resource", label: <Link to={`/app/resources?id=${record.id}`} >{t('resources')}</Link> },

          ]

          if (checkAuth('deleteApp', auth)) {
            items.push(
              { key: "delete", label: <a onClick={() => onDelApp(record)}>{t('delete')}</a> }
            )
          }

          return props.scene === 'orgApp' ? <Space>
            <Auth authKey="revokeOrganizationApp">
              <a onClick={() => {
                revokeOrg(record)
              }}>
                {t('disauthorization')}
              </a>
            </Auth>
          </Space> : <Space>
            <Auth authKey="updateApp">
              <Link key="viewer" to={`/app/viewer?id=${record.id}`}>
                {t('edit')}
              </Link>
            </Auth>
            <Link key="actions" to={`/app/actions?id=${record.id}`} >
              {t('permission')}
            </Link>
            <Dropdown trigger={['click']} menu={{
              items
            }} >
              <a><EllipsisOutlined /></a>
            </Dropdown>
          </Space>
        }
      },
    )
  }


  const
    getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
      const table = { data: [] as App[], success: true, total: 0 };
      let result: List<App> | null = null;
      if (props.orgId) {
        result = await getOrgAppList(props.orgId, params, filter, sort)
      } else {
        result = await getAppList(params, filter, sort)
      }

      if (result) {
        table.data = result.edges.map(item => {
          item.node.logo = item.node.logo || defaultApp
          return item.node
        })
        table.total = result.totalCount

      } else {
        table.total = 0
      }
      setDataSource(table.data)
      return table
    },
    onDelApp = (record: App) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t('confirm delete')}：${record.name}?`,
        onOk: async (close) => {
          const result = await delAppInfo(record.id)
          if (result) {
            proTableRef.current?.reload();
            close();
          }
        }
      })
    },
    revokeOrg = (record: App) => {
      Modal.confirm({
        title: t('disauthorization'),
        content: `${t('confirm disauthorization')}：${record.name}?`,
        onOk: async (close) => {
          if (props.orgId) {
            const result = await revokeOrgApp(props.orgId, record.id)
            if (result) {
              proTableRef.current?.reload();
              close();
            }
          }
        }
      })
    },
    onDrawerClose = (isSuccess: boolean) => {
      if (isSuccess) {
        proTableRef.current?.reload();
      }
      setModal({ open: false, title: '', id: '' })
    }

  useImperativeHandle(ref, () => {
    return {
      getSelect: () => {
        return dataSource.filter(item => selectedRowKeys.includes(item.id))
      },
      reload: (resetPageIndex?: boolean) => {
        proTableRef.current?.reload(resetPageIndex);
      }
    }
  })

  return (
    <>
      {
        ['modal', 'orgApp'].includes(props.scene || '') ? (
          <>
            <ProTable
              actionRef={proTableRef}
              rowKey={"id"}
              search={{
                searchText: `${t('query')}`,
                resetText: `${t('reset')}`,
                labelWidth: 'auto',
              }}
              toolbar={{
                title: props?.title || t("{{field}} list", { field: t('app') }),
                actions: props.scene === 'orgApp' ? [
                  <Auth authKey="assignOrganizationApp">
                    <Button type="primary" onClick={() => {
                      setModal({ open: true, title: t("search {{field}}", { field: t("app") }), id: '' })
                    }}>
                      {t('Authorized application')}
                    </Button>
                  </Auth>
                ] : []
              }}
              scroll={{ x: 'max-content', y: 300 }}
              columns={columns}
              request={getRequest}
              pagination={{ showSizeChanger: true }}
              rowSelection={props?.scene === 'modal' ? {
                selectedRowKeys: selectedRowKeys,
                onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys) },
                type: props.isMultiple ? "checkbox" : "radio"
              } : false}
            />
            {props.scene === 'orgApp' ? (
              <ModalApp
                open={modal.open}
                title={modal.title}
                onClose={async (selectData) => {
                  const sdata = selectData?.[0]
                  if (sdata && props.orgId) {
                    const result = await assignOrgApp(props.orgId, sdata.id)
                    if (result) {
                      proTableRef.current?.reload();
                    }
                  }
                  setModal({ open: false, title: modal.title, id: '' })
                }}
              />) : ""}

          </>
        ) : (
          <PageContainer
            header={{
              title: t("{{field}} management", { field: t('app') }),
              style: { background: token.colorBgContainer },
              breadcrumb: {
                items: [
                  { title: t('System configuration'), },
                  { title: t("{{field}} management", { field: t('app') }), },
                ],
              },
            }}
          >
            <ProTable
              actionRef={proTableRef}
              rowKey={"id"}
              search={{
                searchText: `${t('query')}`,
                resetText: `${t('reset')}`,
                labelWidth: 'auto',
              }}
              toolbar={{
                title: t("{{field}} list", { field: t('app') }),
                actions: [
                  <Auth authKey="createApp">
                    <Button key="create" type="primary" onClick={
                      () => {
                        setModal({ open: true, title: t("create {{field}}", { field: t('app') }), id: '' })
                      }
                    }>
                      {t("create {{field}}", { field: t('app') })}
                    </Button >
                  </Auth>
                ]
              }}
              scroll={{ x: 'max-content' }}
              columns={columns}
              request={getRequest}
              pagination={{ showSizeChanger: true }}
            />

            <AppCreate
              open={modal.open}
              title={modal.title}
              id={modal.id}
              onClose={onDrawerClose} />
          </PageContainer >
        )}
    </>
  );
};

export const AppList = forwardRef(PageAppList)

export default () => {

  return <KeepAlive cacheKey="appList">
    <AppList />
  </KeepAlive>
}