import { AppAction, EnumAppActionKind, EnumAppActionMethod, createAppAction, getAppActionInfo, updateAppAction } from '@/services/app/action';
import {
    DrawerForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { useState } from "react";
import { useTranslation } from 'react-i18next';

export default (props: {
    open?: boolean
    title?: string
    id?: string
    appId?: string
    onClose?: (isSuccess?: boolean) => void
}) => {

    const { t } = useTranslation(),
        [saveLoading, setSaveLoading] = useState(false),
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
                searchConfig: {
                    submitText: t('submit'),
                    resetText: t('reset')
                },
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
            <ProFormText name="name" label={t('name')}
                rules={[
                    { required: true, message: `${t("Please enter {{field}}"), { field: t('name') }}`, },
                ]} />
            <ProFormSelect name="kind" label={t('type')}
                valueEnum={EnumAppActionKind}
                rules={[
                    { required: true, message: `${t("Please enter {{field}}"), { field: t('type') }}`, },
                ]} />
            <ProFormSelect name="method" label={t('method')}
                valueEnum={EnumAppActionMethod}
                rules={[
                    { required: true, message: `${t("Please enter {{field}}"), { field: t('method') }}`, },
                ]} />
            <ProFormTextArea
                name="comments"
                label={t('description')}
                placeholder={`${t("Please enter {{field}}"), { field: t('description') }}`}
            />
        </DrawerForm>
    );
}