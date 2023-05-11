import {
    ActionType,
    PageContainer,
    ProColumns,
    ProTable,
    useToken,
} from "@ant-design/pro-components";
import { Button, Space, Dropdown, Modal, message, Alert } from "antd";
import { useEffect, useRef, useState } from "react";
import { TableSort, TableParams, TableFilter } from "@/services/graphql";
import { App, getAppInfo } from "@/services/app";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "@ice/runtime";
import { AppRes, getAppResList } from "@/services/app/resource";
import CreateRes from "./components/createRes";
import Auth from "@/components/Auth";


export default () => {
    const { token } = useToken(),
        { t } = useTranslation(),
        [searchParams, setSearchParams] = useSearchParams(),
        [appInfo, setAppInfo] = useState<App>(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<AppRes>[] = [
            // 有需要排序配置  sorter: true 
            { title: t('name'), dataIndex: 'name', width: 120, },
            { title: t('type name'), dataIndex: 'typeName', width: 120, },
            { title: t('expression'), dataIndex: 'arnPattern', width: 120, search: false },
            {
                title: t('operation'), dataIndex: 'actions', fixed: 'right',
                align: 'center', search: false, width: 110,
                render: (text, record) => {
                    return <Space>
                        <Auth authKey="updateAppRes">
                            <a key="edit" onClick={() => {
                                setModal({ open: true, title: t('amend {{field}}', { field: record.name }), id: record.id })
                            }}>
                                {t('edit')}
                            </a>
                        </Auth>
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
            let info: App | null = null, appId = searchParams.get('id');
            if (appId) {
                info = await getAppInfo(appId)
                if (info?.id) {
                    setAppInfo(info)
                }
            }
            return info
        },
        getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
            const table = { data: [] as AppRes[], success: true, total: 0 },
                info = searchParams.get('id') == appInfo?.id ? appInfo : await getApp();
            if (info) {
                if (params.name) {
                    params.nameContains = params.name
                }
                if (params.typeName) {
                    params.typeNameContains = params.typeName
                }
                delete params.name
                delete params.typeName
                const result = await getAppResList(info.id, params, filter, sort);
                if (result) {
                    // 前端过滤
                    table.data = result.edges.map(item => item.node)
                    table.total = result.totalCount
                }
            }

            return table
        },
        onDel = (record: AppRes) => {
            Modal.confirm({
                title: t('delete'),
                content: `${t('confirm delete')}：${record.name}`,
                onOk: async (close) => {
                    // const result = await delAppPolicy(record.id)
                    // if (result) {
                    //     proTableRef.current?.reload();
                    //     close();
                    // }
                }
            })
        }

    return (
        <PageContainer
            header={{
                title: t('Application resource'),
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: t('System configuration'), },
                        { title: t("{{field}} management", { field: t('app') }), },
                        { title: t('Application resource'), },
                    ],
                },
            }}
        >
            <ProTable
                actionRef={proTableRef}
                rowKey={"id"}
                search={{
                    searchText: `${t('query')}`,
                    resetText: `${t('reset')}`,
                }}
                toolbar={{
                    title: `${t('app')}:${appInfo?.name || "-"}`,
                    actions: []
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
            {
                appInfo ?
                    <CreateRes
                        open={modal.open}
                        title={modal.title}
                        id={modal.id}
                        appId={appInfo?.id}
                        onClose={(isSuccess) => {
                            if (isSuccess) {
                                proTableRef.current?.reload();
                            }
                            setModal({ open: false, title: modal.title, id: '' })
                        }}
                    />
                    : ''
            }

        </PageContainer>
    );
};