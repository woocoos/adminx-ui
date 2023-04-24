import InputAccount from '@/pages/account/components/inputAccount';
import { OrgRole, OrgRoleKind, createOrgRole, getOrgRoleInfo, updateOrgRole } from '@/services/org/role';
import { User } from '@/services/user';
import { formatTreeData } from '@/util';
import { TreeEditorAction } from '@/util/type';
import {
    DrawerForm,
    ProFormText,
    ProFormTextArea,
    ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Input } from 'antd';
import { useEffect, useState } from "react";

export default (props: {
    open?: boolean
    title?: string
    id?: string
    orgId: string,
    kind: OrgRoleKind
    onClose?: (isSuccess?: boolean) => void
}) => {

    const [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [owner, setOwner] = useState<User>()

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
            <ProFormText name="name" label="名称"
                rules={[
                    { required: true, message: "请输入名称", },
                ]} />
            <ProFormTextArea
                name="comments"
                label="备注"
                placeholder="请输入备注"
            />
        </DrawerForm>
    );
}