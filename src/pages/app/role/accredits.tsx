
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
import { Org } from "@/services/org";
import ModalOrg from "@/pages/org/components/modalOrg";
import { getAppPolicyAssignedOrgList, getAppRoleAssignedOrgList } from "@/services/app/org";
import { AppRole, getAppRoleInfo } from "@/services/app/role";
import { assignOrgAppRole, revokeOrgAppRole } from "@/services/org/role";


export default () => {
    const { token } = useToken(),
        [searchParams, setSearchParams] = useSearchParams(),
        [appRoleInfo, setAppPolicyInfo] = useState<AppRole>(),
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
            let info: AppRole | null = null, appPolicyId = searchParams.get('id');
            if (appPolicyId) {
                info = await getAppRoleInfo(appPolicyId, ['app'])
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
                const result = await getAppRoleAssignedOrgList(info.id);
                if (result) {
                    table.data = result
                    table.total = result.length
                }
            }

            return table
        },
        onDel = (record: Org) => {
            if (appRoleInfo) {
                Modal.confirm({
                    title: "解除授权",
                    content: `是否解除授权：${record.name}`,
                    onOk: async (close) => {
                        const result = await revokeOrgAppRole(record.id, appRoleInfo.id)
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
                title: "应用角色授权",
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: "系统配置", },
                        { title: "应用管理", },
                        { title: "权限策略", },
                        { title: "应用角色授权", },
                    ],
                },
                children: <Alert showIcon message="角色授权给组织，组织就拥有了对应角色的应用权限" />

            }}
        >
            <ProTable
                actionRef={proTableRef}
                rowKey={"id"}
                toolbar={{
                    title: <Space>
                        <span>应用：{appRoleInfo?.app?.name || "-"}</span>
                        <span>角色：{appRoleInfo?.name || "-"}</span>
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
                x-if={appRoleInfo}
                open={modal.open}
                title="组织选择"
                tableTitle={`应用：${appRoleInfo?.app?.name} 的授权组织列表`}
                appId={appRoleInfo?.appID}
                onClose={async (selectData) => {
                    const sdata = selectData?.[0];
                    if (sdata && appRoleInfo) {
                        const result = await assignOrgAppRole(sdata.id, appRoleInfo.id)
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
