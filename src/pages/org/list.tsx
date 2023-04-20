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
import { EnumOrgStatus, Org, delOrgInfo, getOrgList } from "@/services/org";
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
  scene?: 'modal',
  isMultiple?: boolean,
}, ref: MutableRefObject<OrgListRef>) => {
  const { token } = useToken(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    [allList, setAllList] = useState<Org[]>([]),
    columns: ProColumns<Org>[] = [
      // 有需要排序配置  sorter: true 
      { title: '名称', dataIndex: 'name', width: 120, },
      { title: '编码', dataIndex: 'code', width: 120, },
      { title: '域', dataIndex: 'domain', width: 120, },
      { title: '国家/地区', dataIndex: 'countryCode', width: 120 },
      { title: '管理账户', dataIndex: 'ownerID', width: 120 },
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
      scene: "editor"
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
            <a key="editor" onClick={() => editorAction(record, 'editor')}>
              编辑
            </a>
            <Link key="userGroup" to={`/org/user-group`}>
              用户组
            </Link>
            <Dropdown trigger={['click']} menu={{
              items: [
                {
                  key: 'create', label: "新建", children: createAction
                },
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
      const table = { data: [] as Org[], success: true, total: 0 };
      const result = await getOrgList(params, filter, sort);

      if (result) {
        const list = result.edges.map(item => item.node)
        setAllList(list)
        table.data = formatTreeData(list, undefined, { key: 'id', parentId: "parentID", children: 'children' })
        table.total = result.totalCount
        setExpandedRowKeys(list.map(item => item.id))
      } else {
        setAllList([])
        setExpandedRowKeys([])
        table.total = 0
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
            toolbar={{
              title: props?.title || "组织树"
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
              title: "组织管理",
              style: { background: token.colorBgContainer },
              breadcrumb: {
                items: [
                  { title: "系统配置", },
                  { title: "组织管理", },
                ],
              },
              extra: []
            }}
          >
            <ProTable
              actionRef={proTableRef}
              rowKey={"id"}
              toolbar={{
                title: "组织树"
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
              onClose={onDrawerClose} />
          </PageContainer>
        )
      }

    </>
  );
};


export default forwardRef(OrgList) 