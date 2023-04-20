import { Button, Modal } from 'antd';
import UserList, { UserListRef } from '@/pages/account/list';
import { useRef } from 'react';
import { User } from '@/services/user';


export default (props: {
    open: boolean
    title: string
    isMultiple?: boolean
    tableTitle?: string
    orgId?: string
    onClose: (selectData?: User[]) => void
}) => {
    const listRef = useRef<UserListRef>(null)

    const
        handleOk = () => {
            props?.onClose(listRef.current?.getSelect())
        },
        handleCancel = () => {
            props?.onClose(undefined)
        }

    return (
        <Modal title={props.title} open={props.open} onOk={handleOk} onCancel={handleCancel} width={900}>
            <UserList ref={listRef} title={`${props.tableTitle || '用户列表'}`} orgId={props.orgId} scene="modal" isMultiple={props.isMultiple} />
        </Modal>
    )
}