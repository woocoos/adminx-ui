import { CaptFieldRef, LoginForm, ProFormCaptcha } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default (props: {
    onSuccess: () => void
    onChangeMode: () => void
}) => {

    const { t } = useTranslation(),
        captchaRef = useRef<CaptFieldRef | null | undefined>(),

        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true);

    const onFinish = async (values: { code: string }) => {
        setSaveLoading(true)
        // todo
        props.onSuccess();
        setSaveLoading(false)
        return false
    }
    return <>
        <LoginForm
            title={t("Mailbox authentication")}
            subTitle={t("pwd_step_0_email_title_{{field}}", { field: "xxx" })}
            submitter={{
                searchConfig: {
                    submitText: t('confirm')
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
            <ProFormCaptcha
                fieldRef={captchaRef}
                name="code"
                label={t("verification code")}
                placeholder={`${t("Please enter {{field}}", { field: t('verification code') })}`}
                rules={[
                    {
                        required: true,
                        message: `${t("Please enter {{field}}", { field: t('verification code') })}`,
                    },
                ]}
                onGetCaptcha={() => {
                    return new Promise((resolve, reject) => {
                        resolve();
                    });
                }}
            />
            <div style={{ marginBottom: 24, }} >
                <a style={{ float: "right" }} onClick={() => props.onChangeMode()}>
                    {t("pwd_step_0_ther")}
                </a>
            </div>
        </LoginForm>
    </>
}