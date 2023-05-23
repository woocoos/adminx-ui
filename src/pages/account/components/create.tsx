import { setLeavePromptWhen } from '@/components/LeavePrompt';
import { getOrgInfo } from '@/services/org';
import { UpdateUserInfoScene, User, UserLoginProfile, UserLoginProfileSetKind, UserType, createUserInfo, getUserInfo, updateUserInfo, updateUserProfile } from '@/services/user';
import store from '@/store';
import {
    DrawerForm,
    ProFormText,
    ProFormTextArea,
    ProFormSwitch,
} from '@ant-design/pro-components';
import { Radio } from 'antd';
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';


export default (props: {
    open?: boolean
    title?: string
    id?: string | null
    orgId?: string
    userType: UserType
    scene: UpdateUserInfoScene
    onClose?: (isSuccess?: boolean) => void
}) => {

    const { t } = useTranslation(),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [domain, setDomain] = useState<string>(''),
        [setKind, setSetKind] = useState<UserLoginProfileSetKind>('auto'),
        [basisState] = store.useModel("basis")

    setLeavePromptWhen(saveDisabled)

    const
        getBase = async () => {
            if (basisState.tenantId) {
                const result = await getOrgInfo(basisState.tenantId)
                if (result?.id) {
                    setDomain(result.domain || '')
                }
            }
        },
        onOpenChange = (open: boolean) => {
            if (!open) {
                props.onClose?.()
            }
            setSaveDisabled(true)
        },
        getRequest = async () => {
            let info: User | UserLoginProfile | null = null
            if (props.id) {
                info = await getUserInfo(props.id, ['loginProfile'])
                switch (props.scene) {
                    case "loginProfile":
                        if (info?.loginProfile) {
                            info = info.loginProfile
                        }
                        break;
                    default:
                        break;
                }
            }
            setSaveLoading(false)
            setSaveDisabled(true)
            return info || {}
        },
        onValuesChange = () => {
            setSaveDisabled(false)
        },
        onFinish = async (values: User) => {
            setSaveLoading(true)
            let appInfo: User | UserLoginProfile | null = null
            if (props.id) {
                switch (props.scene) {
                    case "base":
                        appInfo = await updateUserInfo(props.id, values)
                        break;
                    case "loginProfile":
                        appInfo = await updateUserProfile(props.id, values)
                        break;
                    default:
                        break;
                }
            } else {
                if (props.userType === 'member' && domain) {
                    values.principalName = `${values.principalName}@${domain}`
                }
                appInfo = await createUserInfo(props?.orgId || basisState.tenantId, values, props.userType, setKind)
            }
            if (appInfo?.id) {
                setSaveDisabled(true)
                props.onClose?.(true)
            }
            setSaveLoading(false)
            return false;
        }

    useEffect(() => {
        getBase()
    }, [])

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
            <div x-if={['create'].includes(props.scene)}>
                <ProFormText
                    name="principalName"
                    label={t("principal name")}
                    rules={[
                        { required: true, message: `${t("Please enter {{field}}", { field: t("principal name") })}`, },
                    ]}
                    fieldProps={{
                        suffix: props.userType === 'member' ? `${domain ? `@${domain}` : ''}` : ''
                    }}
                />
                <div>
                    <Radio.Group value={setKind} options={[
                        { label: t('manually set password'), value: "customer" },
                        { label: t("automatic password generation"), value: "auto" },
                    ]} onChange={(e) => setSetKind(e.target.value)} />
                </div>
                <br />
                <ProFormText.Password x-if={setKind === 'customer'} name="password" label={t('password')}
                    rules={[
                        { required: true, message: `${t("Please enter {{field}}", { field: t("password") })}`, },
                    ]} />
            </div>
            <div x-if={['create', "base"].includes(props.scene)}>
                <ProFormText name="displayName" label={t('display name')}
                    rules={[
                        { required: true, message: `${t("Please enter {{field}}", { field: t("display name") })}`, },
                    ]} />
                <ProFormText name="email" label={t('email')}
                    rules={[
                        { required: true, message: `${t("Please enter {{field}}", { field: t("email") })}`, },
                        { type: "email", message: `${t("formal error")}`, },
                    ]} />
                <ProFormText name="mobile" label={t('mobile')} />
                <ProFormTextArea
                    name="comments"
                    label={t('introduction')}
                    placeholder={`${t("Please enter {{field}}", { field: t("introduction") })}`}
                />
            </div>
            <div x-if={['loginProfile'].includes(props.scene)}>
                <ProFormSwitch name="canLogin" label={t('allow password login')} />
                <ProFormSwitch name="passwordReset" label={t('reset password on next login')} />
            </div>
        </DrawerForm>
    );
}