import {
    ActionType,
    PageContainer,
    ProColumns,
    ProTable,
    useToken,
} from "@ant-design/pro-components";
import { Button, Space, Dropdown, Modal, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { TableSort, TableParams, TableFilter } from "@/services/graphql";
import { Link, useSearchParams } from "ice";
import { App, getAppInfo } from "@/services/app";
import CreateAppAction from "./components/createAction";
import { AppAction, EnumAppActionKind, EnumAppActionMethod, delAppAction, getAppActionList } from "@/services/app/action";


export default () => {
    const { token } = useToken(),
        [searchParams, setSearchParams] = useSearchParams(),
        appId: string = searchParams.get('id'),
        [appInfo, setAppInfo] = useState<App>(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<AppAction>[] = [
            // 有需要排序配置  sorter: true 
            { title: '名称', dataIndex: 'name', width: 120, },
            { title: '类型', dataIndex: 'kind', width: 120, valueEnum: EnumAppActionKind },
            { title: '方法', dataIndex: 'method', width: 120, valueEnum: EnumAppActionMethod },
            { title: '备注', dataIndex: 'comments', width: 120, search: false, },
            {
                title: '操作', dataIndex: 'actions', fixed: 'right',
                align: 'center', search: false, width: 80,
                render: (text, record) => {
                    return <Space>
                        <a key="editor" onClick={() => {
                            setModal({
                                open: true, title: `编辑:${record.name}`, id: record.id
                            })
                        }} >
                            编辑
                        </a>
                        <a key="del" onClick={() => onDel(record)}>
                            删除
                        </a>
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
        }>({
            open: false,
            title: "",
            id: "",
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
            const table = { data: [] as AppAction[], success: true, total: 0 };
            const result = await getAppActionList(appId, params, filter, sort);

            if (result) {
                table.data = result.edges.map(item => item.node)
                table.total = result.totalCount
            } else {
                table.total = 0
            }

            return table
        },
        onDel = (record: AppAction) => {
            Modal.confirm({
                title: "删除",
                content: `是否删除：${record.name}`,
                onOk: async (close) => {
                    const result = await delAppAction([record.id])
                    if (result) {
                        proTableRef.current?.reload();
                        close();
                    }
                }
            })
        },
        onDels = () => {
            if (selectedRowKeys.length) {
                Modal.confirm({
                    title: "删除",
                    content: `是否删除：${selectedRowKeys.length}条权限`,
                    onOk: async (close) => {
                        const result = await delAppAction(selectedRowKeys)
                        if (result) {
                            proTableRef.current?.reload();
                            close();
                        }
                    }
                })
            } else {
                message.info('未检测到选中数据')
            }
        },
        onDrawerClose = (isSuccess: boolean) => {
            if (isSuccess) {
                proTableRef.current?.reload();
            }
            setModal({ open: false, title: '', id: '', })
        }


    useEffect(() => {
        getApp()
    }, [])

    return (
        <PageContainer
            header={{
                title: "应用权限",
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: "系统配置", },
                        { title: "应用管理", },
                        { title: "应用权限", },
                    ],
                },
                extra: [
                    <Button key="import" onClick={() => {
                        alert('还未实现')
                    }}>同步权限</Button>,
                    <Button key="created" type="primary" onClick={() => {
                        setModal({ open: true, title: '创建权限', id: '', })
                    }}>创建权限</Button>,
                    <Button key="dels" type="primary" danger onClick={onDels}>删除</Button>
                ]
            }}
        >
            <ProTable
                actionRef={proTableRef}
                rowKey={"id"}
                toolbar={{
                    title: `应用:${appInfo?.name || "-"}`
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
            <CreateAppAction
                open={modal.open}
                title={modal.title}
                id={modal.id}
                appId={appInfo?.id}
                onClose={onDrawerClose}
            />
        </PageContainer>
    );
};
