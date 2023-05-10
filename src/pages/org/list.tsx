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
import { Link, useAuth } from "ice";
import { EnumOrgKind, EnumOrgStatus, Org, OrgKind, delOrgInfo, getOrgList, getOrgPathList } from "@/services/org";
import OrgCreate from "./components/create";
import { formatTreeData } from "@/util";
import { TreeEditorAction } from "@/util/type";
import { getAppOrgList } from "@/services/app/org";
import { useTranslation } from "react-i18next";
import Auth, { checkAuth } from "@/components/Auth";
import { ItemType } from "antd/es/menu/hooks/useItems";

export type OrgListRef = {
  getSelect: () => Org[]
  reload: (resetPageIndex: boolean) => void
}

const OrgList = (props: {
  ref?: MutableRefObject<OrgListRef>
  title?: string
  scene?: 'modal'
  isMultiple?: boolean
  tenantId?: string
  appId?: string
  kind?: OrgKind
}, ref: MutableRefObject<OrgListRef>) => {

  const { token } = useToken(),
    { t } = useTranslation(),
    [auth] = useAuth(),
    // 表格相关
    proTableRef = useRef<ActionType>(),
    kind = props.kind || 'root',
    columns: ProColumns<Org>[] = [
      // 有需要排序配置  sorter: true 
      { title: t('name'), dataIndex: 'name', width: 120, },
      { title: t('code'), dataIndex: 'code', width: 120, },
      { title: t('type'), dataIndex: 'kind', width: 120, valueEnum: EnumOrgKind },
      { title: t('domain'), dataIndex: 'domain', width: 120, search: false, },
      { title: t('country/region'), dataIndex: 'countryCode', width: 120, search: false, },
      {
        title: t('manage account'), dataIndex: 'owner', width: 120, search: false,
        render: (text, record) => {
          return <div>{record?.owner?.displayName || '-'}</div>
        }
      },
      { title: t('description'), dataIndex: 'profile', width: 120, search: false, },
    ],
    [allList, setAllList] = useState<Org[]>([]),
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
        title: t('operation'), dataIndex: 'actions', fixed: 'right',
        align: 'center', search: false, width: 150,
        render: (text, record) => {
          const createAction = [
            {
              key: 'child', label: <a onClick={(e) => {
                editorAction(record, 'child')
              }}>
                {t('sublayer')}
              </a>
            }
          ]
          if (record.parentID != '0') {
            createAction.unshift({
              key: 'peer', label: <a onClick={(e) => {
                editorAction(record, 'peer')
              }}>
                {t('same level')}
              </a>
            })
          }
          const items: ItemType[] = []
          if (kind == 'root') {
            items.push(
              { key: "policy", label: <Link to={`/org/policys?id=${record.id}`}>{t('policy')}</Link> },
              { key: "app", label: <Link to={`/org/apps?id=${record.id}`}>{t('authorized application')}</Link> },
              { key: "org", label: <Link to={`/org/departments?id=${record.id}`} >{t('organizational department management')}</Link> },
              { key: "orgUser", label: <Link to={`/org/users?id=${record.id}`}>{t('organizational user management')}</Link> },
            )
          } else {
            if (checkAuth("createOrganization", auth)) {
              items.push(
                { key: 'create', label: t('created'), children: createAction }
              )
            }
            if (record.kind === kind && checkAuth("deleteOrganization", auth)) {
              items.push(
                { key: "delete", label: <a onClick={() => onDelApp(record)}>{t('delete')}</a> }
              )
            }
          }

          return <Space>
            {record.kind === kind ? <>
              <Auth authKey="updateOrganization">
                <a key="editor" onClick={() => editorAction(record, 'editor')}>
                  {t('edit')}
                </a>
              </Auth>
            </> : <></>}
            {
              kind == 'root' ? <>
                <Link key="userGroup" to={`/org/groups?id=${record.id}`}>
                  {t('user group')}
                </Link>
                {items.length ? <Dropdown trigger={['click']} menu={{
                  items
                }} >
                  <a><EllipsisOutlined /></a>
                </Dropdown> : ''}
              </>
                : <>
                  {items.length ? <Dropdown trigger={['click']} menu={{
                    items
                  }} >
                    <a><EllipsisOutlined /></a>
                  </Dropdown> : ''}
                </>
            }
          </Space>
        }
      },
    )
  }


  const
    getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
      const table = { data: [] as Org[], success: true, total: 0 };
      setExpandedRowKeys([])
      if (props.appId) {
        const data = await getAppOrgList(props.appId, params, filter, sort)
        if (data?.totalCount) {
          table.data = data.edges.map(item => item.node)
          table.total = data.totalCount
        }
        setAllList(table.data)
      } else {
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
        }
        setAllList(list)
      }
      setDataSource(table.data)
      return table
    },
    onDelApp = (record: Org) => {
      Modal.confirm({
        title: t('delete'),
        content: `${t('confirm delete')}：${record.name}?`,
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
          title = `${t('created')}-${info.name}-${t('sublayer')}`
          break;
        case "peer":
          title = `${t('created')}-${info.name}-${t('same level')}`
          break;
        case "editor":
          title = `${t('edit')}-${info.name}`
          break;
        default:
          break;
      }
      setModal({ open: true, title: title, id: info.id, scene: action })
    }

  useImperativeHandle(ref, () => {
    return {
      getSelect: () => {
        return allList.filter(item => selectedRowKeys.includes(item.id))
      },
      reload: (resetPageIndex?: boolean) => {
        proTableRef.current?.reload(resetPageIndex);
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
            search={props.appId ? {
              searchText: `${t('query')}`,
              resetText: `${t('reset')}`,
            } : false}
            toolbar={{
              title: props?.title || (kind === 'org' ? t('organizational branch tree') : t('organizational tree'))
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
              title: kind == 'org' ? t('organizational department management') : t("{{field}} management", { field: t('organization') }),
              style: { background: token.colorBgContainer },
              breadcrumb: {
                items: kind == 'org' ? [
                  { title: t('organization and cooperation'), },
                  { title: t('organizational department management'), },
                ] : [
                  { title: t('System configuration'), },
                  { title: t("{{field}} management", { field: t('organization') }), },
                ],
              },
            }}
          >
            <ProTable
              actionRef={proTableRef}
              rowKey={"id"}
              search={false}
              toolbar={{
                title: kind === 'org' ? t('organizational branch tree') : t('organizational tree'),
                actions: kind == 'org' ? [] : [
                  <Auth authKey={kind === 'root' ? "createRoot" : "createOrganization"}>
                    <Button
                      type="primary" onClick={() => {
                        setModal({ open: true, title: t("create {{field}}", { field: t('organization') }), id: "", scene: "editor" })

                      }}>
                      {t("create {{field}}", { field: t('organization') })}
                    </Button>
                  </Auth>
                ]
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