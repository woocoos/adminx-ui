import {
    ActionType,
    PageContainer,
    ProColumns,
    ProTable,
    useToken,
} from "@ant-design/pro-components";
import { Button, Space, Dropdown, Modal, message, Alert } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { TableSort, TableParams, TableFilter } from "@/services/graphql";
import { Link, useSearchParams } from "ice";
import { App, getAppInfo } from "@/services/app";
import CreateAppRole from "./components/createRole";
import ModalRolePolicy from "./components/modalRolePolicy";
import { AppRole } from "@/services/app/role";
import { delAppRole, getAppRoleList } from "@/services/app/role";


export default () => {
    const { token } = useToken(),
        [searchParams, setSearchParams] = useSearchParams(),
        appId: string = searchParams.get('id'),
        [appInfo, setAppInfo] = useState<App>(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<AppRole>[] = [
            // 有需要排序配置  sorter: true 
            { title: '名称', dataIndex: 'name', width: 120, },
            { title: '描述', dataIndex: 'comments', width: 120, search: false, },
            {
                title: '自动授权', dataIndex: 'autoGrant', width: 120, search: false, sorter: true,
                render: (text, record) => {
                    return record.autoGrant ? '是' : '否'
                }
            },
            {
                title: '授权后编辑', dataIndex: 'editable', width: 120, search: false, sorter: true,
                render: (text, record) => {
                    return record.editable ? '是' : '否'
                }
            },
            {
                title: '操作', dataIndex: 'actions', fixed: 'right',
                align: 'center', search: false, width: 120,
                render: (text, record) => {
                    return <Space>
                        <a key="editor" onClick={() => {
                            setModal({
                                open: true, title: `编辑:${record.name}`, id: record.id, scene: 'create'
                            })
                        }} >
                            编辑
                        </a>
                        <Link key="sq" to="/">
                            授权
                        </Link>
                        <Dropdown trigger={['click']} menu={{
                            items: [
                                {
                                    key: "addPolicy", label: <a onClick={() => {
                                        setModal({
                                            open: true, title: `添加权限`, id: record.id, roleInfo: record, scene: "addPolicy"
                                        })
                                    }}>添加权限</a>
                                },
                                { key: "delete", label: <a onClick={() => onDel(record)}>删除</a> },
                            ]
                        }} >
                            <a><EllipsisOutlined /></a>
                        </Dropdown>
                    </Space>
                }
            },
        ],
        // 选中处理
        [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]),
        // 弹出层处理
        [modal, setModal] = useState<{
            open: boolean
            title: string
            id: string
            roleInfo?: AppRole
            scene: "create" | "addPolicy"
        }>({
            open: false,
            title: "",
            id: "",
            scene: 'create'
        })


    const
        getApp = async () => {
            if (appId) {
                const result = await getAppInfo(appId)
                if (result?.id) {
                    setAppInfo(result)
                }
            }
        },
        getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
            const table = { data: [] as AppRole[], success: true, total: 0 };
            const result = await getAppRoleList(appId, params, filter, sort);

            if (result) {
                table.data = result
                table.total = result.length
            } else {
                table.total = 0
            }

            return table
        },
        onDel = (record: AppRole) => {
            Modal.confirm({
                title: "删除",
                content: `是否删除：${record.name}`,
                onOk: async (close) => {
                    const result = await delAppRole(record.id)
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
            setModal({ open: false, title: '', id: '', scene: modal.scene })
        }


    useEffect(() => {
        getApp()
    }, [])

    return (
        <PageContainer
            header={{
                title: "应用角色",
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: "系统配置", },
                        { title: "应用管理", },
                        { title: "应用角色", },
                    ],
                },
                children: <Alert showIcon message={
                    <>
                        <div key="1">应用角色是应用权限策略的一组集合，应用授权给租户时，由角色决定租户拥有应用哪些权限</div>
                        <div key="2">自动授权：应用授权给租户时，将自动授权类型的角色全部授权给租户，并将角色授权给该租户的管理者</div>
                        <div key="3">手动授权：在应用授权给租户后，系统管理员可将非自动授权角色，通过xxx功能将角色授权给租户</div>
                    </>
                } />
            }}
        >
            <ProTable
                actionRef={proTableRef}
                rowKey={"id"}
                toolbar={{
                    title: `应用:${appInfo?.name || "-"}`,
                    actions: [
                        <Button key="created" type="primary" onClick={() => {
                            setModal({ open: true, title: '创建角色', id: '', scene: 'create' })
                        }}>
                            创建角色
                        </Button>
                    ]
                }}
                scroll={{ x: 'max-content' }}
                columns={columns}
                request={getRequest}
                rowSelection={{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys) },
                    type: "checkbox"
                }}
            />
            <CreateAppRole
                x-if={modal.scene === 'create'}
                open={modal.open}
                title={modal.title}
                id={modal.id}
                appId={appInfo?.id}
                onClose={onDrawerClose}
            />
            <ModalRolePolicy
                x-if={modal.scene === "addPolicy"}
                open={modal.open}
                title={modal.title}
                appInfo={appInfo}
                roleInfo={modal.roleInfo}
                onClose={onDrawerClose}
            />
        </PageContainer>
    );
};
