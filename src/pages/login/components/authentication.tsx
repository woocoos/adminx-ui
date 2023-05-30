import { ProFormText, LoginForm } from "@ant-design/pro-form";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Link } from "@ice/runtime";
import { CaptchaRes, ForgetPwdBeginRes, captcha, forgetPwdBegin } from "@/services/basis";

export default (
    props: {
        onSuccess(token: ForgetPwdBeginRes): void
    }
) => {
    const { t } = useTranslation(),
        [captchaInfo, setCaptchaInfo] = useState<CaptchaRes>(),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true);

    const
        getCaptcha = async () => {
            setCaptchaInfo(await captcha())
        },
        onFinish = async (values: { username: string, captcha: string }) => {
            if (captchaInfo) {
                setSaveLoading(true)
                const result = await forgetPwdBegin(values.username, values.captcha, captchaInfo?.captchaId)
                if (result?.stateToken) {
                    props.onSuccess(result)
                }
                setSaveLoading(false)
            }
            return false
        }

    useEffect(() => {
        getCaptcha()
    }, [])

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
                name="username"
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
                    addonAfter: <img src={captchaInfo?.captchaImage} height="32px" onClick={() => {
                        getCaptcha()
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