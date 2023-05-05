import { OrgRole, getOrgRoleInfo } from "@/services/org/role"
import { PageContainer, ProCard, ProDescriptions, useToken } from "@ant-design/pro-components"
import { Button } from "antd"
import { useSearchParams } from "ice"
import { useEffect, useState } from "react"
import UserList from "@/pages/account/components/listAccount";
import CreateOrgRole from "../components/createRole";
import ListRolePermission from "../components/listRolePermission"
import { useTranslation } from "react-i18next"

export default () => {
    const { token } = useToken(),
        { t } = useTranslation(),
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
                title: info?.kind === 'role' ? t("{{field}} detail", { field: t('role') }) : t("{{field}} detail", { field: t('user group') }),
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: t('organization and cooperation'), },
                        { title: info?.kind === 'role' ? t("{{field}} detail", { field: t('role') }) : t("{{field}} detail", { field: t('user group') }) },
                    ],
                },
            }}
        >
            <ProCard loading={loading} >
                <ProDescriptions title={t("Basic information")} column={info?.kind === 'role' ? 2 : 1} extra={
                    <Button onClick={() => {
                        setModal({ open: true, title: t("amend {{field}}", { field: t("basic information") }), scene: "base" })
                    }}>
                        {t('amend')}
                    </Button>
                }>
                    <ProDescriptions.Item label={t('name')}  >
                        {info?.name}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item x-if={info?.kind === 'role'} label={t('type')}  >
                        {info?.isSystemRole ? t("system role") : t('custom role')}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item label={t('introduction')}  >
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
                            label: t("{{field}} management", { field: t('member') }),
                            key: 'member',
                            children: info ? <>
                                <UserList
                                    scene="roleUser"
                                    title={`${t("{{field}} list", { field: t('member') })}`}
                                    orgRole={info}
                                    orgId={info.orgID}
                                />
                            </> : '',
                        },
                        {
                            label: t("{{field}} management", { field: t('permission') }),
                            key: 'policy',
                            children: info ? <ListRolePermission orgRoleInfo={info} readonly={info?.isSystemRole} /> : '',
                        },
                    ],
                }}
            />
        </PageContainer>
    )
}