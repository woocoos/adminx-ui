import { OrgRole, getOrgRoleInfo } from "@/services/org/role"
import { PageContainer, ProCard, ProDescriptions, useToken } from "@ant-design/pro-components"
import { Button } from "antd"
import { useSearchParams } from "ice"
import { useEffect, useState } from "react"
import UserList from "@/pages/account/list";
import CreateOrgRole from "../components/createRole";

export default () => {
    const { token } = useToken(),
        [searchParams, setSearchParams] = useSearchParams(),
        [loading, setLoading] = useState(false),
        [info, setInfo] = useState<OrgRole>(),
        [modal, setModal] = useState<{
            open: boolean,
            title: string,
            scene: "base",
        }>({
            open: false,
            title: '',
            scene: "base",
        })


    const getRequest = async () => {
        const id = searchParams.get('id')
        if (id) {
            setLoading(true)
            const info = await getOrgRoleInfo(id)
            if (info?.id) {
                setInfo(info)
            }
            setLoading(false)
        }
    },
        onDrawerClose = (isSuccess: boolean) => {
            if (isSuccess) {
                getRequest();
            }
            setModal({ open: false, title: '', scene: modal.scene })
        }

    useEffect(() => {
        getRequest()
    }, [])

    return (
        <PageContainer
            header={{
                title: info?.kind === 'role' ? "角色详情" : "用户组详情",
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: "组织协助", },
                        { title: info?.kind === 'role' ? "角色详情" : "用户组详情" },
                    ],
                },
            }}
        >
            <ProCard loading={loading} >
                <ProDescriptions title="基本信息" column={1} extra={
                    <Button onClick={() => {
                        setModal({ open: true, title: '修改基本信息', scene: "base" })
                    }}>
                        修改
                    </Button>
                }>
                    <ProDescriptions.Item label="名称"  >
                        {info?.name}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label="简介"  >
                        {info?.comments}
                    </ProDescriptions.Item>
                </ProDescriptions>

            </ProCard>
            {info ? (
                <CreateOrgRole
                    open={modal.open}
                    id={info.id}
                    orgId={info.orgID}
                    kind={info.kind}
                    onClose={onDrawerClose}
                />) : ""}
            <ProCard
                tabs={{
                    items: [
                        {
                            label: `成员管理`,
                            key: 'member',
                            children: info ? <>
                                <UserList scene="roleUser" title="成员列表" userType="member" roleId={info.id} />
                            </> : '',
                        },
                        {
                            label: `权限管理`,
                            key: 'policy',
                            children: `2`,
                        },
                    ],
                }}
            />
        </PageContainer>
    )
}