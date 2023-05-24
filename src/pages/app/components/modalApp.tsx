import { App } from '@/services/app';
import { Button, Modal } from 'antd';
import { useRef } from 'react';
import { AppListRef } from '../list';
import { AppList } from '../list';

export default (props: {
    open: boolean
    orgId?: string
    isMultiple?: boolean
    title: string
    tableTitle?: string
    onClose: (selectData?: App[]) => void
}) => {
    const listRef = useRef<AppListRef>(null)

    const
        handleOk = () => {
            props?.onClose(listRef.current?.getSelect())
        },
        handleCancel = () => {
            props?.onClose(undefined)
        }

    return (
        <Modal title={props.title} open={props.open} onOk={handleOk} onCancel={handleCancel} width={900}>
            <AppList ref={listRef} title={props.tableTitle} orgId={props.orgId} isMultiple={props.isMultiple} scene="modal" />
        </Modal>
    )
}