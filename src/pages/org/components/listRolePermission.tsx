
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
import DrawerRolePolicy from "./drawerRolePolicy";
import { OrgRole } from "@/services/org/role";
import { useTranslation } from "react-i18next";


export default (props: {
    orgRoleInfo: OrgRole
    readonly?: boolean
}) => {
    const { token } = useToken(),
        { t } = useTranslation(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<Permission>[] = [
            // 有需要排序配置  sorter: true 
            {
                title: t('name'), dataIndex: 'name', width: 120,
                render: (text, record) => {
                    return record.orgPolicy?.name
                }
            },
            {
                title: t('description'), dataIndex: 'comments', width: 120,
                render: (text, record) => {
                    return record.orgPolicy?.comments
                }
            },
            {
                title: t('policy type'), dataIndex: 'type', width: 120,
                renderFormItem(schema, config, form) {
                    return <Select allowClear options={[
                        { label: t('System strategy'), value: 'sys' },
                        { label: t('Custom policy'), value: 'cust' },
                    ]} onChange={(value) => {
                        form.setFieldValue("type", value)
                    }} />
                },
                render: (text, record) => {
                    return record.orgPolicy?.appPolicyID ? t('System strategy') : t('Custom policy')
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
    if (!props.readonly) {
        columns.push({
            title: t('operation'), dataIndex: 'actions', fixed: 'right',
            align: 'center', search: false, width: 110,
            render: (text, record) => {
                return <Space>
                    <a key="del" onClick={() => onDel(record)}>
                        {t('disauthorization')}
                    </a>
                </Space>
            }
        })
    }

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
                title: t('disauthorization'),
                content: `${t('confirm disauthorization')}：${record.orgPolicy?.name}?`,
                onOk: async (close) => {
                    const result = await delPermssion(record.id, props.orgRoleInfo.orgID)
                    if (result) {
                        proTableRef.current?.reload();
                        message.success(t('submit success'))
                        close();
                    }
                }
            })
        }

    return (
        <>
            <ProTable
                className="innerTable"
                actionRef={proTableRef}
                rowKey={"id"}
                search={{
                    searchText: `${t('query')}`,
                    resetText: `${t('reset')}`,
                }}
                toolbar={{
                    title: t("{{field}} list", { field: t('policy') }),
                    actions: props.readonly ? [] : [
                        <Button type="primary" onClick={() => {
                            setModal({ open: true, title: '' })
                        }} >
                            {t("add {{field}}", { field: t('authorization') })}
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
            <DrawerRolePolicy
                orgId={props.orgRoleInfo.orgID}
                orgRoleInfo={props.orgRoleInfo}
                open={modal.open}
                title={`${t("add {{field}}", { field: t('permission') })}`}
                onClose={(isSuccess) => {
                    if (isSuccess) {
                        proTableRef.current?.reload();
                    }
                    setModal({ open: false, title: '' })
                }} />
        </>
    );
};
