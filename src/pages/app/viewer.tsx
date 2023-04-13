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
import { App, getAppInfo } from "@/services/app";
import { Button, Divider } from "antd";
import AppCreate from "./components/create";

export default () => {
    const { token } = useToken(),
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
                title: "应用管理",
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: "系统配置", },
                        { title: "应用管理", },
                    ],
                },
            }}
        >
            <ProCard loading={loading} >
                <ProDescriptions title="基本信息" column={2} extra={
                    <Button onClick={() => setModal({ open: true, title: '修改基本信息' })}>修改</Button>
                }>
                    <ProDescriptions.Item label=""
                        valueType={{ type: 'image', width: 120 }}
                        style={{ width: "140px" }}
                    >
                        {appInfo?.logo || defaultApp}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="" >
                        <ProDescriptions column={2}>
                            <ProDescriptions.Item label="名称"  >
                                {appInfo?.name}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label="编码"  >
                                {appInfo?.code}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label="类型"
                                valueEnum={{
                                    "web": { text: 'web', },
                                    "native": { text: 'native', },
                                    "server": { text: 'server', },
                                }}
                            >
                                {appInfo?.kind}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label="状态"
                                valueEnum={{
                                    active: { text: "活跃", status: 'success' },
                                    inactive: { text: "失活", status: 'default' },
                                    processing: { text: "处理中", status: 'warning' }
                                }}
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
                            <ProDescriptions.Item label="描述"  >
                                {appInfo?.comments}
                            </ProDescriptions.Item>
                        </ProDescriptions>
                    </ProDescriptions.Item>

                </ProDescriptions>
                <Divider style={{ margin: "0 0 24px 0" }} />
                <ProDescriptions title="应用配置" column={2} extra={
                    <Button onClick={() => setModal({ open: true, title: '修改应用配置', scene: 'conf' })}>修改</Button>
                }>
                    <ProDescriptions.Item label="回调地址"  >
                        {appInfo?.redirectURI || '-'}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="权限范围"  >
                        {appInfo?.scopes || '-'}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="token有效期"  >
                        {typeof appInfo?.tokenValidity === 'number' ? appInfo.tokenValidity : '-'}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="refresh_token有效期"  >
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