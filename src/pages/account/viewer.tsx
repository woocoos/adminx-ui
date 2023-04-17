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
                title: info?.userType === 'account' ? "账户详情" : "用户详情",
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: "系统配置", },
                        { title: info?.userType === 'account' ? "账户管理" : "用户管理", },
                        { title: info?.userType === 'account' ? "账户详情" : "用户详情", },
                    ],
                },
            }}
        >
            <ProCard loading={loading} >
                <ProDescriptions title="基本信息" column={2} extra={
                    <Button onClick={() =>
                        setModal({ open: true, title: '修改基本信息', scene: "base", userType: info?.userType || 'member' })
                    }>
                        修改
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
                <ProDescriptions title="登录凭证" column={3} extra={
                    <Button onClick={() =>
                        setModal({ open: true, title: '修改登录凭证', scene: "identity", userType: info?.userType || 'member' })
                    }>
                        修改
                    </Button>
                }>
                    {identityRender()}
                </ProDescriptions>
                <Divider style={{ margin: "0 0 24px 0" }} />
                <ProDescriptions title="登陆设置" column={3} extra={
                    <Button onClick={() =>
                        setModal({ open: true, title: '修改登陆设置', scene: "loginProfile", userType: info?.userType || 'member' })
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
                    <ProDescriptions.Item label="多因素验证状态" valueEnum={EnumUserLoginProfileMfaStatus}>
                        {info?.loginProfile?.mfaStatus}
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