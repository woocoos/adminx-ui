import { unbindMfa } from "@/services/basis"
import { User } from "@/services/user"
import { ModalForm, ProFormText } from "@ant-design/pro-components"
import { Alert } from "antd"
import { useState } from "react"
import { useTranslation } from "react-i18next"


export default (props: {
    open: boolean
    userInfo: User
    onClose: (isSuccess?: boolean) => void
}) => {
    const { t } = useTranslation(),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true)

    const onFinish = async (values) => {
        setSaveLoading(true)
        const result = await unbindMfa(values.code)
        debugger;
        setSaveLoading(false)
        return false
    }

    return <ModalForm
        title={`${t('unbind')} MFA`}
        open={props.open}
        width={500}
        submitter={{
            searchConfig: {
                submitText: t('submit'),
                resetText: t('cancel')
            },
            submitButtonProps: {
                loading: saveLoading,
                disabled: saveDisabled,
            }
        }}
        onFinish={onFinish}
        onValuesChange={() => {
            setSaveDisabled(false)
        }}
        onOpenChange={(open) => {
            if (!open) {
                props.onClose()
            }
        }}
    >
        <br />
        <Alert showIcon message={t('Please obtain a dynamic MFA code from the Microsoft Authenticator or Google Authenticator application to authenticate your identity')} />
        <br />
        <div style={{ width: "80%", margin: "0 auto" }}>
            <ProFormText name="code" label={t("security code")}
                rules={[
                    { required: true, message: `${t("Please enter {{field}}", { field: t("security code") })}`, },
                ]}
            />
        </div>
        <br />
        <br />
        <div style={{ textAlign: "center", color: "rgba(0, 0, 0, 0.45)" }}>{t('To ensure that it is you, please verify your identity through the MFA')}</div>
        <br />
        <br />
    </ModalForm>
}