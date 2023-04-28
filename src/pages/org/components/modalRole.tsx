import { Button, Modal } from 'antd';
import { useRef } from 'react';
import { OrgRoleListRef } from '../roles';
import { OrgRole } from '@/services/org/role';
import OrgRoleList from '../roles';


export default (props: {
    open: boolean
    title: string
    isMultiple?: boolean
    tableTitle?: string
    orgId: string
    onClose: (selectData?: OrgRole[]) => void
}) => {
    const listRef = useRef<OrgRoleListRef>(null)

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
            <OrgRoleList
                ref={listRef}
                title={props.tableTitle}
                orgId={props.orgId}
                scene="modal"
                isMultiple={props.isMultiple}
            />
        </Modal>
    )
}