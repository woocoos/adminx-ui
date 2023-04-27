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
import { Link, useSearchParams } from "ice";
import { Org, getOrgInfo } from "@/services/org";
import { OrgPolicy, delOrgPolicy, getOrgPolicyList } from "@/services/org/policy";
import store from "@/store";


export default () => {
    const { token } = useToken(),
        [basisState] = store.useModel("basis"),
        [searchParams, setSearchParams] = useSearchParams(),
        [orgInfo, setOrgInfo] = useState<Org>(),
        // 表格相关
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<OrgPolicy>[] = [
            // 有需要排序配置  sorter: true 
            { title: '名称', dataIndex: 'name', width: 120, },
            { title: '描述', dataIndex: 'comments', width: 120, search: false, },
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
                render: (text, record) => (<span>{record.appPolicyID ? '系统策略' : '自定义策略'}</span>)
            },
            {
                title: '操作', dataIndex: 'actions', fixed: 'right',
                align: 'center', search: false, width: 110,
                render: (text, record) => {
                    return record.appPolicyID ? <Space>
                        <Link key="editor" to={`/org/policy/references?id=${record.id}`} >
                            引用记录
                        </Link>
                    </Space> : <Space>
                        <Link key="editor" to={`/org/policy/viewer?id=${record.id}`} >
                            编辑
                        </Link>
                        <Link key="reference" to={`/org/policy/references?id=${record.id}`} >
                            引用记录
                        </Link>
                        <a key="del" onClick={() => onDel(record)}>
                            删除
                        </a>
                    </Space>
                }
            },
        ],
        // 选中处理
        [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])


    const
        getOrg = async () => {
            let result: Org | null = null
            const orgId = searchParams.get('id') || basisState.tenantId;
            if (orgId) {
                result = await getOrgInfo(orgId)
                if (result?.id) {
                    setOrgInfo(result)
                }
            }
            return result;
        },
        getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
            const table = { data: [] as OrgPolicy[], success: true, total: 0 }, info = await getOrg();
            if (info?.id) {
                if (params.type) {
                    params.appPolicyIDNotNil = params.type === 'sys' ? true : undefined
                    params.appPolicyIDIsNil = params.type === 'cust' ? true : undefined
                }
                delete params.type
                const result = await getOrgPolicyList(info?.id, params, filter, sort)
                if (result) {
                    table.data = result.edges.map(item => item.node)
                    table.total = result.totalCount
                } else {
                    table.total = 0
                }
            }
            return table
        },
        onDel = (record: OrgPolicy) => {
            Modal.confirm({
                title: "删除",
                content: `是否删除：${record.name}`,
                onOk: async (close) => {
                    const result = await delOrgPolicy(record.id)
                    if (result) {
                        proTableRef.current?.reload();
                        close();
                    }
                }
            })
        }

    useEffect(() => {
        proTableRef.current?.reload(true);
    }, [searchParams])

    return (
        <PageContainer
            header={{
                title: "权限策略",
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: searchParams.get('id') ? [
                        { title: "系统配置", },
                        { title: "组织管理", },
                        { title: "权限策略", },
                    ] : [
                        { title: "组织协作", },
                        { title: "权限策略", },
                    ],
                },
                children: <Alert showIcon message={
                    <>
                        <div key="1">权限策略相当于一组权限集，目前支持两种类型的权限策略</div>
                        <div key="2">系统策略：统一由系统创建，您只能使用而不能删除，系统策略的版本更新由系统维护</div>
                        <div key="3">自定义策略：您可以自主创建、更新和删除，自定义策略的版本更新由您自己维护</div>
                    </>
                } />

            }}
        >
            <ProTable
                actionRef={proTableRef}
                rowKey={"id"}
                toolbar={{
                    title: `组织:${orgInfo?.name || "-"}`,
                    actions: [
                        <Button type="primary">
                            <Link key="editor" to={`/org/policy/viewer?orgId=${orgInfo?.id}`} >
                                自定义策略
                            </Link>
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
        </PageContainer>
    );
};
