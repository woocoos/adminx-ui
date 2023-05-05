import {
    ActionType,
    PageContainer,
    ProColumns,
    ProTable,
    useToken,
} from "@ant-design/pro-components";
import { Button, Space, Dropdown, Modal, message } from "antd";
import { MutableRefObject, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { TableSort, TableParams, TableFilter } from "@/services/graphql";
import { Link, useSearchParams } from "ice";
import { App, getAppInfo } from "@/services/app";
import CreateAppAction from "./components/createAction";
import { AppAction, EnumAppActionKind, EnumAppActionMethod, delAppAction, getAppActionList } from "@/services/app/action";
import { useTranslation } from "react-i18next";

export type AppActionListRef = {
    getSelect: () => AppAction[]
    reload: (resetPageIndex?: boolean) => void
}

const AppActionList = (props: {
    appId?: string
    title?: string
    isMultiple?: boolean
    scene?: "modal"
    ref?: MutableRefObject<AppActionListRef>
}, ref: MutableRefObject<AppActionListRef>) => {
    const { token } = useToken(),
        { t } = useTranslation(),
        [searchParams, setSearchParams] = useSearchParams(),
        appId = props?.appId || searchParams.get('id'),
        [appInfo, setAppInfo] = useState<App>(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<AppAction>[] = [
            // 有需要排序配置  sorter: true 
            { title: t('name'), dataIndex: 'name', width: 120, },
            { title: t('type'), dataIndex: 'kind', width: 120, valueEnum: EnumAppActionKind },
            { title: t('method'), dataIndex: 'method', width: 120, valueEnum: EnumAppActionMethod },
            { title: t('remarks'), dataIndex: 'comments', width: 120, search: false, },
        ],
        [dataSource, setDataSource] = useState<AppAction[]>([]),
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

    if (props?.scene !== 'modal') {
        columns.push(
            {
                title: t('operation'), dataIndex: 'actions', fixed: 'right',
                align: 'center', search: false, width: 80,
                render: (text, record) => {
                    return <Space>
                        <a key="editor" onClick={() => {
                            setModal({
                                open: true, title: `${t('edit')}:${record.name}`, id: record.id
                            })
                        }} >
                            {t('edit')}
                        </a>
                        <a key="del" onClick={() => onDel(record)}>
                            {t('delete')}
                        </a>
                    </Space>
                }
            },
        )
    }

    const
        getApp = async () => {
            let info: App | null = null
            if (appId) {
                info = await getAppInfo(appId)
                if (info?.id) {
                    setAppInfo(info)
                }
            }
            return info
        },
        getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
            const table = { data: [] as AppAction[], success: true, total: 0 },
                info = appInfo?.id === appId ? appInfo : await getApp();
            if (info) {
                if (params.name) {
                    params.nameContains = params.name
                }
                delete params.name
                const result = await getAppActionList(info.id, params, filter, sort);
                if (result) {
                    table.data = result.edges.map(item => item.node)
                    table.total = result.totalCount
                }
            }
            setSelectedRowKeys([])
            setDataSource(table.data)
            return table
        },
        onDel = (record: AppAction) => {
            Modal.confirm({
                title: t('delete'),
                content: `${t('confirm delete')}：${record.name}?`,
                onOk: async (close) => {
                    const result = await delAppAction(record.id)
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
            setModal({ open: false, title: '', id: '', })
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


    return <>
        {
            props?.scene == 'modal' ? (
                <ProTable
                    actionRef={proTableRef}
                    rowKey={"id"}
                    search={{
                        searchText: `${t('query')}`,
                        resetText: `${t('reset')}`,
                    }}
                    toolbar={{
                        title: props?.title || `${t('app')}:${appInfo?.name || "-"}`
                    }}
                    scroll={{ x: 'max-content', y: 300 }}
                    columns={columns}
                    request={getRequest}
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys) },
                        type: props.isMultiple ? "checkbox" : "radio"
                    }}
                />
            ) : (
                <PageContainer
                    header={{
                        title: t('Application permission'),
                        style: { background: token.colorBgContainer },
                        breadcrumb: {
                            items: [
                                { title: t('System configuration'), },
                                { title: t("{{field}} management", { field: t('app') }), },
                                { title: t('Application permission'), },
                            ],
                        },

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
                            title: `${t('app')}:${appInfo?.name || "-"}`,
                            actions: [
                                <Button key="import" onClick={
                                    () => {
                                        alert('还未实现')
                                    }
                                }>
                                    {t('synchronization permission')}
                                </Button >,
                                <Button key="created" type="primary" onClick={() => {
                                    setModal({ open: true, title: t("create {{field}}", { field: t('permission') }), id: '', })
                                }}>
                                    {t("create {{field}}", { field: t('permission') })}
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
                    <CreateAppAction
                        open={modal.open}
                        title={modal.title}
                        id={modal.id}
                        appId={appInfo?.id}
                        onClose={onDrawerClose}
                    />
                </PageContainer >
            )
        }
    </>;
};


export default forwardRef(AppActionList)