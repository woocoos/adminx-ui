import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Button, List, Result, Steps } from "antd";
import VerifyEmail from "./verifyEmail";
import VerifyMfa from "./verifyMfa";
import SetPassword from "./setPassword";
import { Link } from "@ice/runtime";
import { ForgetPwdBeginRes } from "@/services/basis";

export default (props: {
    token: ForgetPwdBeginRes
}) => {
    const { t } = useTranslation(),
        [usableMode, setUsableMode] = useState<{
            email: string
            mfa: boolean
        }>({
            email: '',
            mfa: false
        }),
        [mode, setMode] = useState<"email" | "mfa">(),
        [step, setStep] = useState<number>(0),
        [pwdToken, setPwdToken] = useState<string>()


    useEffect(() => {

        props.token.verifies.forEach(item => {
            if (item.kind === 'email') {
                usableMode[item.kind] = item.value
            } else if (item.kind === 'mfa') {
                usableMode[item.kind] = true
            }
        })
        setUsableMode({ ...usableMode })
    }, [props.token])


    return (
        <div style={{ width: '680px' }}>
            <Steps
                current={step}
                items={[
                    { title: t("authentication") },
                    { title: t("Set new password") },
                    { title: t('complete') },
                ]}
            />
            <br />
            <div style={{ height: "300px" }}>
                <div x-if={step === 0}>
                    <div x-if={mode === undefined} style={{ padding: "20px 0" }}>
                        {t('pwd_step_0_title')}
                    </div>
                    <List x-if={mode === undefined}>
                        <List.Item x-if={usableMode.email} actions={[
                            <a onClick={() => setMode('email')}>
                                {t("pwd_step_0_btn")}
                            </a>
                        ]}>
                            <List.Item.Meta
                                title={t("Mailbox authentication")}
                                description={t('pwd_step_0_email_des')}
                            />
                        </List.Item>
                        <List.Item x-if={usableMode.mfa} actions={[
                            <a onClick={() => setMode("mfa")}>
                                {t("pwd_step_0_btn")}
                            </a>
                        ]}>
                            <List.Item.Meta
                                title={t("MFA verification")}
                                description={t("pwd_step_0_mfa_des")}
                            />
                        </List.Item>
                    </List>
                    <VerifyEmail
                        x-if={mode === 'email'}
                        token={props.token.stateToken}
                        onChangeMode={() => {
                            setMode(undefined);
                        }}
                        onSuccess={(token) => {
                            setStep(1)
                            setPwdToken(token)
                        }}
                    />
                    <VerifyMfa
                        x-if={mode === 'mfa'}
                        token={props.token.stateToken}
                        onChangeMode={() => {
                            setMode(undefined);
                        }}
                        onSuccess={(token) => {
                            setStep(1)
                            setPwdToken(token)
                        }}
                    />
                </div>
                {
                    step === 1 && pwdToken ?
                        <SetPassword
                            token={pwdToken}
                            onSuccess={() => {
                                setStep(2)
                            }}
                        />
                        : <></>
                }

                <Result
                    x-if={step === 2}
                    status="success"
                    title={t('Password reset succeeded')}
                    subTitle={t('pwd_reset_success_sub_title')}
                    extra={[
                        <Button type="primary">
                            <Link to="/login">
                                {t("go to login")}
                            </Link>
                        </Button>
                    ]}
                />
            </div>
        </div>
    );
};