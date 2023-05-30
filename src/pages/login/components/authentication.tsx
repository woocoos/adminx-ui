import { ProFormText, LoginForm } from "@ant-design/pro-form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "@ice/runtime";

export default (
    props: {
        onSuccess(result: string): void
    }
) => {
    const { t } = useTranslation(),
        [captchaSrc, setCaptchaSrc] = useState<string>(`/api/captcha?t=${Date.now()}`),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true);

    const onFinish = async (values: { code: string }) => {
        setSaveLoading(true)
        props.onSuccess("token")
        setSaveLoading(false)
        return false
    }

    return (
        <LoginForm
            title={t("Retrieve password")}
            subTitle={t("please_retrieve_sub_titie")}
            submitter={{
                searchConfig: {
                    submitText: t("please_retrieve_submit")
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
                name="code"
                label={t('principal name')}
                placeholder={`${t("Please enter {{field}}", { field: t('principal name') })}`}
                rules={[
                    {
                        required: true,
                        message: `${t("Please enter {{field}}", { field: t('principal name') })}`,
                    },
                ]}
                fieldProps={{
                    size: "large"
                }}
            />
            <ProFormText
                name="captcha"
                label={t('verification code')}
                fieldProps={{
                    size: "large",
                    addonAfter: <img src={captchaSrc} height="32px" onClick={() => {
                        setCaptchaSrc(`/api/captcha?t=${Date.now()}`)
                    }} />,
                }}
                placeholder={`${t("Please enter {{field}}", { field: t('verification code') })}`}
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
                <Link style={{ float: "right", }}
                    to="/login"
                >
                    {t('go to login')}
                </Link>
            </div>
        </LoginForm>
    );
};