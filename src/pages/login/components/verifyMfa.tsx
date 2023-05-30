import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default (props: {
    onSuccess: () => void
    onChangeMode: () => void
}) => {

    const { t } = useTranslation(),

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
            title={t("MFA verification")}
            subTitle={t("pwd_step_0_mfa_sub_title")}
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
            <ProFormText
                name="code"
                label={t("security code")}
                placeholder={`${t("Please enter {{field}}", { field: t('security code') })}`}
                rules={[
                    {
                        required: true,
                        message: `${t("Please enter {{field}}", { field: t('security code') })}`,
                    },
                ]}
            />
            <div style={{ marginBottom: 24, }} >
                <a style={{ float: "right" }} onClick={() => props.onChangeMode()}>
                    {t("pwd_step_0_ther")}
                </a>
            </div>
        </LoginForm>
    </>
}