import { createAppInfo, getAppInfo, updateAppInfo } from '@/services/app';
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
                const appInfo = await getAppInfo(props.id)
                if (appInfo?.id) {
                    return appInfo
                }
            }
            return {}
        },
        onValuesChange = () => {
            setSaveDisabled(false)
        },
        onFinish = async (values) => {
            setSaveLoading(true)
            const appInfo = props.id ? await updateAppInfo(props.id, values) : await createAppInfo(values)
            if (appInfo?.id) {
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
            <ProFormText name="logo" label="LOGO" />
            <ProFormText name="name" label="名称"
                rules={[
                    {
                        required: true,
                        message: "请输入名称",
                    },
                ]} />
            <ProFormText name="code" label="编码"
                disabled={!!props.id}
                rules={[
                    {
                        required: true,
                        message: "请输入编码",
                    },
                ]} />
            <ProFormSelect name="kind" label="类型"
                options={[
                    { value: "web", label: "web" },
                    { value: "native", label: "native" },
                    { value: "server", label: "server" },
                ]} rules={[
                    {
                        required: true,
                        message: "请输入类型",
                    },
                ]} />
            <ProFormTextArea
                name="comments"
                label="描述"
                placeholder="请输入应用简介"
            />
        </DrawerForm>
    );
}