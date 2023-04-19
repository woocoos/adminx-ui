import { AppAction, EnumAppActionKind, EnumAppActionMethod, createAppAction, getAppActionInfo, updateAppAction } from '@/services/app/action';
import {
    DrawerForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { useState } from "react";

export default (props: {
    open?: boolean
    title?: string
    id?: string
    appId?: string
    onClose?: (isSuccess?: boolean) => void
}) => {

    const [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true)

    const
        onOpenChange = (open: boolean) => {
            if (!open) {
                props.onClose?.()
            }
        },
        getRequest = async () => {
            setSaveLoading(false)
            setSaveDisabled(true)
            if (props.id) {
                const info = await getAppActionInfo(props.id)
                if (info?.id) {
                    return info
                }
            }
            return {}
        },
        onValuesChange = () => {
            setSaveDisabled(false)
        },
        onFinish = async (values: AppAction) => {
            setSaveLoading(true)
            const info = props.id ? await updateAppAction(props.id, values) : await createAppAction(props?.appId || "", values)
            if (info?.id) {
                setSaveDisabled(true)
                props.onClose?.(true)
            }
            setSaveLoading(false)
            return false;
        }

    return (
        <DrawerForm
            drawerProps={{
                width: 500,
                destroyOnClose: true,
            }}
            submitter={{
                submitButtonProps: {
                    loading: saveLoading,
                    disabled: saveDisabled,
                }
            }}
            title={props.title}
            open={props?.open}
            onReset={getRequest}
            request={getRequest}
            onValuesChange={onValuesChange}
            onFinish={onFinish}
            onOpenChange={onOpenChange}
        >
            <ProFormText name="name" label="名称"
                rules={[
                    { required: true, message: "请输入名称", },
                ]} />
            <ProFormSelect name="kind" label="类型"
                valueEnum={EnumAppActionKind}
                rules={[
                    { required: true, message: "请输入类型", },
                ]} />
            <ProFormSelect name="method" label="操作方法"
                valueEnum={EnumAppActionMethod}
                rules={[
                    { required: true, message: "请输入类型", },
                ]} />
            <ProFormTextArea
                name="comments"
                label="描述"
                placeholder="请输入应用简介"
            />
        </DrawerForm>
    );
}