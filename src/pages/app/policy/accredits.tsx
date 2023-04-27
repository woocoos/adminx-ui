
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
import { AppPolicy, getAppPolicyInfo } from "@/services/app/policy";
import { Org } from "@/services/org";
import { assignOrgAppPolicy, revokeOrgAppPolicy } from "@/services/org/policy";
import ModalOrg from "@/pages/org/components/modalOrg";
import { getAppPolicyAssignedOrgList } from "@/services/app/org";


export default () => {
    const { token } = useToken(),
        [searchParams, setSearchParams] = useSearchParams(),
        [appPolicyInfo, setAppPolicyInfo] = useState<AppPolicy>(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<Org>[] = [
            // 有需要排序配置  sorter: true 
            { title: '名称', dataIndex: 'name', width: 120, },
            { title: '简介', dataIndex: 'profile', width: 120, },
            {
                title: '管理用户', dataIndex: 'owner', width: 120, search: false,
                render: (text, record) => {
                    return record.owner?.displayName
                }
            },
            {
                title: '操作', dataIndex: 'actions', fixed: 'right',
                align: 'center', search: false, width: 110,
                render: (text, record) => {
                    return <Space>
                        <a key="del" onClick={() => onDel(record)}>
                            解除授权
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
        }>({
            open: false,
            title: "",
        })


    const
        getInfo = async () => {
            let info: AppPolicy | null = null, appPolicyId = searchParams.get('id');
            if (appPolicyId) {
                info = await getAppPolicyInfo(appPolicyId, ['app'])
                if (info?.id) {
                    setAppPolicyInfo(info)
                }
            }
            return info
        },
        getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
            const table = { data: [] as Org[], success: true, total: 0 },
                info = await getInfo();
            if (info) {
                const result = await getAppPolicyAssignedOrgList(info.id);
                if (result) {
                    table.data = result
                    table.total = result.length
                }
            }

            return table
        },
        onDel = (record: Org) => {
            if (appPolicyInfo) {
                Modal.confirm({
                    title: "删除",
                    content: `是否删除：${record.name}`,
                    onOk: async (close) => {
                        const result = await revokeOrgAppPolicy(record.id, appPolicyInfo.id)
                        if (result) {
                            proTableRef.current?.reload();
                            close();
                        }
                    }
                })
            }
        }

    return (
        <PageContainer
            header={{
                title: "应用权限策略授权",
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: "系统配置", },
                        { title: "应用管理", },
                        { title: "权限策略", },
                        { title: "应用权限策略授权", },
                    ],
                },
                children: <Alert showIcon message="权限策略授权给组织，组织就拥有对应权限策略的权限" />

            }}
        >
            <ProTable
                actionRef={proTableRef}
                rowKey={"id"}
                toolbar={{
                    title: <Space>
                        <span>应用：{appPolicyInfo?.app?.name || "-"}</span>
                        <span>权限策略：{appPolicyInfo?.name || "-"}</span>
                    </Space>,
                    actions: [
                        <Button type="primary" onClick={() => {
                            setModal({ open: true, title: '' })
                        }} >
                            增加组织授权
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
            <ModalOrg
                x-if={appPolicyInfo}
                open={modal.open}
                title="组织选择"
                tableTitle={`应用：${appPolicyInfo?.app?.name} 的授权组织列表`}
                appId={appPolicyInfo?.appID}
                onClose={async (selectData) => {
                    const sdata = selectData?.[0];
                    if (sdata && appPolicyInfo) {
                        const result = await assignOrgAppPolicy(sdata.id, appPolicyInfo.id)
                        if (result) {
                            proTableRef.current?.reload();
                            message.success('操作成功')
                        }
                    }
                    setModal({ open: false, title: '' })
                }}
            />
        </PageContainer>
    );
};
