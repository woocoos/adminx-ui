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
import { App, getAppInfo } from "@/services/app";
import { AppPolicy, EnumAppPolicyStatus, delAppPolicy, getAppPolicyList } from "@/services/app/policy";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "@ice/runtime";
import Auth from "@/components/Auth";
import KeepAlive from 'react-activation'


const PageAppPolicys = (props: {
    appId?: string
}) => {
    const { token } = useToken(),
        { t } = useTranslation(),
        [appInfo, setAppInfo] = useState<App>(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<AppPolicy>[] = [
            // 有需要排序配置  sorter: true 
            { title: t('name'), dataIndex: 'name', width: 120, },
            {
                title: t('automatic authorization'), dataIndex: 'autoGrant', width: 120, search: false,
                render: (text, record) => {
                    return record.autoGrant ? t('yes') : t('no')
                }
            },
            { title: t('status'), dataIndex: 'status', width: 120, valueEnum: EnumAppPolicyStatus },
            { title: t('description'), dataIndex: 'comments', width: 120, search: false, },
            {
                title: t('operation'), dataIndex: 'actions', fixed: 'right',
                align: 'center', search: false, width: 110,
                render: (text, record) => {
                    return <Space>
                        <Auth authKey="updateAppPolicy">
                            <Link key="editor" to={`/app/policy/viewer?id=${record.id}`} >
                                {t('edit')}
                            </Link>
                        </Auth>
                        <Link key="org" to={`/app/policy/accredits?id=${record.id}`} >
                            {t('authorization')}
                        </Link>
                        <Auth authKey="deleteAppPolicy">
                            <a key="del" onClick={() => onDel(record)}>
                                {t('delete')}
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
            id: string
        }>({
            open: false,
            title: "",
            id: "",
        })


    const
        getApp = async () => {
            let info: App | null = null;
            if (props.appId) {
                info = await getAppInfo(props.appId)
                if (info?.id) {
                    setAppInfo(info)
                }
            }
            return info
        },
        getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
            const table = { data: [] as AppPolicy[], success: true, total: 0 },
                info = props.appId == appInfo?.id ? appInfo : await getApp();
            if (info) {
                const result = await getAppPolicyList(info.id, params, filter, sort);
                if (result) {
                    // 前端过滤
                    table.data = result.filter(item => {
                        let isTrue = true;
                        if (params.name) {
                            isTrue = item.name.indexOf(params.name) > -1
                        }
                        if (isTrue && params.status) {
                            isTrue = item.status === params.status
                        }
                        return isTrue
                    })
                    table.total = table.data.length
                }
            }

            return table
        },
        onDel = (record: AppPolicy) => {
            Modal.confirm({
                title: t('delete'),
                content: `${t('confirm delete')}：${record.name}`,
                onOk: async (close) => {
                    const result = await delAppPolicy(record.id)
                    if (result) {
                        proTableRef.current?.reload();
                        close();
                    }
                }
            })
        }

    return (
        <PageContainer
            header={{
                title: t('policy'),
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: t('System configuration'), },
                        { title: t("{{field}} management", { field: t('app') }), },
                        { title: t('policy'), },
                    ],
                },
                children: <Alert showIcon message={
                    <>
                        <div key="1">{t('A permission policy is a set of permission. Currently, two types of permission policies are supported')}</div>
                        <div key="2">{t("System strategy")}：{t('The unified system is created by the system. You can only use it but cannot delete it. The system maintains the update of system policies')}</div>
                        <div key="3">{t('Custom policy')}：{t('You can create, update, and delete customized policies. You can maintain the update of customized policies')}</div>
                    </>
                } />

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
                    title: `${t('app')}:${appInfo?.name || "-"}`,
                    actions: [
                        <Auth authKey="createAppPolicy">
                            <Button key="created" type="primary">
                                <Link to={`/app/policy/viewer?appId=${appInfo?.id || ''}`}>
                                    {t("create {{field}}", { field: t('policy') })}
                                </Link>
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
        </PageContainer>
    );
};


export default () => {
    const [searchParams] = useSearchParams(),
        appId = searchParams.get('id') || ''

    return <KeepAlive cacheKey="appPolicys" id={`appId${appId || 0}`}>
        <PageAppPolicys appId={appId} />
    </KeepAlive>
}