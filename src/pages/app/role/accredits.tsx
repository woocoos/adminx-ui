
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
import { Link, useSearchParams } from "@ice/runtime";
import { Org } from "@/services/org";
import ModalOrg from "@/pages/org/components/modalOrg";
import { getAppPolicyAssignedOrgList, getAppRoleAssignedOrgList } from "@/services/app/org";
import { AppRole, getAppRoleInfo } from "@/services/app/role";
import { assignOrgAppRole, revokeOrgAppRole } from "@/services/org/role";
import { useTranslation } from "react-i18next";


export default () => {
    const { token } = useToken(),
        { t } = useTranslation(),
        [searchParams, setSearchParams] = useSearchParams(),
        [appRoleInfo, setAppPolicyInfo] = useState<AppRole>(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<Org>[] = [
            // 有需要排序配置  sorter: true 
            { title: t('name'), dataIndex: 'name', width: 120, },
            { title: t('introduction'), dataIndex: 'profile', width: 120, search: false },
            {
                title: t('manage user'), dataIndex: 'owner', width: 120, search: false,
                render: (text, record) => {
                    return record.owner?.displayName
                }
            },
            {
                title: t('operation'), dataIndex: 'actions', fixed: 'right',
                align: 'center', search: false, width: 110,
                render: (text, record) => {
                    return <Space>
                        <a key="del" onClick={() => onDel(record)}>
                            {t('disauthorization')}
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
                if (params.name) {
                    params.nameContains = params.name
                }
                delete params.name
                const result = await getAppRoleAssignedOrgList(info.id, params, filter, sort);
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
                    title: t('disauthorization'),
                    content: `${t('confirm disauthorization')}：${record.name}?`,
                    onOk: async (close) => {
                        const result = await revokeOrgAppRole(record.id, appRoleInfo.id)
                        if (result) {
                            proTableRef.current?.reload();
                            message.success(t('submit success'))
                            close();
                        }
                    }
                })
            }
        }

    return (
        <PageContainer
            header={{
                title: t("Application role authorization"),
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: t('System configuration'), },
                        { title: t("{{field}} management", { field: t('app') }), },
                        { title: t('policy'), },
                        { title: t("Application role authorization"), },
                    ],
                },
                children: <Alert showIcon message={t("If a role is authorized to an organization, the organization has the application rights of the role")} />

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
                    title: <Space>
                        <span>{t('app')}：{appRoleInfo?.app?.name || "-"}</span>
                        <span>{t('role')}：{appRoleInfo?.name || "-"}</span>
                    </Space>,
                    actions: [
                        <Button type="primary" onClick={() => {
                            setModal({ open: true, title: '' })
                        }} >
                            {t('add {{field}}', { field: t('organizational authorization') })}
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
                title={t('search {{field}}', { field: t('organization') })}
                tableTitle={`${t('app')}：${appRoleInfo?.app?.name} ${t("{{field}} list", { field: t('authorized organization') })}`}
                appId={appRoleInfo?.appID}
                onClose={async (selectData) => {
                    const sdata = selectData?.[0];
                    if (sdata && appRoleInfo) {
                        const result = await assignOrgAppRole(sdata.id, appRoleInfo.id)
                        if (result) {
                            proTableRef.current?.reload();
                            message.success(t('submit success'))
                        }
                    }
                    setModal({ open: false, title: '' })
                }}
            />
        </PageContainer>
    );
};
