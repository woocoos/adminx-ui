import { App } from '@/services/app';
import { Button, Modal } from 'antd';
import { useRef } from 'react';
import { AppListRef } from '../list';
import AppList from '../list';

export default (props: {
    open: boolean
    isMultiple?: boolean
    title: string
    tableTitle?: string
    appId: string
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
            <AppList ref={listRef} title={props.tableTitle} isMultiple={props.isMultiple} scene="modal" />
        </Modal>
    )
}