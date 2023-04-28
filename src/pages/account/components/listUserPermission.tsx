
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
import { Permission, PermissionPrincipalKind, delPermssion, getOrgPermissionList, getUserPermissionList } from "@/services/permission";
import ModalRolePolicy from "@/pages/org/components/modalRolePolicy";
import { useTranslation } from "react-i18next";
import store from "@/store";
import { User } from "@/services/user";


export default (props: {
    userInfo: User
    principalKind: PermissionPrincipalKind
}) => {
    const { t } = useTranslation(),
        [basisState] = store.useModel("basis"),
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

    if (props.principalKind === 'role') {
        columns.unshift({
            title: t('user group'), dataIndex: 'userGroupName', width: 120,
            render: (text, record) => {
                return record.role?.name
            }
        })
    } else if (props.principalKind === "user") {
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
            params.principalKind = props.principalKind
            if (params.userGroupName) {
                params.hasRoleWith = {
                    nameContains: params.userGroupName || null,
                }
            }
            if (params.name || params.comments || params.type) {
                params.hasOrgPolicyWith = {
                    nameContains: params.name || null,
                    commentsContains: params.comments || null,
                    appPolicyIDNotNil: params.type === 'sys' ? true : undefined,
                    appPolicyIDIsNil: params.type === 'cust' ? true : undefined
                }
            }
            delete params.userGroupName
            delete params.name
            delete params.comments
            delete params.type
            const result = await getUserPermissionList(props.userInfo.id, params, filter, sort);
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
                    const result = await delPermssion(record.id, record.orgID)
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
                actionRef={proTableRef}
                rowKey={"id"}
                search={{
                    searchText: `${t('query')}`,
                    resetText: `${t('reset')}`,
                }}
                toolbar={{
                    title: t("{{field}} list", { field: t('policy') }),
                    actions: props.principalKind === 'user' ? [
                        <Button type="primary" onClick={() => {
                            setModal({ open: true, title: '' })
                        }} >
                            {t("add {{field}}", { field: t('authorization') })}
                        </Button>
                    ] : []
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
                orgId={basisState.tenantId}
                userInfo={props.userInfo}
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
