import {
    PageContainer,
    ProCard,
    ProDescriptions,
    useToken,
} from "@ant-design/pro-components";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import defaultApp from "@/assets/images/default-app.png";
import { useSearchParams } from "ice";
import { useEffect, useState } from "react";
import { App, EnumAppKind, EnumAppStatus, getAppInfo } from "@/services/app";
import { Button, Divider } from "antd";
import AppCreate from "./components/create";
import { useTranslation } from "react-i18next";

export default () => {
    const { token } = useToken(),
        { t } = useTranslation(),
        [searchParams, setSearchParams] = useSearchParams(),
        id = searchParams.get('id'),
        [showEys, setShowEys] = useState(false),
        [loading, setLoading] = useState(false),
        [appInfo, setAppInfo] = useState<App>(),
        [modal, setModal] = useState<{
            open: boolean,
            title: string,
            scene?: 'conf'
        }>({
            open: false,
            title: '',
        })

    const
        onDrawerClose = (isSuccess: boolean) => {
            if (isSuccess) {
                getRequest()
            }
            setModal({ open: false, title: '', scene: undefined })
        },
        getRequest = async () => {
            if (id) {
                setLoading(true)
                const info = await getAppInfo(id)
                if (info?.id) {
                    setAppInfo(info)
                    setLoading(false)
                }
            }
        }

    useEffect(() => {
        getRequest()
    }, [])



    return (
        <PageContainer
            header={{
                title: t("{{field}} management", { field: t('app') }),
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: t('System configuration'), },
                        { title: t("{{field}} management", { field: t('app') }), },
                    ],
                },
            }}
        >
            <ProCard loading={loading} >
                <ProDescriptions title={t("Basic information")} column={2} extra={
                    <Button onClick={() => setModal({ open: true, title: t("amend {{field}}", { field: t("basic information") }) })}>修改</Button>
                }>
                    <ProDescriptions.Item label=""
                        valueType={{ type: 'image', width: 120 }}
                        style={{ width: "140px" }}
                    >
                        {appInfo?.logo || defaultApp}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="" >
                        <ProDescriptions column={2}>
                            <ProDescriptions.Item label={t('name')}  >
                                {appInfo?.name}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label={t('code')}  >
                                {appInfo?.code}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label={t('type')}
                                valueEnum={EnumAppKind}
                            >
                                {appInfo?.kind}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label={t('status')}
                                valueEnum={EnumAppStatus}
                            >
                                {appInfo?.status}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label="AppKey"  >
                                {appInfo?.appKey ? <span>{appInfo.appKey}</span> : '-'}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label="AppSecret"  >
                                {
                                    appInfo?.appSecret ?
                                        showEys ?
                                            <><span>{appInfo?.appSecret}</span><a onClick={() => setShowEys(false)}><EyeInvisibleOutlined /></a></> :
                                            <><span>**********</span><a onClick={() => setShowEys(true)}><EyeOutlined /></a></>
                                        : "-"
                                }
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label={t('description')}  >
                                {appInfo?.comments}
                            </ProDescriptions.Item>
                        </ProDescriptions>
                    </ProDescriptions.Item>

                </ProDescriptions>
                <Divider style={{ margin: "0 0 24px 0" }} />
                <ProDescriptions title={t('Application configuration')} column={2} extra={
                    <Button onClick={() => setModal({ open: true, title: t("amend {{field}}", { field: t("application configuration") }), scene: 'conf' })}>修改</Button>
                }>
                    <ProDescriptions.Item label={t('callback address')}  >
                        {appInfo?.redirectURI || '-'}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label={t('scope of authority')}  >
                        {appInfo?.scopes || '-'}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label={`token ${t('validity period')}`}  >
                        {typeof appInfo?.tokenValidity === 'number' ? appInfo.tokenValidity : '-'}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label={`refresh_token ${t('validity period')}`}  >
                        {typeof appInfo?.refreshTokenValidity === 'number' ? appInfo.refreshTokenValidity : '-'}
                    </ProDescriptions.Item>
                </ProDescriptions>
            </ProCard>

            <AppCreate
                open={modal.open}
                scene={modal.scene}
                title={modal.title}
                id={id}
                onClose={onDrawerClose} />
        </PageContainer>
    )
}