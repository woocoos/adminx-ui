import { App, createAppInfo, getAppInfo, updateAppInfo } from '@/services/app';
import {
    DrawerForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProFormDigit
} from '@ant-design/pro-components';
import { useState } from "react";

export default (props: {
    open?: boolean
    title?: string
    id?: string
    scene?: 'conf'
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
        onFinish = async (values: App) => {
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
            <div x-if={props.scene == 'conf'}>
                <ProFormText name="redirectURI" label="回调地址"
                    rules={[
                        { type: "url", message: "地址格式错误", },
                    ]} />
                <ProFormText name="scopes" label="权限范围" />
                <ProFormDigit name="tokenValidity" label="token有效期" />
                <ProFormDigit name="refreshTokenValidity" label="refresh_token有效期" />
            </div>
            <div x-else>
                <ProFormText name="logo" label="LOGO" />
                <ProFormText name="name" label="名称"
                    rules={[
                        { required: true, message: "请输入名称", },
                    ]} />
                <ProFormText name="code" label="编码"
                    disabled={!!props.id}
                    rules={[
                        { required: true, message: "请输入编码", },
                    ]} />
                <ProFormSelect name="kind" label="类型"
                    options={[
                        { value: "web", label: "web" },
                        { value: "native", label: "native" },
                        { value: "server", label: "server" },
                    ]} rules={[
                        { required: true, message: "请输入类型", },
                    ]} />
                <ProFormTextArea
                    name="comments"
                    label="描述"
                    placeholder="请输入应用简介"
                />
            </div>
        </DrawerForm>
    );
}