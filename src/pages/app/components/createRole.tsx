import { AppRole, createAppRole, getAppRoleInfo, updateAppRole } from '@/services/app/role';
import {
    DrawerForm,
    ProFormRadio,
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
                const info = await getAppRoleInfo(props.id)
                if (info?.id) {
                    return info
                }
            }
            return {
                autoGrant: true,
                editable: true
            }
        },
        onValuesChange = () => {
            setSaveDisabled(false)
        },
        onFinish = async (values: AppRole) => {
            setSaveLoading(true)
            const info = props.id ? await updateAppRole(props.id, values) : await createAppRole(props?.appId || "", values)
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
            <ProFormRadio.Group name="autoGrant" label="自动授权" options={[
                { label: '是', value: true },
                { label: '否', value: false },
            ]} />
            <ProFormRadio.Group name="editable" label="授权后编辑" options={[
                { label: '是', value: true },
                { label: '否', value: false },
            ]} />
            <ProFormTextArea
                name="comments"
                label="描述"
                placeholder="请输入描述"
            />
        </DrawerForm>
    );
}