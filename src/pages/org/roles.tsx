import {
    ActionType,
    PageContainer,
    ProColumns,
    ProTable,
    useToken,
} from "@ant-design/pro-components";
import { Button, Space, Dropdown, Modal, Alert, message } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { MutableRefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { TableSort, TableParams, TableFilter } from "@/services/graphql";
import { Link, useSearchParams } from "ice";
import CreateOrgRole from "./components/createRole";
import { TreeEditorAction } from "@/util/type";
import { OrgRole, OrgRoleKind, delOrgRole, getOrgGroupList, getOrgRoleList } from "@/services/org/role";
import store from "@/store";
import { useTranslation } from "react-i18next";

export type OrgRoleListRef = {
    getSelect: () => OrgRole[]
    reload: (resetPageIndex?: boolean) => void
}

const OrgRoleList = (props: {
    kind?: OrgRoleKind
    orgId?: string
    title?: string
    scene?: "modal"
    isMultiple?: boolean,
    ref?: MutableRefObject<OrgRoleListRef>

}, ref: MutableRefObject<OrgRoleListRef>) => {

    const { t } = useTranslation(),
        { token } = useToken(),
        [basisState] = store.useModel("basis"),
        [searchParams, setSearchParams] = useSearchParams(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        kind: OrgRoleKind = props.kind || 'role',
        orgId: string = props.orgId || searchParams.get('id') || basisState.tenantId,
        columns: ProColumns<OrgRole>[] = [
            // 有需要排序配置  sorter: true 
            { title: t('name'), dataIndex: 'name', width: 120, },
            { title: t('remarks'), dataIndex: 'comments', width: 120, search: false, },
            {
                title: t('operation'), dataIndex: 'actions', fixed: 'right',
                align: 'center', search: false, width: 90,
                render: (text, record) => {
                    return <Space>
                        <Link to={`/org/${record.kind}/viewer?id=${record.id}`}>
                            {t('view')}
                        </Link>
                        <a onClick={() => {
                            onDel(record)
                        }}>
                            {t('delete')}
                        </a>
                    </Space>
                }
            },
        ],
        [dataSource, setDataSource] = useState<OrgRole[]>([]),
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
            setDataSource(table.data)
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
    }, [searchParams])

    return (
        <>
            {["modal",].includes(props?.scene || '') ?
                <ProTable
                    actionRef={proTableRef}
                    search={{
                        searchText: `${t('query')}`,
                        resetText: `${t('reset')}`,
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
                        }}
                        rowKey={"id"}
                        toolbar={{
                            title: kind == "role" ? t("{{field}} list", { field: t('role') }) : t("{{field}} list", { field: t('user group') }),
                            actions: [
                                <Button
                                    type="primary" onClick={() => {
                                        setModal({ open: true, title: `${kind == "role" ? t("create {{field}}", { field: t('role') }) : t("create {{field}}", { field: t('user group') })}`, id: "", scene: "editor" })
                                    }}>
                                    {kind == "role" ? t("create {{field}}", { field: t('role') }) : t("create {{field}}", { field: t('user group') })}
                                </Button>
                            ]
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
            }
        </>
    );
};


export default forwardRef(OrgRoleList) 