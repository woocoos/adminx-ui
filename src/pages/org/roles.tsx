import {
    ActionType,
    PageContainer,
    ProColumns,
    ProTable,
    useToken,
} from "@ant-design/pro-components";
import { Button, Space, Dropdown, Modal, Alert, message, Select } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { MutableRefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { TableSort, TableParams, TableFilter } from "@/services/graphql";
import { Link, useSearchParams } from "@ice/runtime";
import CreateOrgRole from "./components/createRole";
import { TreeEditorAction } from "@/util/type";
import { OrgRole, OrgRoleKind, delOrgRole, getOrgGroupList, getOrgRoleList } from "@/services/org/role";
import store from "@/store";
import { useTranslation } from "react-i18next";
import DrawerUser from "../account/components/drawerUser";
import DrawerRolePolicy from "./components/drawerRolePolicy";
import DrawerAppRolePolicy from "@/pages/app/components/drawerRolePolicy";
import Auth from "@/components/Auth";
import KeepAlive from "@/components/KeepAlive";

export type OrgRoleListRef = {
    getSelect: () => OrgRole[]
    reload: (resetPageIndex?: boolean) => void
}

const PageOrgRoleList = (props: {
    kind?: OrgRoleKind
    orgId: string
    title?: string
    scene?: "modal"
    isMultiple?: boolean,
    ref?: MutableRefObject<OrgRoleListRef>

}, ref: MutableRefObject<OrgRoleListRef>) => {

    const { t } = useTranslation(),
        { token } = useToken(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        kind: OrgRoleKind = props.kind || 'role',
        columns: ProColumns<OrgRole>[] = [
            // 有需要排序配置  sorter: true 
            {
                title: t('name'), dataIndex: 'name', width: 120, search: {
                    transform: (value) => ({ nameContains: value || undefined })
                }
            },
            { title: t('remarks'), dataIndex: 'comments', width: 120, search: false, },

        ],
        [dataSource, setDataSource] = useState<OrgRole[]>([]),
        [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
        // 弹出层处理
        [modal, setModal] = useState<{
            open: boolean
            title: string
            id: string
            data?: OrgRole
            scene: "editor" | "addUser" | "addPermission" | "addAppPermission"
        }>({
            open: false,
            title: "",
            id: "",
            scene: "editor",
        })

    if (kind === 'role') {
        columns.push({
            title: t('type'), dataIndex: 'actions', fixed: 'right', search: false,
            renderText(text, record) {
                return record.isAppRole ? t("system role") : t('custom role')
            },
        })
    }

    columns.push({
        title: t('operation'), dataIndex: 'actions', fixed: 'right',
        align: 'center', search: false, width: 210,
        render: (text, record) => {
            return <Space>
                {
                    record.isAppRole ? <>
                        <Link to={`/org/${record.kind}/viewer?id=${record.id}`}>
                            {t('view')}
                        </Link>
                        <Auth authKey="assignRoleUser">
                            <a onClick={() => {
                                setModal({ open: true, title: t('add {{field}}', { field: t('member') }), id: '', data: record, scene: "addUser" })
                            }}>
                                {t('add {{field}}', { field: t('member') })}
                            </a>
                        </Auth>
                    </> :
                        <>
                            <Link to={`/org/${record.kind}/viewer?id=${record.id}`}>
                                {t('view')}
                            </Link>
                            <Auth authKey="assignRoleUser">
                                <a onClick={() => {
                                    setModal({ open: true, title: t('add {{field}}', { field: t('member') }), id: '', data: record, scene: "addUser" })
                                }}>
                                    {t('add {{field}}', { field: t('member') })}
                                </a>
                            </Auth>
                            <Auth authKey="grant">
                                <a onClick={() => {
                                    setModal({ open: true, title: t('add {{field}}', { field: t('permission') }), id: '', data: record, scene: "addPermission" })
                                }}>
                                    {t('add {{field}}', { field: t('permission') })}
                                </a>
                            </Auth>
                            <Auth authKey="deleteRole">
                                <a onClick={() => {
                                    onDel(record)
                                }}>
                                    {t('delete')}
                                </a>
                            </Auth>
                        </>
                }

            </Space>
        }
    })


    const
        getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
            const table = { data: [] as OrgRole[], success: true, total: 0 };
            params.kind = kind
            params.orgID = props.orgId
            const result = params.kind === 'role' ? await getOrgRoleList(params, filter, sort) : await getOrgGroupList(params, filter, sort)
            if (result) {
                table.data = result.edges.map(item => item.node)
                table.total = result.totalCount
            }
            setDataSource(table.data)
            setSelectedRowKeys([])
            return table
        },
        onDel = (record: OrgRole) => {
            Modal.confirm({
                title: t('delete'),
                content: `${t('confirm delete')}：${record.name}?`,
                onOk: async (close) => {
                    const result = await delOrgRole(record.id)
                    if (result) {
                        proTableRef.current?.reload();
                        message.success('submit success')
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

    useEffect(() => {
        proTableRef.current?.reload(true);
    }, [props.orgId])

    return (
        <>
            {["modal"].includes(props.scene || '') ?
                <ProTable
                    actionRef={proTableRef}
                    search={{
                        searchText: `${t('query')}`,
                        resetText: `${t('reset')}`,
                        labelWidth: 'auto',
                    }}
                    rowKey={"id"}
                    toolbar={{
                        title: props.title || kind == "role" ? t("{{field}} list", { field: t('role') }) : t("{{field}} list", { field: t('user group') }),
                        actions: [
                            <Button
                                type="primary" onClick={() => {
                                    setModal({ open: true, title: `${kind == "role" ? t("create {{field}}", { field: t('role') }) : t("create {{field}}", { field: t('user group') })}`, id: "", scene: "editor" })
                                }}>
                                {kind == "role" ? t("create {{field}}", { field: t('role') }) : t("create {{field}}", { field: t('user group') })}
                            </Button>
                        ]
                    }}
                    rowSelection={props?.scene === 'modal' ? {
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys) },
                        type: props.isMultiple ? "checkbox" : "radio"
                    } : false}
                    scroll={{ x: 'max-content' }}
                    columns={columns}
                    request={getRequest}
                /> :
                <PageContainer
                    header={{
                        title: kind == 'role' ? t('role') : t('user group'),
                        style: { background: token.colorBgContainer },
                        breadcrumb: {
                            items: kind == 'role' ? [
                                { title: t('organization and cooperation'), },
                                { title: t('role'), },
                            ] : [
                                { title: t('organization and cooperation'), },
                                { title: t('user group'), },
                            ],
                        },
                        children: <Alert showIcon message={kind == 'role' ? <>
                            <div>{t('Roles are not the division of responsibilities of user groups, but a secure way to authorize entities that you trust, such as users')}</div>
                        </> : <>
                            <div>{t('Users and their rights can be managed more efficiently by classifying and authorizing users with the same responsibilities through user groups')}</div>
                            <div>{t('After a user group is authorized, all users in the user group automatically inherit the rights of the user group')}</div>
                            <div>{t('If a user is added to multiple user groups, the user inherits the rights of multiple user groups')}</div>
                        </>} />
                    }}
                >
                    <ProTable
                        actionRef={proTableRef}
                        search={{
                            searchText: `${t('query')}`,
                            resetText: `${t('reset')}`,
                            labelWidth: 'auto',
                        }}
                        rowKey={"id"}
                        toolbar={{
                            title: kind == "role" ? t("{{field}} list", { field: t('role') }) : t("{{field}} list", { field: t('user group') }),
                            actions: [
                                <Auth authKey="createRole">
                                    <Button
                                        type="primary" onClick={() => {
                                            setModal({ open: true, title: `${kind == "role" ? t("create {{field}}", { field: t('role') }) : t("create {{field}}", { field: t('user group') })}`, id: "", scene: "editor" })
                                        }}>
                                        {kind == "role" ? t("create {{field}}", { field: t('role') }) : t("create {{field}}", { field: t('user group') })}
                                    </Button>
                                </Auth>
                            ]
                        }}
                        scroll={{ x: 'max-content' }}
                        columns={columns}
                        request={getRequest}
                    />
                    <CreateOrgRole
                        x-if={modal.scene === 'editor'}
                        open={modal.open}
                        title={modal.title}
                        id={modal.id}
                        kind={kind}
                        orgId={props.orgId}
                        onClose={onDrawerClose}
                    />
                    <DrawerUser
                        x-if={modal.scene === 'addUser' && modal.open}
                        open={modal.open}
                        title={modal.title}
                        orgId={props.orgId}
                        orgRole={modal.data}
                        onClose={(isSuccess) => {
                            if (isSuccess) {
                                proTableRef.current?.reload();
                            }
                            setModal({ open: false, title: modal.title, scene: modal.scene, id: '' });
                        }}
                    />
                    <DrawerRolePolicy
                        x-if={modal.scene === "addPermission" && modal.open}
                        orgId={props.orgId}
                        orgRoleInfo={modal.data}
                        open={modal.open}
                        title={modal.title}
                        onClose={(isSuccess) => {
                            if (isSuccess) {
                                proTableRef.current?.reload();
                            }
                            setModal({ open: false, title: modal.title, scene: modal.scene, id: '' });
                        }}
                    />
                    <DrawerAppRolePolicy
                        x-if={modal.scene === "addAppPermission" && modal.open}
                        open={modal.open}
                        title={modal.title}
                        onClose={(isSuccess) => {
                            if (isSuccess) {
                                proTableRef.current?.reload();
                            }
                            setModal({ open: false, title: modal.title, scene: modal.scene, id: '' });
                        }}
                    />
                </PageContainer>
            }
        </>
    );
};

export const OrgRoleList = forwardRef(PageOrgRoleList)

export default () => {
    const [basisState] = store.useModel("basis"),
        [searchParams, setSearchParams] = useSearchParams(),
        orgId = searchParams.get('id') || basisState.tenantId

    return <KeepAlive>
        <OrgRoleList orgId={orgId} />
    </KeepAlive>
}