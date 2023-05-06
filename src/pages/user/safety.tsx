import { User, getUserInfo } from "@/services/user"
import store from "@/store"
import { PageContainer, ProCard, ProDescriptions, useToken } from "@ant-design/pro-components"
import { Link } from "@ice/runtime"
import { Divider } from "antd"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import UnbindMFA from "./components/unbindMFA"

export default () => {

    const { t } = useTranslation(),
        { token } = useToken(),
        [loading, setLoading] = useState(false),
        [info, setInfo] = useState<User>(),
        [basisState] = store.useModel("basis"),
        [modal, setModal] = useState<{
            open: boolean
        }>({
            open: false
        })

    const
        getRequest = async () => {
            if (basisState.user?.id) {
                setLoading(true)
                const result = await getUserInfo(basisState.user.id, ["loginProfile"])
                if (result?.id) {
                    setInfo(result)
                }
            }
            setLoading(false)
        }

    useEffect(() => {
        getRequest()
    }, [])

    return <PageContainer
        header={{
            title: t("security setting"),
            style: { background: token.colorBgContainer },
            breadcrumb: {
                items: [
                    { title: t("Individual center"), },
                    { title: t('security setting'), },
                ],
            },
        }}
    >
        <ProCard loading={loading}>
            <ProDescriptions title={t('Account password')} column={2} extra={
                info ? <Link to="/user/password">
                    {t('amend')}
                </Link> : ''
            }>
                <ProDescriptions.Item label={t('email')}>
                    {info?.email}
                </ProDescriptions.Item>
            </ProDescriptions>
            <Divider style={{ margin: "0 0 24px 0" }} />
            <ProDescriptions title={t('virtual MFA')} column={1} extra={
                info?.loginProfile?.mfaEnabled ? <a onClick={() => {
                    setModal({ open: true })
                }}>
                    {t('unbind')}
                </a> : <Link to="/user/bindmfa">
                    {t('binding')}
                </Link>
            }>
                <ProDescriptions.Item>
                    {
                        info?.loginProfile?.mfaEnabled ?
                            t('You have a virtual MFA bound and can use it for secondary authentication at login') :
                            t('After binding the MFA, you can use it for secondary authentication during login')
                    }
                </ProDescriptions.Item>
            </ProDescriptions>
        </ProCard>
        {
            info ? <UnbindMFA
                open={modal.open}
                userInfo={info}
                onClose={(isSuccess) => {
                    if (isSuccess) {
                        getRequest()
                    }
                    setModal({ open: false })
                }}
            /> : ''
        }

    </PageContainer>
}