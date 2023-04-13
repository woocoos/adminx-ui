import { UpdateUserInfoScene, User, UserLoginProfile, UserLoginProfileSetKind, UserType, createUserInfo, getUserInfo, updateUserInfo, updateUserProfile } from '@/services/user';
import store from '@/store';
import {
    DrawerForm,
    ProFormText,
    ProFormTextArea,
    ProFormSwitch,
    ProFormRadio,
} from '@ant-design/pro-components';
import { Radio } from 'antd';
import { useState } from "react";


export default (props: {
    open?: boolean
    title?: string
    id?: string
    userType: UserType
    scene: UpdateUserInfoScene
    onClose?: (isSuccess?: boolean) => void
}) => {

    const [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [setKind, setSetKind] = useState<UserLoginProfileSetKind>('auto'),
        [basisState] = store.useModel("basis")

    const
        onOpenChange = (open: boolean) => {
            if (!open) {
                props.onClose?.()
            }
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
                appInfo = await createUserInfo(basisState.tenantId, values, props.userType, setKind)
            }
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
            <div x-if={['create'].includes(props.scene)}>
                <ProFormText name="principalName" label="登陆名称"
                    rules={[
                        { required: true, message: "请输入登陆名称", },
                    ]} />
                <div>
                    <Radio.Group value={setKind} options={[
                        { label: '手动设置密码', value: "customer" },
                        { label: '自动生成密码', value: "auto" },
                    ]} onChange={(e) => setSetKind(e.target.value)} />
                </div>
                <br />
                <ProFormText.Password x-if={setKind === 'customer'} name="password" label="密码"
                    rules={[
                        { required: true, message: "请输入密码", },
                    ]} />
            </div>
            <div x-if={['create', "base"].includes(props.scene)}>
                <ProFormText name="displayName" label="显示名"
                    rules={[
                        { required: true, message: "请输入显示名", },
                    ]} />
                <ProFormText name="email" label="邮箱"
                    rules={[
                        { required: true, message: "请输入编码", },
                        { type: "email", message: "邮箱格式错误", },
                    ]} />
                <ProFormText name="mobile" label="手机" />
                <ProFormTextArea
                    name="comments"
                    label="简介"
                    placeholder="请输入简介"
                />
            </div>
            <div x-if={['loginProfile'].includes(props.scene)}>
                <ProFormSwitch name="canLogin" label="允许密码登陆" />
                <ProFormSwitch name="passwordReset" label="下次登陆重置密码" />
                <ProFormSwitch name="verifyDevice" label="设备认证" />
                <ProFormSwitch name="mfaEnabled" label="多因素验证" />
            </div>
        </DrawerForm>
    );
}