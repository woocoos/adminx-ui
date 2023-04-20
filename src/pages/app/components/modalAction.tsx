import { Button, Modal } from 'antd';
import { useRef } from 'react';
import { AppAction } from '@/services/app/action';
import { AppActionListRef } from '../actions';
import AppActionList from '../actions';

export default (props: {
    open: boolean
    isMultiple?: boolean
    title: string
    appId: string
    onClose: (selectData?: AppAction[]) => void
}) => {
    const listRef = useRef<AppActionListRef>()

    const
        handleOk = () => {
            props?.onClose(listRef.current?.getSelect())
        },
        handleCancel = () => {
            props?.onClose(undefined)
        }

    return (
        <Modal title={props.title} open={props.open} onOk={handleOk} onCancel={handleCancel} width={900}>
            <AppActionList ref={listRef} hiddenHeader appId={props.appId} isMultiple={props.isMultiple} scene="modal" />
        </Modal>
    )
}