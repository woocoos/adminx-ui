import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
  useToken,
} from "@ant-design/pro-components";
import { Button, Space, Dropdown, Modal } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { MutableRefObject, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { TableSort, TableParams, TableFilter } from "@/services/graphql";
import { Link } from "ice";
import { EnumOrgKind, EnumOrgStatus, Org, OrgKind, delOrgInfo, getOrgList, getOrgPathList } from "@/services/org";
import OrgCreate from "./components/create";
import { formatTreeData } from "@/util";
import { TreeEditorAction } from "@/util/type";

export type OrgListRef = {
  getSelect: () => Org[]
  reload: () => void
}

const OrgList = (props: {
  ref?: MutableRefObject<OrgListRef>
  title?: string
  scene?: 'modal'
  isMultiple?: boolean
  tenantId?: string
  kind?: OrgKind
}, ref: MutableRefObject<OrgListRef>) => {

  const { token } = useToken(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    kind = props.kind || 'root',
    columns: ProColumns<Org>[] = [
      // 有需要排序配置  sorter: true 
      { title: '名称', dataIndex: 'name', width: 120, },
      { title: '编码', dataIndex: 'code', width: 120, },
      { title: '类型', dataIndex: 'kind', width: 120, valueEnum: EnumOrgKind },
      { title: '域', dataIndex: 'domain', width: 120, },
      { title: '国家/地区', dataIndex: 'countryCode', width: 120 },
      {
        title: '管理账户', dataIndex: 'owner', width: 120, render: (text, record) => {
          return <div>{record?.owner?.displayName || '-'}</div>
        }
      },
      {
        title: '状态', dataIndex: 'status', filters: true, search: false, width: 100,
        valueEnum: EnumOrgStatus,
      },
    ],
    [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]),
    [dataSource, setDataSource] = useState<Org[]>([]),
    // 选中处理
    [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
    // 弹出层处理
    [modal, setModal] = useState<{
      open: boolean
      title: string
      id: string
      scene: TreeEditorAction
    }>({
      open: false,
      title: "",
      id: "",
      scene: "editor",
    })

  if (props.scene !== 'modal') {
    columns.push(
      {
        title: '操作', dataIndex: 'actions', fixed: 'right',
        align: 'center', search: false, width: 170,
        render: (text, record) => {
          const createAction = [
            {
              key: 'child', label: <a onClick={(e) => {
                editorAction(record, 'child')
              }}>子层</a>
            }
          ]
          if (record.parentID != '0') {
            createAction.unshift({
              key: 'peer', label: <a onClick={(e) => {
                editorAction(record, 'peer')
              }}>同层</a>
            })
          }

          return <Space>
            {record.kind === kind ? <>
              <a key="editor" onClick={() => editorAction(record, 'editor')}>
                编辑
              </a>
            </> : <></>}
            {
              kind == 'root' ? (<>
                <Link key="userGroup" to={`/org/groups?id=${record.id}`}>
                  用户组
                </Link>
                <Dropdown trigger={['click']} menu={{
                  items: [
                    { key: "policy", label: <Link to={`/org/policys?id=${record.id}`}>权限策略</Link> },
                    { key: "app", label: <Link to={`/org/apps?id=${record.id}`}>授权应用</Link> },
                    { key: "org", label: <Link to={`/org/departments?id=${record.id}`} >组织部门管理</Link> },
                    { key: "orgUser", label: <Link to={`/org/users?id=${record.id}`}>组织用户管理</Link> },
                  ]
                }} >
                  <a><EllipsisOutlined /></a>
                </Dropdown>
              </>
              ) : (
                <Dropdown trigger={['click']} menu={{
                  items: record.kind === kind ? [
                    {
                      key: 'create', label: "新建", children: createAction
                    },
                    { key: "delete", label: <a onClick={() => onDelApp(record)}>删除</a> },
                  ] : [
                    {
                      key: 'create', label: "新建", children: createAction
                    },
                  ]
                }} >
                  <a><EllipsisOutlined /></a>
                </Dropdown>
              )
            }
          </Space>
        }
      },
    )
  }


  const
    getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
      const table = { data: [] as Org[], success: true, total: 0 };
      let list: Org[] = [];
      if (kind === 'org') {
        if (props.tenantId) {
          list = await getOrgPathList(props.tenantId, kind)
          table.total = list.length
        }
      } else {
        const result = await getOrgList({ kind: kind }, {}, {});
        if (result) {
          list = result.edges.map(item => item.node)
          table.total = result.totalCount
        }
      }

      if (list.length) {
        table.data = formatTreeData(list, undefined, { key: 'id', parentId: "parentID" })
        setExpandedRowKeys(list.map(item => item.id))
      } else {
        setExpandedRowKeys([])
      }
      setDataSource(table.data)
      return table
    },
    onDelApp = (record: Org) => {
      Modal.confirm({
        title: "删除",
        content: `是否删除组织：${record.name}`,
        onOk: async (close) => {
          const result = await delOrgInfo(record.id)
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
      setModal({ open: false, title: '', id: '', scene: 'editor' })
    },
    editorAction = (info: Org, action: TreeEditorAction) => {
      let title = "";
      switch (action) {
        case "child":
          title = `创建-${info.name}-子层`
          break;
        case "peer":
          title = `创建-${info.name}-同层`
          break;
        case "editor":
          title = `编辑-${info.name}`
          break;
        default:
          break;
      }
      setModal({ open: true, title: title, id: info.id, scene: action })
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
            search={false}
            toolbar={{
              title: props?.title || (kind === 'org' ? "组织部门树" : "组织树")
            }}
            expandable={{
              expandedRowKeys: expandedRowKeys,
              onExpandedRowsChange: (expandedKeys: string[]) => {
                setExpandedRowKeys(expandedKeys)
              }
            }}
            scroll={{ x: 'max-content', y: 300 }}
            columns={columns}
            request={getRequest}
            pagination={false}
            rowSelection={props?.scene === 'modal' ? {
              selectedRowKeys: selectedRowKeys,
              onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys) },
              type: props.isMultiple ? "checkbox" : "radio"
            } : false}
          />
        ) : (
          <PageContainer
            header={{
              title: kind == 'org' ? "组织部门管理" : "组织管理",
              style: { background: token.colorBgContainer },
              breadcrumb: {
                items: kind == 'org' ? [
                  { title: "组织协作", },
                  { title: "组织部门管理", },
                ] : [
                  { title: "系统配置", },
                  { title: "组织管理", },
                ],
              },
              extra: kind == 'org' ? <></> : <>
                {/* <Button
                  type="primary" onClick={() => {
                    setModal({ open: true, title: "创建组织", id: "", scene: "editor" })

                  }}>
                  创建组织
                </Button> */}
              </>
            }}
          >
            <ProTable
              actionRef={proTableRef}
              rowKey={"id"}
              search={false}
              toolbar={{
                title: kind === 'org' ? "组织部门树" : "组织树"
              }}
              expandable={{
                expandedRowKeys: expandedRowKeys,
                onExpandedRowsChange: (expandedKeys: string[]) => {
                  setExpandedRowKeys(expandedKeys)
                }
              }}
              scroll={{ x: 'max-content' }}
              columns={columns}
              request={getRequest}
              pagination={false}
            />
            <OrgCreate
              open={modal.open}
              title={modal.title}
              id={modal.id}
              scene={modal.scene}
              kind={kind}
              onClose={onDrawerClose} />
          </PageContainer>
        )
      }

    </>
  );
};


export default forwardRef(OrgList) 