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
import { TableParams, TableSort, TableFilter } from "@/services/graphql";
import { Link } from "ice";

export type AppListRef = {
  getSelect: () => App[]
  reload: () => void
}

const AppList = (props: {
  ref?: MutableRefObject<AppListRef>
  title?: string
  scene?: 'modal',
  isMultiple?: boolean,
}, ref: MutableRefObject<AppListRef>) => {
  const { token } = useToken(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    columns: ProColumns<App>[] = [
      // 有需要排序配置  sorter: true 
      { title: 'LOGO', dataIndex: 'logo', width: 90, align: 'center', valueType: "image", search: false },
      { title: '名称', dataIndex: 'name', width: 120, },
      { title: '编码', dataIndex: 'code', width: 120, },
      {
        title: '类型', dataIndex: 'kind',
        filters: true,
        search: false,
        width: 100,
        valueEnum: EnumAppKind,
      },
      { title: '描述', dataIndex: 'comments', width: 160, search: false },
      {
        title: '状态', dataIndex: 'status', filters: true, search: false, width: 100,
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
        title: '操作', dataIndex: 'actions', fixed: 'right',
        align: 'center', search: false, width: 170,
        render: (text, record) => {
          return <Space>
            <Link key="viewer" to={`/app/viewer?id=${record.id}`}>
              编辑
            </Link>
            <Link key="actions" to={`/app/actions?id=${record.id}`} >
              权限
            </Link>
            <Dropdown trigger={['click']} menu={{
              items: [
                { key: "policys", label: <Link to={`/app/policys?id=${record.id}`} >权限策略</Link> },
                { key: "menu", label: <Link to={`/app/menu?id=${record.id}`} >菜单</Link> },
                { key: "roles", label: <Link to={`/app/roles?id=${record.id}`} >角色</Link> },
                { key: "resource", label: <Link to={`/app/resource?id=${record.id}`} >资源</Link> },
                { key: "delete", label: <a onClick={() => onDelApp(record)}>删除</a> },
              ]
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
      const result = await getAppList(params, filter, sort);

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
        title: "删除",
        content: `是否删除应用：${record.name}`,
        onOk: async (close) => {
          const result = await delAppInfo(record.id)
          if (result) {
            proTableRef.current?.reload();
            close();
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
      reload: () => {
        proTableRef.current?.reload();
      }
    }
  })

  return (
    <>
      {
        ['modal'].includes(props.scene || '') ? (
          <ProTable
            actionRef={proTableRef}
            rowKey={"id"}
            toolbar={{
              title: props?.title || "应用列表"
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
        ) : (
          <PageContainer
            header={{
              title: "应用管理",
              style: { background: token.colorBgContainer },
              breadcrumb: {
                items: [
                  { title: "系统配置", },
                  { title: "应用管理", },
                ],
              },
              extra: [
                <Button key="create" type="primary" onClick={
                  () => {
                    setModal({ open: true, title: '创建应用', id: '' })
                  }
                }>
                  创建应用
                </Button >
              ]
            }}
          >
            <ProTable
              actionRef={proTableRef}
              rowKey={"id"}
              toolbar={{
                title: "应用列表"
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

export default forwardRef(AppList) 