import { LoginForm, ProFormInstance, ProFormText } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default (props: {
    onSuccess: () => void
}) => {

    const { t } = useTranslation(),
        formRef = useRef<ProFormInstance>(),
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
            formRef={formRef}
            title={t("Set new password")}
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
            <ProFormText.Password
                name="password"
                label={t("new password")}
                fieldProps={{ "autocomplete": "new-password" } as any}
                placeholder={`${t("Please enter {{field}}", { field: t("new password") })}`}
                rules={[
                    {
                        required: true,
                        message: `${t("Please enter {{field}}", { field: t("new password") })}`,
                    },
                ]}
            />
            <ProFormText.Password
                name="confirmPassword"
                label={t('confirm new password')}
                fieldProps={{ "autocomplete": "new-password" } as any}
                placeholder={`${t("Please enter {{field}}", { field: t("confirm new password") })}`}
                rules={[
                    {
                        required: true,
                        message: `${t("Please enter {{field}}", { field: t("confirm new password") })}`,
                    },
                    {
                        validator: (rule, value) => {
                            if (value != formRef?.current?.getFieldValue("password")) {
                                return Promise.reject(t("confirm the new password must be the same as the new password"));
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
            />
        </LoginForm>
    </>
}