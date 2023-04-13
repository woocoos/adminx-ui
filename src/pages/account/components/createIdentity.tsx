import { EnumUserIdentityKind, EnumUserStatus, UserIdentity, bindUserIdentity, delUserIdentity, getUserInfo } from '@/services/user';
import {
    ActionType,
    EditableProTable, ProColumns
} from '@ant-design/pro-components';
import { Drawer, Popconfirm, message } from 'antd';
import { useRef, useState } from "react";


export default (props: {
    open?: boolean
    title?: string
    id?: string
    onClose?: (isSuccess?: boolean) => void
}) => {

    const proTableRef = useRef<ActionType>(),
        [loading, setLoading] = useState(false),
        // 是否操作过
        [isAction, setIsAction] = useState(false),
        columns: ProColumns<UserIdentity>[] = [
            {
                title: '类型',
                dataIndex: 'kind',
                formItemProps: {
                    rules: [{ required: true, message: '此项为必填项' }],
                },
                valueType: 'select',
                valueEnum: EnumUserIdentityKind
            },
            {
                title: 'code',
                dataIndex: 'code',
                formItemProps: (form, row) => {
                    const rowData = form.getFieldValue(row.entity.id), rules: any[] = [
                        { required: true, message: '此项为必填项' }
                    ]
                    if (rowData?.kind === 'email') {
                        rules.push({
                            type: 'email',
                            message: '邮箱格式不正确'
                        })
                    }
                    return {
                        rules
                    }
                }
            },
            {
                title: 'codeExtend',
                dataIndex: 'codeExtend',
            },
            {
                title: '状态',
                dataIndex: 'status',
                valueType: 'select',
                valueEnum: EnumUserStatus
            },
            {
                title: '操作',
                valueType: 'option',
                width: 200,
                render: (_text, record) => [
                    <Popconfirm
                        key="editable"
                        title="删除"
                        description="确认是否删除?"
                        onConfirm={async () => {
                            setIsAction(true)
                            if (await delUserIdentity(record.id)) {
                                message.success('操作成功')
                                proTableRef.current?.reload();
                            }
                        }}
                    >
                        <a> 删除 </a>
                    </Popconfirm>

                ],
            },
        ]

    const
        onOpenChange = () => {
            props.onClose?.(isAction)
        },
        getRequest = async () => {
            setLoading(true)
            const table = { data: [] as UserIdentity[], success: true, total: 0 };
            if (props.id) {
                const userInfo = await getUserInfo(props.id, ['identity']);
                if (userInfo?.identities) {
                    table.data = userInfo.identities
                    table.total = userInfo?.identities.length
                }
            }
            setLoading(false)
            return table
        }



    return (
        <Drawer
            width={800}
            destroyOnClose
            placement="right"
            title={props.title}
            open={props?.open}
            onClose={onOpenChange}
        >
            <EditableProTable
                actionRef={proTableRef}
                rowKey="id"
                loading={loading}
                columns={columns}
                request={getRequest}
                recordCreatorProps={{
                    record: { id: "new", status: "active" } as any
                }}
                editable={{
                    type: 'single',
                    onSave: async (_key: string, record: UserIdentity) => {
                        if (props.id) {
                            const input: any = { ...record };
                            delete input.id
                            delete input.index
                            const result = await bindUserIdentity(props.id, input)
                            if (result?.id) {
                                message.success('操作成功')
                                proTableRef.current?.reload();
                            }
                            setIsAction(true)
                        }
                    },

                }}
            />
        </Drawer>
    );
}