import { Col, Drawer, Input, List, Row, Space, Table, Tag, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { CloseOutlined } from "@ant-design/icons";
import { ActionType, DrawerForm, ProColumns, ProTable } from '@ant-design/pro-components';
import { OrgPolicy, getOrgPolicyList } from '@/services/org/policy';
import { OrgRole } from '@/services/org/role';
import { Permission, createPermission } from '@/services/permission';
import { useTranslation } from 'react-i18next';
import { User } from '@/services/user';
import { TableFilter, TableParams, TableSort } from '@/services/graphql';
import { setLeavePromptWhen } from '@/components/LeavePrompt';

export default (props: {
    open: boolean
    title?: string
    orgId: string,
    userInfo?: User
    orgRoleInfo?: OrgRole
    onClose: (isSuccess?: boolean) => void
}) => {

    const
        { t } = useTranslation(),
        proTableRef = useRef<ActionType>(),
        columns: ProColumns<OrgPolicy>[] = [
            { title: t('policy'), dataIndex: 'name' },
            { title: t('description'), dataIndex: 'comments' },
        ],
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [keyword, setKeyword] = useState<string>(),
        [selectedDatas, setSelectedDatas] = useState<OrgPolicy[]>([]),
        [dataSource, setdataSource] = useState<OrgPolicy[]>([])

    setLeavePromptWhen(saveDisabled)

    const
        getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
            const table = { data: [] as OrgPolicy[], success: true, total: 0 };
            if (keyword) {
                params.nameContains = keyword
            }
            const result = await getOrgPolicyList(props.orgId, params, filter, sort, {
                roleId: props.orgRoleInfo?.id,
                userId: props.userInfo?.id
            })
            if (result?.totalCount) {
                table.data = result.edges.map(item => item.node)
                table.total = result.totalCount
            }
            setdataSource(table.data)
            return table
        },
        onOpenChange = (open: boolean) => {
            if (!open) {
                props.onClose?.()
            }
        },
        onFinish = async () => {
            setSaveLoading(true)
            let isTree = false, result: Permission | null = null;
            for (let i in selectedDatas) {
                const item = selectedDatas[i]
                if (props.orgRoleInfo) {
                    result = await createPermission({
                        principalKind: "role",
                        orgID: props.orgId,
                        orgPolicyID: item.id,
                        roleID: props.orgRoleInfo.id,
                    })
                } else if (props.userInfo) {
                    result = await createPermission({
                        principalKind: "user",
                        orgID: props.orgId,
                        orgPolicyID: item.id,
                        userID: props.userInfo.id,
                    })
                }

                if (result?.id) {
                    isTree = true
                }
            }
            if (isTree) {
                message.success(t('submit success'))
                props.onClose?.(true)
            }
            setSaveLoading(false)
            return false;
        }


    return (
        <DrawerForm
            title={props.title}
            open={props.open}
            submitter={{
                searchConfig: {
                    submitText: t('submit'),
                    resetText: t('cancel')
                },
                submitButtonProps: {
                    loading: saveLoading,
                    disabled: saveDisabled,
                }
            }}
            drawerProps={{
                width: 800,
                destroyOnClose: true,
            }}
            onFinish={onFinish}
            onOpenChange={onOpenChange}
        >
            <Space direction="vertical">
                {
                    props.orgRoleInfo ? <>
                        <div>{props.orgRoleInfo.kind === 'role' ? t('role') : t('user group')}</div>
                        <div>
                            <Input value={props.orgRoleInfo.name} />
                        </div>
                    </> : ''
                }
                {
                    props.userInfo ? <>
                        <div>{t('user')}</div>
                        <div>
                            <Input value={props.userInfo.displayName} />
                        </div>
                    </> : ''
                }
                <div>
                    {t('policy')}
                </div>
                <Row gutter={20}>
                    <Col span="16">
                        <div>
                            <Input.Search
                                value={keyword}
                                placeholder={`${t("search {{field}}", { field: t('keyword') })}`}
                                onChange={(e) => {
                                    setKeyword(e.target.value);
                                }}
                                onSearch={() => {
                                    proTableRef.current?.reload(true);
                                }}
                            />
                        </div>
                        <br />
                        <ProTable
                            className='innerTable'
                            columns={columns}
                            actionRef={proTableRef}
                            request={getRequest}
                            search={false}
                            toolbar={{
                                settings: []
                            }}
                            scroll={{ y: 500 }}
                            rowKey="id"
                            size="small"
                            pagination={false}
                            rowSelection={{
                                selectedRowKeys: selectedDatas.map(item => item.id),
                                onChange: (selectedRowKeys: string[]) => {
                                    const allIds = dataSource.map(item => item.id),
                                        oldDatas = selectedDatas.filter(sItem => !allIds.includes(sItem.id)),
                                        newDatas = selectedRowKeys.length ? dataSource.filter(item => selectedRowKeys.includes(item.id)) : [];
                                    setSelectedDatas([...oldDatas, ...newDatas])
                                    setSaveDisabled(false)
                                },
                                getCheckboxProps: (record) => ({
                                    disabled: record.isGrantRole || record.isGrantUser
                                }),
                                type: "checkbox"
                            }}
                        />
                    </Col>
                    <Col span="8">
                        <div style={{ paddingBottom: "30px" }}>
                            <Row>
                                <Col flex="auto">
                                    {t('selected')}（{selectedDatas.length}）
                                </Col>
                                <Col >
                                    <a onClick={() => {
                                        setSelectedDatas([])
                                        setSaveDisabled(true)
                                    }}>{t('empty')}</a>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <List
                                style={{ overflow: "auto", height: "500px" }}
                                bordered
                                size="small"
                                dataSource={selectedDatas}
                                renderItem={(item) => <List.Item extra={
                                    <a onClick={() => {
                                        const index = selectedDatas.findIndex(p => p.id == item.id)
                                        if (index > -1) {
                                            selectedDatas.splice(index, 1)
                                            setSelectedDatas([...selectedDatas])
                                        }
                                        setSaveDisabled(false)
                                    }}>
                                        <CloseOutlined />
                                    </a>
                                }>
                                    <List.Item.Meta title={item.name} description={item.comments} />
                                </List.Item>}
                            />
                        </div>
                    </Col>
                </Row>
            </Space>
        </DrawerForm>
    );
}