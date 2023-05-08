import store from "@/store"
import { PageContainer, ProCard, ProDescriptions, ProForm, ProFormText, useToken } from "@ant-design/pro-components"
import { Link, history } from "@ice/runtime"
import { Alert, Divider, QRCode, Result, message } from "antd"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { MfaPrepare, bindMfa, bindPrepareMfa } from "@/services/basis"
import { clearInterval } from "timers"
import { User, getUserInfo } from "@/services/user"

export default () => {

    const { t } = useTranslation(),
        { token } = useToken(),
        countdownFn = useRef<NodeJS.Timeout>(),
        [loading, setLoading] = useState(false),
        [info, setInfo] = useState<User>(),
        [mfaInfo, setMfaInfo] = useState<MfaPrepare>(),
        [basisState] = store.useModel("basis"),
        [qrcodeValue, setQrcodeValue] = useState<string>(""),
        [qrcodeLoading, setQrcodeLoading] = useState(false),
        [surplus, setSurplus] = useState(0),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true)



    const
        getRequest = async () => {
            if (basisState.user?.id) {
                setLoading(true)
                const result = await getUserInfo(basisState.user.id, ["loginProfile"])
                if (result?.id) {
                    setInfo(result)
                    if (!result.loginProfile?.mfaEnabled) {
                        await onRefresh()
                    }
                }
            }
            setLoading(false)
        },
        onRefresh = async () => {
            setQrcodeLoading(true)
            const result = await bindPrepareMfa();
            if (result.stateToken) {
                setMfaInfo(result)
                countdown(result.stateTokenTTL);
                setQrcodeValue(`/api/login/mfaqr.png?userId=${basisState.user.id}&secret=${result.secret}`)
            }
            setQrcodeLoading(false)
        },
        countdown = (time: number) => {
            setSurplus(time)
            if (time <= 0) {
                clearTimeout(countdownFn.current)
            } else {
                countdownFn.current = setTimeout(() => {
                    countdown(time - 1)
                }, 1000)
            }
        },
        onFinish = async (value: { code: string }) => {
            if (mfaInfo) {
                setSaveLoading(true)
                const result = await bindMfa(mfaInfo.stateToken, value.code)
                if (result) {
                    message.success(t('submit success'))
                    history?.push("/user/safety")
                }
            }

            setSaveLoading(false)
            return false;
        }

    useEffect(() => {
        getRequest()

        return () => {
            clearTimeout(countdownFn.current)
        }
    }, [])

    return <PageContainer
        header={{
            title: t("binding virtual MFA"),
            style: { background: token.colorBgContainer },
            breadcrumb: {
                items: [
                    { title: t("Individual center"), },
                    { title: t('security setting'), },
                    { title: t('binding virtual MFA'), },
                ],
            },
        }}
    >
        <ProCard loading={loading} split="horizontal">
            <div x-if={mfaInfo} style={{ padding: "16px 24px" }}>
                <Alert showIcon message={t('You will need to install the MFA application on your phone to bind. Microsoft Authenticator or Google Authenticator is recommended. You can go to App Market to search for download and install')} />
                <br />
                <ProCard split="vertical">
                    <ProCard colSpan={12}>
                        <ProCard
                            tabs={{
                                items: [
                                    {
                                        label: t('scanning binding'),
                                        key: 'scanning',
                                        children: <div style={{ textAlign: "center" }}>
                                            <ProCard >
                                                <QRCode
                                                    style={{ margin: '0 auto' }}
                                                    status={qrcodeLoading ? 'loading' : surplus <= 0 ? "expired" : "active"}
                                                    value={qrcodeValue}
                                                    onRefresh={onRefresh}
                                                />
                                                <br />
                                                <div>
                                                    {t('account number')}：{mfaInfo?.principalName}
                                                </div>
                                                <br />
                                                <br />
                                                <div>
                                                    {t('Use the MFA application to scan the code. If the application has a device with the same name, delete the device and scan the code again')}
                                                </div>
                                            </ProCard>
                                        </div>
                                    },
                                    {
                                        label: t('manual binding'),
                                        key: 'manual',
                                        children: <div style={{ textAlign: "center" }}>
                                            <ProCard >
                                                <h3>
                                                    {t('Authentication information')}
                                                </h3>
                                                <div>
                                                    {t('account number')}：{mfaInfo?.principalName}
                                                </div>
                                                <div>
                                                    {t('secret key')}：{mfaInfo?.secret}
                                                </div>
                                                <br />
                                                <div>
                                                    {t('Please manually copy the account key to the MFA application to add to obtain the security code')}
                                                </div>
                                            </ProCard>
                                        </div>
                                    }
                                ]
                            }}
                        />
                    </ProCard>
                    <ProCard colSpan={12}>
                        <div style={{ maxWidth: "400px", margin: '80px auto 0 auto' }}>
                            <h3 style={{ textAlign: "center" }}>
                                {t('Bind the virtual MFA device')}
                            </h3>
                            <Alert showIcon message={t('Complete the binding within {{total}}s, with {{surplus}}s remaining', { total: mfaInfo?.stateTokenTTL, surplus: surplus })} />
                            <br />
                            <div>
                                {t('Enter the security code displayed by the MFA application after scanning the code')}
                            </div>
                            <br />
                            <ProForm
                                submitter={{
                                    searchConfig: {
                                        submitText: t('binding')
                                    },
                                    submitButtonProps: {
                                        loading: saveLoading,
                                        disabled: saveDisabled,
                                        block: true
                                    },
                                    render(props, dom) {
                                        return [dom[1]]
                                    },
                                }}
                                onFinish={onFinish}
                                onValuesChange={() => {
                                    setSaveDisabled(false)
                                }}
                            >
                                <ProFormText
                                    name="code"
                                    label={t('security code')}
                                    rules={[
                                        { required: true, message: `${t("Please enter {{field}}", { field: t("security code") })}`, },
                                    ]}
                                />
                            </ProForm>
                        </div>
                    </ProCard>
                </ProCard>
            </div>
            <div x-if={info?.loginProfile?.mfaEnabled}>
                <Result
                    status="success"
                    title={`${t("Binding completed")}`}
                    subTitle=""
                    style={{ marginBottom: 16 }}
                />
            </div>
        </ProCard>
    </PageContainer >
}