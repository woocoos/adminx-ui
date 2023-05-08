import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ProFormText, LoginForm } from "@ant-design/pro-form";
import logo from "@/assets/logo.png";
import Sha256 from "crypto-js/sha256";
import { useTranslation } from "react-i18next";
import { LoginRes, login } from "@/services/basis";
import { useState } from "react";

export default (
    props: {
        onSuccess(result: LoginRes): void
    }
) => {
    const { t } = useTranslation(),
        [captchaSrc, setCaptchaSrc] = useState<string>(`/api/captcha?t=${Date.now()}`),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true);


    const onFinish = async (values) => {
        setSaveLoading(true)
        values.password = Sha256(values.password).toString();
        const result = await login(values.username, values.password, values.captcha)
        if (result && !result.errors) {
            props.onSuccess(result)
        }
        setSaveLoading(false)
        return false
    }

    return (
        <LoginForm
            title="Adminx Pro"
            logo={<img alt="logo" src={logo} />}
            subTitle={t('Management system')}
            initialValues={{
                username: "admin",
                password: "123456",
            }}
            submitter={{
                searchConfig: {
                    submitText: t('login'),
                    resetText: t('cancel')
                },
                submitButtonProps: {
                    loading: saveLoading,
                    disabled: saveDisabled,
                }
            }}
            onValuesChange={() => {
                setSaveDisabled(false)
            }}
            onFinish={onFinish}
        >
            <ProFormText
                name="username"
                fieldProps={{
                    size: "large",
                    prefix: <UserOutlined className={"prefixIcon"} />,
                }}
                placeholder={`${t("Please enter {{field}}", { field: t('principal name') })}`}
                rules={[
                    {
                        required: true,
                        message: `${t("Please enter {{field}}", { field: t('principal name') })}`,
                    },
                ]}
            />
            <ProFormText.Password
                name="password"
                fieldProps={{
                    size: "large",
                    prefix: <LockOutlined className={"prefixIcon"} />,
                }}
                placeholder={`${t("Please enter {{field}}", { field: t('password') })}`}
                rules={[
                    {
                        required: true,
                        message: `${t("Please enter {{field}}", { field: t('password') })}`,
                    },
                ]}
            />
            <ProFormText
                name="captcha"
                fieldProps={{
                    size: "large",
                    addonAfter: <img src={captchaSrc} height="32px" onClick={() => {
                        setCaptchaSrc(`/api/captcha?t=${Date.now()}`)
                    }} />,
                }}
                placeholder={`${t('verification code')}`}
                rules={[
                    {
                        required: true,
                        message: `${t("Please enter {{field}}", { field: t('verification code') })}`,
                    },
                ]}
            />
            <div
                style={{
                    marginBottom: 24,
                }}
            >
                <a
                    style={{
                        float: "right",
                    }}
                >
                    {t('forget your password')}
                </a>
            </div>
        </LoginForm>
    );
};