
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
import { App, getAppInfo } from "@/services/app";
import { AppPolicy, getAppPolicyInfo } from "@/services/app/policy";
import { Org } from "@/services/org";
import { assignOrgAppPolicy, revokeOrgAppPolicy } from "@/services/org/policy";
import ModalOrg from "@/pages/org/components/modalOrg";
import { getAppPolicyAssignedOrgList } from "@/services/app/org";
import { useTranslation } from "react-i18next";
import Auth from "@/components/Auth";


export default () => {
    const { token } = useToken(),
        { t } = useTranslation(),
        [searchParams, setSearchParams] = useSearchParams(),
        [appPolicyInfo, setAppPolicyInfo] = useState<AppPolicy>(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<Org>[] = [
            // 有需要排序配置  sorter: true 
            {
                title: t('name'), dataIndex: 'name', width: 120, search: {
                    transform: (value) => ({ nameContains: value || undefined })
                }
            },
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
                        <Auth authKey="revokeOrganizationAppPolicy">
                            {record.isAllowRevokeAppPolicy ? <a key="del" onClick={() => onDel(record)}>
                                {t('disauthorization')}
                            </a> : ''}
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
                info = searchParams.get('id') == appPolicyInfo?.id ? appPolicyInfo : await getInfo();
            if (info) {
                const result = await getAppPolicyAssignedOrgList(info.id, params, filter, sort, {
                    appPolicyId: info.id
                });
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
                    title: t('disauthorization'),
                    content: `${t('confirm disauthorization')}：${record.name}`,
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
                title: t('apply permission policy authorization'),
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: t('System configuration'), },
                        { title: t("{{field}} management", { field: t('app') }), },
                        { title: t('policy'), },
                        { title: t('apply permission policy authorization'), },
                    ],
                },
                children: <Alert showIcon message={t('After a permission policy is granted to an organization, the organization has the permission of the policy')} />

            }}
        >
            <ProTable
                actionRef={proTableRef}
                rowKey={"id"}
                search={{
                    searchText: `${t('query')}`,
                    resetText: `${t('reset')}`,
                    labelWidth: 'auto',
                }}
                toolbar={{
                    title: <Space>
                        <span>{t('app')}：{appPolicyInfo?.app?.name || "-"}</span>
                        <span>{t('policy')}：{appPolicyInfo?.name || "-"}</span>
                    </Space>,
                    actions: [
                        <Auth authKey="assignOrganizationAppPolicy">
                            <Button type="primary" onClick={() => {
                                setModal({ open: true, title: '' })
                            }} >
                                {t('add {{field}}', { field: t('organizational authorization') })}
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
            <ModalOrg
                x-if={appPolicyInfo}
                open={modal.open}
                title={t('search {{field}}', { field: t('organization') })}
                tableTitle={`${t('app')}：${appPolicyInfo?.app?.name} ${t("{{field}} list", { field: t('authorized organization') })}`}
                appId={appPolicyInfo?.appID}
                onClose={async (selectData) => {
                    const sdata = selectData?.[0];
                    if (sdata && appPolicyInfo) {
                        const result = await assignOrgAppPolicy(sdata.id, appPolicyInfo.id)
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
