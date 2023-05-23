import { setLeavePromptWhen } from '@/components/LeavePrompt';
import { App, createAppInfo, getAppInfo, updateAppInfo } from '@/services/app';
import {
    DrawerForm,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    ProFormDigit
} from '@ant-design/pro-components';
import { useState } from "react";
import { useTranslation } from 'react-i18next';

export default (props: {
    open?: boolean
    title?: string
    id?: string | null
    scene?: 'conf'
    onClose?: (isSuccess?: boolean) => void
}) => {

    const { t } = useTranslation(),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true)

    setLeavePromptWhen(saveDisabled)

    const
        onOpenChange = (open: boolean) => {
            if (!open) {
                props.onClose?.()
            }
            setSaveDisabled(true);
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
                searchConfig: {
                    submitText: t('submit'),
                    resetText: t('cancel')
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
            <div x-if={props.scene == 'conf'}>
                <ProFormText name="redirectURI" label={t('callback address')}
                    rules={[
                        { type: "url", message: `${t('formal error')}`, },
                    ]} />
                <ProFormText name="scopes" label={t('scope of authority')} />
                <ProFormDigit name="tokenValidity" label={`token ${t('validity period')}`} />
                <ProFormDigit name="refreshTokenValidity" label={`refresh_token ${t('validity period')}`} />
            </div>
            <div x-else>
                <ProFormText name="logo" label="LOGO" />
                <ProFormText name="name" label={t("name")}
                    rules={[
                        { required: true, message: `${t('"Please enter {{field}}"', { field: t('name') })}`, },
                    ]} />
                <ProFormText name="code" label={t('code')}
                    disabled={!!props.id}
                    rules={[
                        { required: true, message: `${t('"Please enter {{field}}"', { field: t('code') })}`, },
                    ]} />
                <ProFormSelect name="kind" label={t('type')}
                    options={[
                        { value: "web", label: "web" },
                        { value: "native", label: "native" },
                        { value: "server", label: "server" },
                    ]} rules={[
                        { required: true, message: `${t('"Please enter {{field}}"', { field: t('type') })}`, },
                    ]} />
                <ProFormTextArea
                    name="comments"
                    label={t('description')}
                    placeholder={`${t('"Please enter {{field}}"', { field: t('description') })}`}
                />
            </div>
        </DrawerForm>
    );
}