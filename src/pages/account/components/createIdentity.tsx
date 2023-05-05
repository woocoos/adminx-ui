import { EnumUserIdentityKind, EnumUserStatus, UserIdentity, bindUserIdentity, delUserIdentity, getUserInfo } from '@/services/user';
import {
    ActionType,
    EditableProTable, ProColumns
} from '@ant-design/pro-components';
import { Drawer, Popconfirm, message } from 'antd';
import { useRef, useState } from "react";
import { useTranslation } from 'react-i18next';


export default (props: {
    open?: boolean
    title?: string
    id?: string | null
    onClose?: (isSuccess?: boolean) => void
}) => {

    const proTableRef = useRef<ActionType>(),
        { t } = useTranslation(),
        [loading, setLoading] = useState(false),
        // 是否操作过
        [isAction, setIsAction] = useState(false),
        columns: ProColumns<UserIdentity>[] = [
            {
                title: t('type'),
                dataIndex: 'kind',
                formItemProps: {
                    rules: [{ required: true, message: `${t('this field is required')}` }],
                },
                valueType: 'select',
                valueEnum: EnumUserIdentityKind
            },
            {
                title: 'code',
                dataIndex: 'code',
                formItemProps: (form, row) => {
                    const rowData = form.getFieldValue(row.entity.id), rules: any[] = [
                        { required: true, message: `${t('this field is required')}` }
                    ]
                    if (rowData?.kind === 'email') {
                        rules.push({
                            type: 'email',
                            message: `${t('formal error')}`
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
                title: t('state'),
                dataIndex: 'status',
                valueType: 'select',
                valueEnum: EnumUserStatus
            },
            {
                title: t('operation'),
                valueType: 'option',
                width: 200,
                render: (_text, record) => [
                    <Popconfirm
                        key="editable"
                        title={t('delete')}
                        description={`${t('confirm delete')}?`}
                        onConfirm={async () => {
                            setIsAction(true)
                            if (await delUserIdentity(record.id)) {
                                message.success(t('submit success'))
                                proTableRef.current?.reload();
                            }
                        }}
                    >
                        <a> {t('delete')} </a>
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
                    record: { id: "new", status: "active" } as any,
                    creatorButtonText: t('add {{field}}', { field: '' })
                }}
                editable={{
                    type: 'single',
                    saveText: t('save'),
                    deleteText: t('delete'),
                    cancelText: t('cancel'),
                    onSave: async (_key: string, record: UserIdentity) => {
                        if (props.id) {
                            const input: any = { ...record };
                            delete input.id
                            delete input.index
                            const result = await bindUserIdentity(props.id, input)
                            if (result?.id) {
                                message.success(t('submit success'))
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