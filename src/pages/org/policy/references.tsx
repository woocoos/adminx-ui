import {
    ActionType,
    PageContainer,
    ProColumns,
    ProTable,
    useToken,
} from "@ant-design/pro-components";
import { Button, Space, Dropdown, Modal } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { TableParams, TableSort, TableFilter, List } from "@/services/graphql";
import { Link, useSearchParams } from "ice";
import { EnumPermissionPrincipalKind, EnumPermissionStatus, Permission, delPermssion } from "@/services/permission";
import { getOrgPolicyReferenceList } from "@/services/permission";
import { OrgPolicy, getOrgPolicyInfo } from "@/services/org/policy";

export default () => {
    const { token } = useToken(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        [searchParams, setSearchParams] = useSearchParams(),
        [orgPolicyInfo, setOrgPolicy] = useState<OrgPolicy>(),
        columns: ProColumns<Permission>[] = [
            // 有需要排序配置  sorter: true 
            { title: '名称', dataIndex: 'roleID', width: 120, },
            {
                title: '类型', dataIndex: 'principalKind',
                filters: true,
                search: false,
                width: 100,
                valueEnum: EnumPermissionPrincipalKind,
            },
            {
                title: '状态', dataIndex: 'status', filters: true, search: false, width: 100,
                valueEnum: EnumPermissionStatus,
            },
            {
                title: '操作', dataIndex: 'actions', fixed: 'right',
                align: 'center', search: false, width: 170,
                render: (text, record) => {
                    return <Space>
                        <a onClick={() => {
                            revokeOrg(record)
                        }}>解除授权</a>
                    </Space>
                }
            }
        ]


    const
        getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
            const table = { data: [] as Permission[], success: true, total: 0 },
                orgPolicyId = searchParams.get('id');
            if (orgPolicyId) {
                const info = await getOrgPolicyInfo(orgPolicyId)
                if (info?.id) {
                    setOrgPolicy(info)
                    const result = await getOrgPolicyReferenceList(orgPolicyId, params, filter, sort);
                    if (result) {
                        table.data = result.edges.map(item => item.node)
                        table.total = result.totalCount

                    } else {
                        table.total = 0
                    }
                }
            }
            return table
        },
        revokeOrg = (record: Permission) => {
            Modal.confirm({
                title: "解除授权",
                content: `是否解除授权${EnumPermissionPrincipalKind[record.principalKind].text}：${record.roleID}`,
                onOk: async (close) => {
                    const result = await delPermssion(record.id, record.orgID)
                    if (result) {
                        proTableRef.current?.reload();
                        close();
                    }
                }
            })
        }

    return (
        <>
            <PageContainer
                header={{
                    title: "引用记录",
                    style: { background: token.colorBgContainer },
                    breadcrumb: {
                        items: [
                            { title: "系统配置", },
                            { title: "组织管理", },
                            { title: "权限策略", },
                            { title: "引用记录", },
                        ],
                    },
                }}
            >
                <ProTable
                    actionRef={proTableRef}
                    rowKey={"id"}
                    toolbar={{
                        title: `权限策略：${orgPolicyInfo?.name || '-'}`,
                    }}
                    scroll={{ x: 'max-content' }}
                    columns={columns}
                    request={getRequest}
                    pagination={{ showSizeChanger: true }}
                />
            </PageContainer >
        </>
    );
};

