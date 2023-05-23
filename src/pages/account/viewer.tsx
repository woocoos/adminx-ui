import {
    PageContainer,
    ProCard,
    ProDescriptions,
    useToken,
} from "@ant-design/pro-components";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import defaultAvatar from "@/assets/images/default-avatar.png";
import { ReactNode, useEffect, useState } from "react";
import { Button, Divider, Modal, Space, message } from "antd";
import UserCreate from "./components/create";
import UserCreateIdentity from "./components/createIdentity";
import { EnumUserIdentityKind, UpdateUserInfoScene, User, UserType, disableMFA, enableMFA, getUserInfo, sendMFAEmail } from "@/services/user";
import { useTranslation } from "react-i18next";
import ListUserPermission from "./components/listUserPermission";
import ListUserJoinGroup from "./components/listUserJoinGroup";
import { useSearchParams } from "@ice/runtime";
import Auth from "@/components/Auth";

export default () => {
    const { token } = useToken(),
        { t } = useTranslation(),
        [searchParams, setSearchParams] = useSearchParams(),
        [showEys, setShowEys] = useState(false),
        [loading, setLoading] = useState(false),
        [info, setInfo] = useState<User>(),
        [modal, setModal] = useState<{
            open: boolean,
            title: string,
            scene: UpdateUserInfoScene,
            userType: UserType
        }>({
            open: false,
            title: '',
            scene: "base",
            userType: "member"
        })

    const
        onDrawerClose = (isSuccess: boolean) => {
            if (isSuccess) {
                getRequest()
            }
            setModal({ open: false, title: '', scene: modal.scene, userType: modal.userType })
        },
        getRequest = async () => {
            const id = searchParams.get('id')
            if (id) {
                setLoading(true)
                const info = await getUserInfo(id, ['loginProfile', "identity"])
                if (info?.id) {
                    setInfo(info)
                    setLoading(false)
                }
            }
        },
        identityRender = () => {
            const items: ReactNode[] = []
            if (info?.identities) {
                for (let key in info.identities) {
                    const item = info.identities[key]
                    items.push(
                        <ProDescriptions.Item label={EnumUserIdentityKind[item.kind].text} key={key} >
                            <div>{item.code}</div>
                            <div>{item.codeExtend}</div>
                        </ProDescriptions.Item>
                    )
                }

            }
            return items
        },
        chagneMfa = (enable: boolean) => {
            const title = enable ? t('enable MFA') : t('close MFA'),
                content = enable ? t('confirm enable MFA') : t('confirm close MFA');
            if (info) {
                Modal.confirm({
                    title: title,
                    content: content,
                    onOk: async (close) => {
                        if (enable) {
                            const result = await enableMFA(info.id)
                            if (result) {
                                message.success(t('submit success'))
                                await getRequest()
                                close();
                            }
                        } else {
                            const result = await disableMFA(info.id)
                            if (result) {
                                message.success(t('submit success'))
                                await getRequest()
                                close();
                            }
                        }
                    }
                })
            }
        },
        sendEmail = () => {
            if (info) {
                Modal.confirm({
                    title: t('send to email'),
                    content: `${t('MFA')} ${t('send to email')}`,
                    onOk: async (close) => {
                        const result = await sendMFAEmail(info.id)
                        if (result) {
                            message.success(t('submit success'))
                            await getRequest()
                            close();
                        }

                    }
                })
            }
        },
        shoMfaQrCode = () => {
            if (info) {
                Modal.info({
                    title: t('QR code'),
                    icon: " ",
                    content: <Space direction="vertical">
                        <img src={`/api/login/mfagr.png?userId=${info.id}&secret=${1}&t=${Date.now()}`} style={{ display: "block", width: "160px", height: "160px", margin: "0 auto" }} />
                        <div>{t('account number')}：{info.principalName}</div>
                        <div>{t('Use the MFA application to scan the code. If the application has a device with the same name, delete the device and scan the code again')}</div>
                    </Space>,
                })
            }
        }

    useEffect(() => {
        getRequest()
    }, [])

    return (
        <PageContainer
            header={{
                title: t("{{field}} detail", { field: t(info?.userType || '') }),
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: t('System configuration') },
                        { title: t("{{field}} management", { field: t(info?.userType || '') }) },
                        { title: t("{{field}} detail", { field: t(info?.userType || '') }) },
                    ],
                },
            }}
        >
            <ProCard loading={loading} >
                <ProDescriptions title={t('Basic information')} column={2} extra={
                    info ? <Auth authKey="updateUser">
                        <Button onClick={() =>
                            setModal({ open: true, title: t('amend {{field}}', { field: t("basic information") }), scene: "base", userType: info?.userType || 'member' })
                        }>
                            {t('amend')}
                        </Button>
                    </Auth> : ''
                }>
                    <ProDescriptions.Item label=""
                        valueType={{ type: 'image', width: 120 }}
                        style={{ width: "140px" }}
                    >
                        {defaultAvatar}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="" >
                        <ProDescriptions column={2}>
                            <ProDescriptions.Item label={t('display name')}  >
                                {info?.displayName}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label={t('mobile')}  >
                                {info?.mobile}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label={t('email')}>
                                {info?.email}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label={t('created at')} valueType="dateTime" >
                                {info?.createdAt}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label={t('introduction')} span={2} >
                                {info?.comments}
                            </ProDescriptions.Item>
                        </ProDescriptions>
                    </ProDescriptions.Item>
                </ProDescriptions>

            </ProCard>
            {info ? <ProCard
                tabs={{
                    items: [
                        {
                            label: t("{{field}} management", { field: t('certification') }),
                            key: 'certification',
                            children: <>
                                <ProDescriptions title={t('Login credentials')} column={3} extra={
                                    <Auth authKey={["deleteUserIdentity", "bindUserIdentity"]} keyAndOr="or">
                                        <Button onClick={() =>
                                            setModal({ open: true, title: t('amend {{field}}', { field: t('login credentials') }), scene: "identity", userType: info?.userType || 'member' })
                                        }>
                                            {t('amend')}
                                        </Button>
                                    </Auth>
                                }>
                                    {identityRender()}
                                </ProDescriptions>
                                <Divider style={{ margin: "0 0 24px 0" }} />
                                <ProDescriptions title={t('Login Settings')} column={3} extra={
                                    <Auth authKey="updateLoginProfile">
                                        <Button onClick={() =>
                                            setModal({ open: true, title: t('amend {{field}}', { field: t('login Settings') }), scene: "loginProfile", userType: info?.userType || 'member' })
                                        }>
                                            {t('amend')}
                                        </Button>
                                    </Auth>
                                }>
                                    <ProDescriptions.Item label={t("last login IP")}  >
                                        {info?.loginProfile?.lastLoginIP || '-'}
                                    </ProDescriptions.Item>
                                    <ProDescriptions.Item label={t('last landing time')} valueType="dateTime">
                                        {info?.loginProfile?.lastLoginAt}
                                    </ProDescriptions.Item>
                                    <ProDescriptions.Item label={t('allow password login')}  >
                                        {info?.loginProfile?.canLogin ? t('yes') : t('no')}
                                    </ProDescriptions.Item>
                                    <ProDescriptions.Item label={t('reset password on next login')}  >
                                        {info?.loginProfile?.passwordReset ? t('yes') : t('no')}
                                    </ProDescriptions.Item>
                                </ProDescriptions>
                                <Divider style={{ margin: "0 0 24px 0" }} />
                                <ProDescriptions title={t('MFA')} column={3}
                                    extra={
                                        <Space>
                                            {
                                                info?.loginProfile?.mfaEnabled ? <>
                                                    {/* <Button onClick={() => {
                                                        shoMfaQrCode()
                                                    }}>
                                                        {t('view QR code')}
                                                    </Button> */}
                                                    <Auth authKey="sendMFAToUserByEmail">
                                                        <Button onClick={() => {
                                                            sendEmail()
                                                        }}>
                                                            {t('send to email')}
                                                        </Button>
                                                    </Auth>
                                                    <Auth authKey="enableMFA">
                                                        <Button type="primary" danger onClick={() => {
                                                            chagneMfa(false)
                                                        }}>
                                                            {t('disable')}
                                                        </Button>
                                                    </Auth>
                                                </> : <>
                                                    <Auth authKey="enableMFA">
                                                        <Button onClick={() => {
                                                            chagneMfa(true)
                                                        }}>
                                                            {t('enable')}
                                                        </Button>
                                                    </Auth>
                                                </>
                                            }
                                        </Space>
                                    }
                                >
                                    <ProDescriptions.Item span={3} >
                                        <span style={{ color: "rgba(0, 0, 0, 0.45)" }}>
                                            {t('MFA is a simple and effective best security practice that adds a layer of security beyond the user name and password. The combination of these factors will provide higher security protection for your account')}
                                        </span>
                                    </ProDescriptions.Item>
                                    {/* {info?.loginProfile?.mfaEnabled ? <>
                                        <ProDescriptions.Item label={t("account number")}  >
                                            {info.principalName}
                                        </ProDescriptions.Item>
                                        <ProDescriptions.Item label={t('secret key')} >
                                            {showEys ?
                                                <Space><span>{123456}</span><a onClick={() => setShowEys(false)}><EyeInvisibleOutlined /></a></Space> :
                                                <Space><span>**********</span><a onClick={() => setShowEys(true)}><EyeOutlined /></a></Space>
                                            }
                                        </ProDescriptions.Item>
                                    </> : ''} */}
                                </ProDescriptions>
                            </>
                            ,
                        }, {
                            label: t('joined group'),
                            key: 'group',
                            children: <ListUserJoinGroup userInfo={info} />

                        }, {
                            label: t("{{field}} management", { field: t('permission') }),
                            key: 'permission',
                            children: <ProCard tabs={{
                                items: [
                                    {
                                        label: t('personal authority'),
                                        key: 'user-permission',
                                        children: <ListUserPermission userInfo={info} principalKind="user" />
                                    }, {
                                        label: t('inherit user group permissions'),
                                        key: 'group-permission',
                                        children: <ListUserPermission userInfo={info} isExtendGroup principalKind="role" />
                                    }
                                ]
                            }}
                            />
                        }
                    ],
                }}
            /> : ''}


            <UserCreate
                x-if={['base', 'loginProfile'].includes(modal.scene)}
                open={modal.open}
                title={modal.title}
                id={info?.id}
                scene={modal.scene}
                userType={modal.userType}
                onClose={onDrawerClose} />
            <UserCreateIdentity
                x-if={modal.scene === 'identity'}
                open={modal.open}
                title={modal.title}
                id={info?.id}
                onClose={onDrawerClose} />
        </PageContainer>
    )
}