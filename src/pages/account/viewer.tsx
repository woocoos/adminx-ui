import {
    PageContainer,
    ProCard,
    ProDescriptions,
    useToken,
} from "@ant-design/pro-components";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import defaultAvatar from "@/assets/images/default-avatar.png";
import { useSearchParams } from "ice";
import { useEffect, useState } from "react";
import { Button, Divider } from "antd";
import UserCreate from "./components/create";
import { UpdateUserInfoScene, User, UserType, getUserInfo } from "@/services/user";

export default () => {
    const { token } = useToken(),
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
            setModal({ open: false, title: '', scene: "base", userType: "member" })
        },
        getRequest = async () => {
            if (id) {
                setLoading(true)
                const info = await getUserInfo(id, ['loginProfile'])
                if (info?.id) {
                    setInfo(info)
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
                title: "用户详情",
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: "系统配置", },
                        { title: "账户管理", },
                        { title: "用户详情", },
                    ],
                },
            }}
        >
            <ProCard loading={loading} >
                <ProDescriptions title="基本信息" column={2} extra={
                    <Button onClick={() => setModal({ open: true, title: '修改基本信息', scene: "base", userType: info?.userType || 'member' })}>修改</Button>
                }>
                    <ProDescriptions.Item label=""
                        valueType={{ type: 'image', width: 120 }}
                        style={{ width: "140px" }}
                    >
                        {defaultAvatar}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="" >
                        <ProDescriptions column={2}>
                            <ProDescriptions.Item label="显示名称"  >
                                {info?.displayName}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label="手机"  >
                                {info?.mobile}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label="邮箱">
                                {info?.email}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label="创建时间" valueType="dateTime" >
                                {info?.createdAt}
                            </ProDescriptions.Item>
                            <ProDescriptions.Item label="简介"  >
                                {info?.comments}
                            </ProDescriptions.Item>
                        </ProDescriptions>
                    </ProDescriptions.Item>

                </ProDescriptions>
                <Divider style={{ margin: "0 0 24px 0" }} />
                <ProDescriptions title="登陆设置" column={3} extra={
                    <Button onClick={() =>
                        setModal({ open: true, title: '登陆设置', scene: "loginProfile", userType: info?.userType || 'member' })
                    }>
                        修改
                    </Button>
                }>
                    <ProDescriptions.Item label="最后登录IP"  >
                        {info?.loginProfile?.lastLoginIP || '-'}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="最后登陆时间" valueType="dateTime">
                        {info?.loginProfile?.lastLoginAt}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="允许密码登陆"  >
                        {info?.loginProfile?.canLogin ? '是' : '否'}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="下次登陆重置密码"  >
                        {info?.loginProfile?.passwordReset ? '是' : '否'}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="设备认证"  >
                        {info?.loginProfile?.verifyDevice ? '是' : '否'}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="多因素验证"  >
                        {info?.loginProfile?.mfaEnabled ? '是' : '否'}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="多因素验证状态" valueEnum={{
                        active: { text: "活跃", status: 'success' },
                        inactive: { text: "失活", status: 'default' },
                        processing: { text: "处理中", status: 'warning' }
                    }}>
                        {info?.loginProfile?.mfaStatus}
                    </ProDescriptions.Item>
                </ProDescriptions>
                {/* <Divider style={{ margin: "0 0 24px 0" }} />
                <ProDescriptions title="登录账号" column={3} extra={
                    <Button onClick={() =>
                        setModal({ open: true, title: '修改登录账号' })
                    }>
                        修改
                    </Button>
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
                </ProDescriptions> */}
            </ProCard>

            <UserCreate
                open={modal.open}
                title={modal.title}
                id={id}
                scene={modal.scene}
                userType={modal.userType}
                onClose={onDrawerClose} />
        </PageContainer>
    )
}