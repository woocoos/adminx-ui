import { Button, Modal } from 'antd';
import UserList, { UserListRef } from './listAccount';
import { useRef } from 'react';
import { User, UserType } from '@/services/user';


export default (props: {
    open: boolean
    title: string
    userType?: UserType
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
        <Modal title={props.title}
            open={props.open}
            onOk={handleOk}
            onCancel={handleCancel}
            width={900}
        >
            <UserList ref={listRef}
                title={props.tableTitle}
                orgId={props.orgId}
                userType={props.userType}
                scene="modal"
                isMultiple={props.isMultiple}
            />
        </Modal>
    )
}