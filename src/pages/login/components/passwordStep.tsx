import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button, List, Result, Steps } from "antd";
import VerifyEmail from "./verifyEmail";
import VerifyMfa from "./verifyMfa";
import SetPassword from "./setPassword";
import { Link } from "@ice/runtime";

export default () => {
    const { t } = useTranslation(),
        [mode, setMode] = useState<"email" | "mfa">(),
        [step, setStep] = useState<number>(0)


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
                        <List.Item actions={[
                            <a onClick={() => setMode('email')}>
                                {t("pwd_step_0_btn")}
                            </a>
                        ]}>
                            <List.Item.Meta
                                title={t("Mailbox authentication")}
                                description={t('pwd_step_0_email_des')}
                            />
                        </List.Item>
                        <List.Item actions={[
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
                        onChangeMode={() => {
                            setMode(undefined);
                        }}
                        onSuccess={() => {
                            setStep(1)
                        }}
                    />
                    <VerifyMfa
                        x-if={mode === 'mfa'}
                        onChangeMode={() => {
                            setMode(undefined);
                        }}
                        onSuccess={() => {
                            setStep(1)
                        }}
                    />
                </div>
                <SetPassword
                    x-if={step === 1}
                    onSuccess={() => {
                        setStep(2)
                    }}
                />
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