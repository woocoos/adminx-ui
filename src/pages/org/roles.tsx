import {
    ActionType,
    PageContainer,
    ProColumns,
    ProTable,
    useToken,
} from "@ant-design/pro-components";
import { Button, Space, Dropdown, Modal, Alert } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { forwardRef, useRef, useState } from "react";
import { TableSort, TableParams, TableFilter } from "@/services/graphql";
import { Link, useSearchParams } from "ice";
import CreateOrgRole from "./components/createRole";
import { formatTreeData } from "@/util";
import { TreeEditorAction } from "@/util/type";
import { OrgRole, OrgRoleKind, delOrgRole, getOrgGroupList, getOrgRoleList } from "@/services/org/role";
import store from "@/store";

const OrgRoleList = (props: {
    kind?: OrgRoleKind,
    orgId?: string
}) => {

    const { token } = useToken(),
        [basisState] = store.useModel("basis"),
        [searchParams, setSearchParams] = useSearchParams(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        kind: OrgRoleKind = props.kind || 'role',
        orgId: string = props.orgId || searchParams.get('id') || basisState.tenantId,
        columns: ProColumns<OrgRole>[] = [
            // 有需要排序配置  sorter: true 
            { title: '名称', dataIndex: 'name', width: 120, },
            { title: '备注', dataIndex: 'comments', width: 120, search: false, },
            {
                title: '操作', dataIndex: 'actions', fixed: 'right',
                align: 'center', search: false, width: 90,
                render: (text, record) => {
                    return <Space>
                        <a>添加用户</a>
                        <a>权限</a>
                        <a onClick={() => {
                            onDel(record)
                        }}>删除</a>
                    </Space>
                }
            },
        ],
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



    const
        getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
            const table = { data: [] as OrgRole[], success: true, total: 0 };
            params.kind = kind
            params.orgID = orgId
            const result = params.kind === 'role' ? await getOrgRoleList(params, filter, sort) : await getOrgGroupList(params, filter, sort)
            if (result) {
                table.data = result.edges.map(item => item.node)
                table.total = result.totalCount
            }
            return table
        },
        onDel = (record: OrgRole) => {
            Modal.confirm({
                title: "删除",
                content: `是否删除：${record.name}`,
                onOk: async (close) => {
                    const result = await delOrgRole(record.id)
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
        }


    return (
        <>

            <PageContainer
                header={{
                    title: kind == 'role' ? "角色" : "用户组",
                    style: { background: token.colorBgContainer },
                    breadcrumb: {
                        items: kind == 'role' ? [
                            { title: "组织协作", },
                            { title: "角色", },
                        ] : [
                            { title: "组织协作", },
                            { title: "用户组", },
                        ],
                    },
                    extra: <>
                        <Button
                            type="primary" onClick={() => {
                                setModal({ open: true, title: `创建${kind == "role" ? '角色' : '用户组'}`, id: "", scene: "editor" })

                            }}>
                            创建{kind == "role" ? '角色' : '用户组'}
                        </Button>
                    </>,
                    children: <Alert showIcon message={kind == 'role' ? <>
                        <div>角色不同于用户组的职责划分，而是向您信任的实体（例如：用户）进行授权的一种安全方法</div>
                    </> : <>
                        <div>通过用户组对职责相同的用户进行分类并授权，可以更加高效地管理用户及其权限</div>
                        <div>对一个用户组进行授权后，用户组内的所有用户会自动继承该用户组的权限</div>
                        <div>如果一个用户被加入到多个用户组，那么该用户将会继承多个用户组的权限</div>
                    </>} />
                }}
            >
                <ProTable
                    actionRef={proTableRef}
                    rowKey={"id"}
                    toolbar={{
                        title: kind == "role" ? '角色列表' : '用户组列表'
                    }}
                    scroll={{ x: 'max-content' }}
                    columns={columns}
                    request={getRequest}
                />
                <CreateOrgRole
                    open={modal.open}
                    title={modal.title}
                    id={modal.id}
                    kind={kind}
                    orgId={orgId}
                    onClose={onDrawerClose} />
            </PageContainer>

        </>
    );
};


export default forwardRef(OrgRoleList) 