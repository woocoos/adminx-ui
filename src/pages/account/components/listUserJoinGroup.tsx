
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
import { useTranslation } from "react-i18next";
import store from "@/store";
import { User } from "@/services/user";
import { OrgRole, getUserJoinGroupList, revokeOrgRoleUser } from "@/services/org/role";
import DrawerRole from "@/pages/org/components/drawerRole";
import Auth from "@/components/Auth";


export default (props: {
    userInfo: User
}) => {
    const { t } = useTranslation(),
        [basisState] = store.useModel("basis"),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<OrgRole>[] = [
            // 有需要排序配置  sorter: true 
            {
                title: t('name'), dataIndex: 'name', width: 120, search: {
                    transform: (value) => ({ nameContains: value || undefined })
                }
            },
            {
                title: t('description'), dataIndex: 'comments', width: 120, search: false,
            },
            {
                title: t('created at'), dataIndex: 'type', width: 120, valueType: "dateTime"
            },
            {
                title: t('operation'), dataIndex: 'actions', fixed: 'right',
                align: 'center', search: false, width: 110,
                render: (text, record) => {
                    return <Space>
                        <Auth authKey="revokeRoleUser">
                            <a key="del" onClick={() => onDel(record)}>
                                {t('disauthorization')}
                            </a>
                        </Auth>
                    </Space>
                }
            }

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
            const table = { data: [] as OrgRole[], success: true, total: 0 };
            const result = await getUserJoinGroupList(props.userInfo.id, params, filter, sort);
            if (result?.totalCount) {
                table.data = result.edges.map(item => item.node)
                table.total = result.totalCount
            }
            setSelectedRowKeys([])
            return table
        },
        onDel = (record: OrgRole) => {
            Modal.confirm({
                title: t('disauthorization'),
                content: `${t('confirm disauthorization')}：${record.name}?`,
                onOk: async (close) => {
                    const result = await revokeOrgRoleUser(record.id, props.userInfo.id)
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
                    labelWidth: 'auto',
                }}
                toolbar={{
                    title: t("{{field}} list", { field: t('user group') }),
                    actions: [
                        <Auth authKey="assignRoleUser">
                            <Button type="primary" onClick={() => {
                                setModal({ open: true, title: '' })
                            }} >
                                {t("add {{field}}", { field: t('user group') })}
                            </Button>
                        </Auth>
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
            {modal.open ? <DrawerRole
                title={`${t("add {{field}}", { field: t('user group') })}`}
                open={modal.open}
                orgId={basisState.tenantId}
                kind={"group"}
                userInfo={props.userInfo}
                onClose={(isSuccess) => {
                    if (isSuccess) {
                        proTableRef.current?.reload();
                    }
                    setModal({ open: false, title: '' })
                }}
            /> : ''}
        </>
    );
};
