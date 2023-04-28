import { App, } from '@/services/app';
import { AppPolicy, getAppPolicyList } from '@/services/app/policy';
import { AppRole, assignAppRolePolicy } from '@/services/app/role';
import { Col, Drawer, Input, List, Row, Space, Table, Tag, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { CloseOutlined } from "@ant-design/icons";
import { DrawerForm } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';

export default (props: {
    open?: boolean
    title?: string
    appInfo?: App
    roleInfo?: AppRole
    onClose?: (isSuccess?: boolean) => void
}) => {

    const { t } = useTranslation(),
        columns: ColumnsType<AppPolicy> = [
            { title: t('policy'), dataIndex: 'name' },
            { title: t('description'), dataIndex: 'comments' },
        ],
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [loading, setLoading] = useState<boolean>(false),
        [selectedPolicys, setSelectedPolicys] = useState<AppPolicy[]>([]),
        [dataSource, setdataSource] = useState<AppPolicy[]>([])

    const
        getRequest = async () => {
            setLoading(true);
            if (props.appInfo?.id) {
                const result = await getAppPolicyList(props.appInfo.id, { status: "active" }, {}, {})
                if (result?.length) {
                    setdataSource(result);
                }
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
                setdataSource(dataSource.filter(item => item.name.indexOf(keyword) > -1 || item.comments.indexOf(keyword) > -1))
            } else {
                getRequest()
            }
        },
        onFinish = async () => {
            if (props.roleInfo?.id) {
                setSaveLoading(true)
                const result = await assignAppRolePolicy(props.roleInfo.appID, props.roleInfo.id, selectedPolicys.map(item => item.id))
                if (result) {
                    message.success(t('submit success'))
                    props.onClose?.(true)
                }
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
                <div>
                    {t('app')}：<Tag>{props.appInfo?.name}</Tag>
                </div>
                <div>{t('role')}：</div>
                <div>
                    <Input value={props.roleInfo?.name} />
                </div>
                <div>
                    {t('policy')}
                </div>
                <Row gutter={20}>
                    <Col span="16">
                        <div>
                            <Input.Search placeholder={`${t('search {{field}}', { field: t('keyword') })}`} onSearch={onSearch} />
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