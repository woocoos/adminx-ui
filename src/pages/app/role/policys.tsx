
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
import { AppRole, getAppRoleInfo, revokeAppRolePolicy } from "@/services/app/role";
import { assignOrgAppRole, revokeOrgAppRole } from "@/services/org/role";
import { useTranslation } from "react-i18next";
import Auth from "@/components/Auth";
import { AppPolicy } from "@/services/app/policy";
import DrawerRolePolicy from "../components/drawerRolePolicy";


export default () => {
    const { token } = useToken(),
        { t } = useTranslation(),
        [searchParams, setSearchParams] = useSearchParams(),
        [appRoleInfo, setAppRoleInfo] = useState<AppRole>(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<AppPolicy>[] = [
            // 有需要排序配置  sorter: true 
            { title: t('name'), dataIndex: 'name', width: 120, },
            { title: t('description'), dataIndex: 'comments', width: 120, search: false, },
            {
                title: t('operation'), dataIndex: 'actions', fixed: 'right',
                align: 'center', search: false, width: 110,
                render: (text, record) => {
                    return <Space>
                        <Auth authKey="revokeAppRolePolicy">
                            <a key="del" onClick={() => onDel(record)}>
                                {t('remove')}
                            </a>
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
            let info: AppRole | null = null, appRoleId = searchParams.get('id');
            if (appRoleInfo?.id == appRoleId) {
                return appRoleInfo;
            }
            if (appRoleId) {
                info = await getAppRoleInfo(appRoleId, ['app'])
                if (info?.id) {
                    setAppRoleInfo(info)
                }
            }
            return info
        },
        getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
            const table = { data: [] as AppPolicy[], success: true, total: 0 },
                info = await getInfo();
            if (info) {
                const result = await getAppRoleInfo(info.id, ['policies']);
                if (result) {
                    table.data = result.policies?.filter(item => {
                        if (params.name) {
                            return item.name.indexOf(params.name) > -1
                        }
                        return true;
                    }) || []
                    table.total = table.data?.length
                }
            }

            return table
        },
        onDel = (record: AppPolicy) => {
            if (appRoleInfo) {
                Modal.confirm({
                    title: t('remove'),
                    content: `${t('confirm remove')}：${record.name}?`,
                    onOk: async (close) => {
                        const result = await revokeAppRolePolicy(appRoleInfo.appID, appRoleInfo.id, [record.id])
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
                title: t("Application role permissions"),
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: t('System configuration'), },
                        { title: t("{{field}} management", { field: t('app') }), },
                        { title: t('Application role'), },
                        { title: t("Application role permissions"), },
                    ],
                },

            }}
        >
            <ProTable
                actionRef={proTableRef}
                search={{
                    searchText: `${t('query')}`,
                    resetText: `${t('reset')}`,
                    labelWidth: 'auto',
                }}
                rowKey={"id"}
                toolbar={{
                    title: <Space>
                        <span>{t('app')}：{appRoleInfo?.app?.name || "-"}</span>
                        <span>{t('role')}：{appRoleInfo?.name || "-"}</span>
                    </Space>,
                    actions: [
                        <Auth authKey="assignAppRolePolicy">
                            <Button type="primary" onClick={() => {
                                setModal({ open: true, title: t("add {{field}}", { field: t('permission') }) })
                            }} >
                                {t("add {{field}}", { field: t('permission') })}
                            </Button>
                        </Auth>
                    ]
                }}
                scroll={{ x: 'max-content', y: 500 }}
                columns={columns}
                request={getRequest}
                rowSelection={{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys) },
                    type: "checkbox"
                }}
                pagination={false}
            />
            <DrawerRolePolicy
                x-if={modal.open}
                open={modal.open}
                title={modal.title}
                appInfo={appRoleInfo?.app}
                roleInfo={appRoleInfo}
                onClose={(isSuccess) => {
                    if (isSuccess) {
                        proTableRef.current?.reload();
                    }
                    setModal({ open: false, title: '' })
                }}
            />
        </PageContainer>
    );
};