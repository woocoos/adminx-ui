import { Org } from '@/services/org';
import { Button, Modal } from 'antd';
import { useRef } from 'react';
import { OrgListRef } from '../list';
import OrgList from '../list';


export default (props: {
    open: boolean
    isMultiple?: boolean
    title: string
    orgId?: string
    appId?: string
    tableTitle?: string
    onClose: (selectData?: Org[]) => void
}) => {
    const listRef = useRef<OrgListRef>(null)

    const
        handleOk = () => {
            props?.onClose(listRef.current?.getSelect())
        },
        handleCancel = () => {
            props?.onClose(undefined)
        }

    return (
        <Modal title={props.title} open={props.open} onOk={handleOk} onCancel={handleCancel} width={900}>
            <OrgList ref={listRef} title={props.tableTitle} scene="modal" isMultiple={props.isMultiple} appId={props.appId} />
        </Modal>
    )
}