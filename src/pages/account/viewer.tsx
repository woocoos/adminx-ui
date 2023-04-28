import {
    PageContainer,
    ProCard,
    ProDescriptions,
    useToken,
} from "@ant-design/pro-components";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import defaultAvatar from "@/assets/images/default-avatar.png";
import { useSearchParams } from "ice";
import { ReactNode, useEffect, useState } from "react";
import { Button, Divider } from "antd";
import UserCreate from "./components/create";
import UserCreateIdentity from "./components/createIdentity";
import { EnumUserIdentityKind, EnumUserLoginProfileMfaStatus, UpdateUserInfoScene, User, UserType, getUserInfo } from "@/services/user";
import { useTranslation } from "react-i18next";

export default () => {
    const { token } = useToken(),
        { t } = useTranslation(),
        [searchParams, setSearchParams] = useSearchParams(),
        id = searchParams.get('id'),
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
            if (id) {
                setLoading(true)
                const info = await getUserInfo(id, ['loginProfile', "identity"])
                if (info?.id) {
                    setInfo(info)
                    setLoading(false)
                }
            }
        }, identityRender = () => {
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
                    <Button onClick={() =>
                        setModal({ open: true, title: t('amend {{field}}', { field: t("basic information") }), scene: "base", userType: info?.userType || 'member' })
                    }>
                        {t('amend')}
                    </Button>
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
                            <ProDescriptions.Item label={t('introduction')}  >
                                {info?.comments}
                            </ProDescriptions.Item>
                        </ProDescriptions>
                    </ProDescriptions.Item>
                </ProDescriptions>
                <Divider style={{ margin: "0 0 24px 0" }} />
                <ProDescriptions title={t('Login credentials')} column={3} extra={
                    <Button onClick={() =>
                        setModal({ open: true, title: t('amend {{field}}', { field: t('login credentials') }), scene: "identity", userType: info?.userType || 'member' })
                    }>
                        {t('amend')}
                    </Button>
                }>
                    {identityRender()}
                </ProDescriptions>
                <Divider style={{ margin: "0 0 24px 0" }} />
                <ProDescriptions title={t('Login Settings')} column={3} extra={
                    <Button onClick={() =>
                        setModal({ open: true, title: t('amend {{field}}', { field: t('login Settings') }), scene: "loginProfile", userType: info?.userType || 'member' })
                    }>
                        {t('amend')}
                    </Button>
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
                    <ProDescriptions.Item label={t('equipment certification')}  >
                        {info?.loginProfile?.verifyDevice ? t('yes') : t('no')}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label={t('MFA')}  >
                        {info?.loginProfile?.mfaEnabled ? t('yes') : t('no')}
                    </ProDescriptions.Item>
                </ProDescriptions>

            </ProCard>

            <UserCreate
                x-if={['base', 'loginProfile'].includes(modal.scene)}
                open={modal.open}
                title={modal.title}
                id={id}
                scene={modal.scene}
                userType={modal.userType}
                onClose={onDrawerClose} />
            <UserCreateIdentity
                x-if={modal.scene === 'identity'}
                open={modal.open}
                title={modal.title}
                id={id}
                onClose={onDrawerClose} />
        </PageContainer>
    )
}