import { Modal } from 'antd';
import { useState } from 'react';
import { EnumUserStatus, User, UserType, getUserList } from '@/services/user';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { List, TableFilter, TableParams, TableSort } from '@/services/graphql';
import { getOrgRoleUserList, getOrgUserList } from '@/services/org/user';


export default (props: {
    open: boolean
    title: string
    userType?: UserType
    isMultiple?: boolean
    tableTitle?: string
    orgId?: string
    orgRoleId?: string
    onClose: (selectData?: User[]) => void
}) => {
    const { t } = useTranslation(),
        columns: ProColumns<User>[] = [
            // 有需要排序配置  sorter: true 
            {
                title: t("principal name"), dataIndex: 'principalName', width: 90, search: {
                    transform: (value) => ({ principalNameContains: value || undefined })
                }
            },
            {
                title: t('display name'), dataIndex: 'displayName', width: 120, search: {
                    transform: (value) => ({ displayNameContains: value || undefined })
                }
            },
            {
                title: t('email'), dataIndex: 'email', width: 120, search: {
                    transform: (value) => ({ emailContains: value || undefined })
                }
            },
            {
                title: t('mobile'), dataIndex: 'mobile', width: 160, search: {
                    transform: (value) => ({ mobileContains: value || undefined })
                }
            },
            {
                title: t('status'), dataIndex: 'status', filters: true, search: false, width: 100,
                valueEnum: EnumUserStatus,
            },
            { title: t('created at'), dataIndex: 'createdAt', width: 160, valueType: "dateTime", sorter: true },

        ],
        [dataSource, setDataSource] = useState<User[]>([]),
        // 选中处理
        [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

    const
        getRequest = async (params: TableParams, sort: TableSort, filter: TableFilter) => {
            const table = { data: [] as User[], success: true, total: 0 };
            let result: List<User> | null
            params['userType'] = props.userType
            if (props.orgRoleId) {
                result = await getOrgRoleUserList(props.orgRoleId, params, filter, sort)
            } else if (props.orgId) {
                result = await getOrgUserList(props.orgId, params, filter, sort)
            } else {
                result = await getUserList(params, filter, sort);
            }

            if (result) {
                table.data = result.edges.map(item => item.node)
                table.total = result.totalCount
            }
            setSelectedRowKeys([])
            setDataSource(table.data)
            return table
        },
        handleOk = () => {
            props?.onClose(dataSource.filter(item => selectedRowKeys.includes(item.id)))
        },
        handleCancel = () => {
            props?.onClose()
        }

    return (
        <Modal title={props.title}
            open={props.open}
            onOk={handleOk}
            onCancel={handleCancel}
            width={900}
            destroyOnClose
        >
            <ProTable
                search={{
                    searchText: `${t('query')}`,
                    resetText: `${t('reset')}`,
                    labelWidth: 'auto',
                }}
                size="small"
                rowKey={"id"}
                scroll={{ x: 'max-content', y: 300 }}
                columns={columns}
                options={false}
                request={getRequest}
                pagination={{ showSizeChanger: true }}
                rowSelection={{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (selectedRowKeys: string[]) => { setSelectedRowKeys(selectedRowKeys) },
                    type: props.isMultiple ? "checkbox" : "radio"
                }}
                onRow={(record) => {
                    return {
                        onClick: () => {
                            if (props.isMultiple) {
                                if (selectedRowKeys.includes(record.id)) {
                                    setSelectedRowKeys(selectedRowKeys.filter(id => id != record.id))
                                } else {
                                    selectedRowKeys.push(record.id)
                                    setSelectedRowKeys([...selectedRowKeys])
                                }
                            } else {
                                setSelectedRowKeys([record.id])
                            }
                        }
                    };
                }}
            />
        </Modal>
    )
}