import { setLeavePromptWhen } from '@/components/LeavePrompt';
import InputAccount from '@/pages/account/components/inputAccount';
import { OrgRole, OrgRoleKind, createOrgRole, getOrgRoleInfo, updateOrgRole } from '@/services/org/role';
import { User } from '@/services/user';
import {
    DrawerForm,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

export default (props: {
    open?: boolean
    title?: string
    id?: string
    orgId: string,
    kind: OrgRoleKind
    onClose?: (isSuccess?: boolean) => void
}) => {

    const
        { t } = useTranslation(),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true)

    setLeavePromptWhen(saveDisabled)

    const
        onOpenChange = (open: boolean) => {
            if (!open) {
                props.onClose?.()
            }
        },
        getRequest = async () => {
            setSaveLoading(false)
            setSaveDisabled(true)
            let result = {}
            if (props.id) {
                const info = await getOrgRoleInfo(props.id)
                if (info?.id) {
                    return info
                }
            }
            return result
        },
        onValuesChange = () => {
            setSaveDisabled(false)
        },
        onFinish = async (values: OrgRole) => {
            setSaveLoading(true)
            values.kind = props.kind
            let result: OrgRole | null
            if (props.id) {
                result = await updateOrgRole(props.id, values)
            } else {
                values.orgID = props.orgId
                result = await createOrgRole(values)
            }

            if (result?.id) {
                setSaveDisabled(true)
                props.onClose?.(true)
            }
            setSaveLoading(false)
            return false;
        }


    return (
        <DrawerForm
            drawerProps={{
                width: 500,
                destroyOnClose: true,
            }}
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
            title={props.title}
            open={props?.open}
            onReset={getRequest}
            request={getRequest}
            onValuesChange={onValuesChange}
            onFinish={onFinish}
            onOpenChange={onOpenChange}
        >
            <ProFormText name="name" label={t('name')}
                rules={[
                    { required: true, message: `${t("Please enter {{field}}", { field: t("name") })}`, },
                ]} />
            <ProFormTextArea
                name="comments"
                label={t('remarks')}
                placeholder={`${t("Please enter {{field}}", { field: t("remarks") })}`}
            />
        </DrawerForm>
    );
}