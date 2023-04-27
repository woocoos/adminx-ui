
import {
    ActionType,
    PageContainer,
    ProColumns,
    ProTable,
    useToken,
} from "@ant-design/pro-components";
import { Button, Space, Dropdown, Modal, message, Alert, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { TableSort, TableParams, TableFilter } from "@/services/graphql";
import { Permission, delPermssion, getOrgPermissionList } from "@/services/permission";
import ModalRolePolicy from "./modalRolePolicy";
import { OrgRole } from "@/services/org/role";


export default (props: {
    orgRoleInfo: OrgRole
}) => {
    const { token } = useToken(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<Permission>[] = [
            // 有需要排序配置  sorter: true 
            {
                title: '名称', dataIndex: 'name', width: 120,
                render: (text, record) => {
                    return record.orgPolicy?.name
                }
            },
            {
                title: '描述', dataIndex: 'comments', width: 120,
                render: (text, record) => {
                    return record.orgPolicy?.comments
                }
            },
            {
                title: '策略类型', dataIndex: 'type', width: 120,
                renderFormItem(schema, config, form) {
                    return <Select allowClear options={[
                        { label: '系统策略', value: 'sys' },
                        { label: '自定义策略', value: 'cust' },
                    ]} onChange={(value) => {
                        form.setFieldValue("type", value)
                    }} />
                },
                render: (text, record) => {
                    return record.orgPolicy?.appPolicyID ? '系统策略' : '自定义策略'
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
        getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
            const table = { data: [] as Permission[], success: true, total: 0 };
            params.principalKind = "role"
            params.roleID = props.orgRoleInfo.id
            if (params.name || params.comments || params.type) {
                params.hasOrgPolicyWith = {
                    nameContains: params.name || null,
                    commentsContains: params.comments || null,
                    appPolicyIDNotNil: params.type === 'sys' ? true : undefined,
                    appPolicyIDIsNil: params.type === 'cust' ? true : undefined
                }
            }
            delete params.name
            delete params.comments
            delete params.type
            const result = await getOrgPermissionList(props.orgRoleInfo.orgID, params, filter, sort);
            if (result?.totalCount) {
                table.data = result.edges.map(item => item.node)
                table.total = result.totalCount
            }

            return table
        },
        onDel = (record: Permission) => {
            Modal.confirm({
                title: "解除授权",
                content: `是否解除授权：${record.orgPolicy?.name}`,
                onOk: async (close) => {
                    const result = await delPermssion(record.id, props.orgRoleInfo.orgID)
                    if (result) {
                        proTableRef.current?.reload();
                        close();
                    }
                }
            })
        }

    return (
        <>
            <ProTable
                actionRef={proTableRef}
                rowKey={"id"}
                toolbar={{
                    title: "权限策略列表",
                    actions: [
                        <Button type="primary" onClick={() => {
                            setModal({ open: true, title: '' })
                        }} >
                            增加授权
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
            <ModalRolePolicy
                orgRoleInfo={props.orgRoleInfo}
                open={modal.open}
                title="添加权限"
                onClose={(isSuccess) => {
                    if (isSuccess) {
                        proTableRef.current?.reload();
                    }
                    setModal({ open: false, title: '' })
                }} />
        </>
    );
};
