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
import { Link, useSearchParams } from "ice";
import { App, getAppInfo } from "@/services/app";
import { AppPolicy, EnumAppPolicyStatus, delAppPolicy, getAppPolicyList } from "@/services/app/policy";


export default () => {
    const { token } = useToken(),
        [searchParams, setSearchParams] = useSearchParams(),
        [appInfo, setAppInfo] = useState<App>(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<AppPolicy>[] = [
            // 有需要排序配置  sorter: true 
            { title: '名称', dataIndex: 'name', width: 120, },
            { title: '版本', dataIndex: 'version', width: 120, },
            {
                title: '自动授权', dataIndex: 'autoGrant', width: 120, search: false, sorter: true,
                render: (text, record) => {
                    return record.autoGrant ? '是' : '否'
                }
            },
            { title: '状态', dataIndex: 'status', width: 120, valueEnum: EnumAppPolicyStatus },
            { title: '描述', dataIndex: 'comments', width: 120, search: false, },
            {
                title: '操作', dataIndex: 'actions', fixed: 'right',
                align: 'center', search: false, width: 110,
                render: (text, record) => {
                    return <Space>
                        <Link key="editor" to={`/app/policy/viewer?id=${record.id}`} >
                            编辑
                        </Link>
                        <Link key="org" to={`/app/policy/accredits?id=${record.id}`} >
                            授权
                        </Link>
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
            const table = { data: [] as AppPolicy[], success: true, total: 0 },
                info = await getApp();
            if (info) {
                const result = await getAppPolicyList(info.id, params, filter, sort);

                if (result) {
                    table.data = result
                    table.total = result.length
                } else {
                    table.total = 0
                }
            }

            return table
        },
        onDel = (record: AppPolicy) => {
            Modal.confirm({
                title: "删除",
                content: `是否删除：${record.name}`,
                onOk: async (close) => {
                    const result = await delAppPolicy(record.id)
                    if (result) {
                        proTableRef.current?.reload();
                        close();
                    }
                }
            })
        }

    return (
        <PageContainer
            header={{
                title: "权限策略",
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: "系统配置", },
                        { title: "应用管理", },
                        { title: "权限策略", },
                    ],
                },
                children: <Alert showIcon message={
                    <>
                        <div key="1">权限策略相当于一组权限集，目前支持两种类型的权限策略</div>
                        <div key="2">系统策略：统一由系统创建，您只能使用而不能删除，系统策略的版本更新由系统维护</div>
                        <div key="3">自定义策略：您可以自主创建、更新和删除，自定义策略的版本更新由您自己维护</div>
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
                        <Button key="created" type="primary">
                            <Link to={`/app/policy/viewer?appId=${appInfo?.id || ''}`}>创建权限策略</Link>
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
        </PageContainer>
    );
};
