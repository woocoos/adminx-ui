import { Col, Drawer, Input, List, Row, Space, Table, Tag, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { CloseOutlined } from "@ant-design/icons";
import { DrawerForm } from '@ant-design/pro-components';
import { OrgPolicy, getOrgPolicyList } from '@/services/org/policy';
import { OrgRole } from '@/services/org/role';
import { Permission, createPermission } from '@/services/permission';
import { useTranslation } from 'react-i18next';
import { User } from '@/services/user';

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
        columns: ColumnsType<OrgPolicy> = [
            { title: t('policy'), dataIndex: 'name' },
            { title: t('description'), dataIndex: 'comments' },
        ],
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [loading, setLoading] = useState<boolean>(false),
        [selectedPolicys, setSelectedPolicys] = useState<OrgPolicy[]>([]),
        [allList, setAllList] = useState<OrgPolicy[]>([]),
        [dataSource, setdataSource] = useState<OrgPolicy[]>([])

    const
        getRequest = async () => {
            setLoading(true);
            setAllList([])
            const result = await getOrgPolicyList(props.orgId, {}, {}, {})
            if (result?.totalCount) {
                const data = result.edges.map(item => item.node)
                setAllList(data)
                setdataSource(data)
            }

            setLoading(false);
            return {}
        },
        onOpenChange = (open: boolean) => {
            if (!open) {
                props.onClose?.()
            }
        },
        onSearch = (keyword: string) => {
            if (keyword) {
                setdataSource(allList.filter(item => item.name.indexOf(keyword) > -1 || item.comments.indexOf(keyword) > -1))
            } else {
                getRequest()
            }
        },
        onFinish = async () => {
            setSaveLoading(true)
            let isTree = false, result: Permission | null = null;
            for (let i in allList) {
                const item = allList[i]
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
                    resetText: t('reset')
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
            onReset={getRequest}
            request={getRequest}
            onFinish={onFinish}
            onOpenChange={onOpenChange}
        >
            <Space direction="vertical">
                {
                    props.orgRoleInfo ? <>
                        <div>{props.orgRoleInfo.kind === 'role' ? t('role') : t('user group')}：</div>
                        <div>
                            <Input value={props.orgRoleInfo.name} />
                        </div>
                    </> : ''
                }
                {
                    props.userInfo ? <>
                        <div>{t('user')}：</div>
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
                            <Input.Search placeholder={`${t("search {{field}}", { field: t('keyword') })}`} onSearch={onSearch} />
                        </div>
                        <br />
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            scroll={{ y: 500 }}
                            rowKey="id"
                            size="small"
                            loading={loading}
                            pagination={false}
                            rowSelection={{
                                type: "checkbox",
                                selectedRowKeys: selectedPolicys.map(item => item.id),
                                onSelectAll: (selected) => {
                                    const allIds = selectedPolicys.map(item => item.id)
                                    if (selected) {
                                        const addList = dataSource.filter(item => !allIds.includes(item.id))
                                        setSelectedPolicys([...selectedPolicys, ...addList])
                                    } else {
                                        dataSource.forEach(item => {
                                            const index = selectedPolicys.findIndex(p => p.id == item.id)
                                            if (index > -1) {
                                                selectedPolicys.splice(index, 1)
                                            }
                                        })
                                        setSelectedPolicys([...selectedPolicys])
                                    }
                                    setSaveDisabled(false)
                                },
                                onSelect: (record, selected) => {
                                    if (selected) {
                                        setSelectedPolicys([...selectedPolicys, record])
                                    } else {
                                        const index = selectedPolicys.findIndex(p => p.id == record.id)
                                        if (index > -1) {
                                            selectedPolicys.splice(index, 1)
                                            setSelectedPolicys([...selectedPolicys])
                                        }
                                    }
                                    setSaveDisabled(false)
                                }
                            }}
                        />
                    </Col>
                    <Col span="8">
                        <div style={{ paddingBottom: "30px" }}>
                            <Row>
                                <Col flex="auto">
                                    {t('selected')}（{selectedPolicys.length}）
                                </Col>
                                <Col >
                                    <a>{t('empty')}</a>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <List
                                style={{ overflow: "auto", height: "500px" }}
                                bordered
                                size="small"
                                dataSource={selectedPolicys}
                                renderItem={(item) => <List.Item extra={
                                    <a onClick={() => {
                                        const index = selectedPolicys.findIndex(p => p.id == item.id)
                                        if (index > -1) {
                                            selectedPolicys.splice(index, 1)
                                            setSelectedPolicys([...selectedPolicys])
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