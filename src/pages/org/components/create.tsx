import InputAccount from '@/pages/account/components/inputAccount';
import { Org, OrgKind, createOrgInfo, getOrgInfo, getOrgList, updateOrgInfo } from '@/services/org';
import { User } from '@/services/user';
import { formatTreeData } from '@/util';
import { TreeEditorAction } from '@/util/type';
import {
    DrawerForm,
    ProFormText,
    ProFormTextArea,
    ProFormTreeSelect,
} from '@ant-design/pro-components';
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

type SelectTreeData = {
    value: string
    title: string
    parentId?: string
    children?: SelectTreeData[]
}

export default (props: {
    open?: boolean
    title?: string
    id?: string
    kind: OrgKind
    scene?: TreeEditorAction
    onClose?: (isSuccess?: boolean) => void
}) => {

    const { t } = useTranslation(),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [owner, setOwner] = useState<User>()

    const
        parentRequest = async () => {
            const result = await getOrgList({}, {}, {}),
                list: SelectTreeData[] = [
                    {
                        value: "0", title: t("top organization"), children: []
                    }
                ]
            if (result) {
                list[0].children = formatTreeData(
                    result.edges.map(item => {
                        return {
                            value: item.node.id,
                            parentId: item.node.parentID,
                            title: item.node.name,
                        }
                    })
                    , undefined, { key: 'value', parentId: "parentId", children: 'children' })
            } else {
            }
            return list
        },
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
                const orgInfo = await getOrgInfo(props.id)
                if (orgInfo?.id) {
                    switch (props.scene) {
                        case "editor":
                            result = orgInfo
                            setOwner(orgInfo.owner)
                            break;
                        case "peer":
                            result = { parentID: orgInfo.parentID }
                            setOwner(undefined)
                            break;
                        case "child":
                            result = { parentID: orgInfo.id }
                            setOwner(undefined)
                            break;
                        default:
                            break;
                    }
                }
            }
            return result
        },
        onValuesChange = () => {
            setSaveDisabled(false)
        },
        onFinish = async (values: Org) => {
            setSaveLoading(true)
            let result: Org | null = null;
            if (owner) {
                values.ownerID = owner.id
            }
            switch (props.scene) {
                case "editor":
                    result = props.id ? await updateOrgInfo(props.id, values) : await createOrgInfo(values, props.kind)
                    break;
                case "peer":
                    result = await createOrgInfo(values, props.kind)
                    break;
                case "child":
                    result = await createOrgInfo(values, props.kind)
                    break;
                default:
                    break;
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
                    resetText: t('reset')
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
            <ProFormTreeSelect name="parentID" label={t('parent organization')}
                disabled={!!props.id}
                request={parentRequest} rules={[
                    { required: true, message: `${t("Please enter {{field}}", { field: t("parent organization") })}`, },
                ]} />
            <ProFormText name="domain" label={t('domain')} tooltip={t('The domain cannot be modified at will. Otherwise, the user login account will be changed')} />
            <ProFormText name="countryCode" label={t('country/region')} />
            <ProFormText label={t('manage account')} tooltip={t('The Settings cannot be modified')} >
                <InputAccount value={owner}
                    userType="account"
                    onChange={(value) => {
                        setOwner(value)
                        onValuesChange()
                    }}
                />
            </ProFormText>
            <ProFormTextArea
                name="profile"
                label={t('description')}
                placeholder={`${t("Please enter {{field}}", { field: t("description") })}`}
            />
        </DrawerForm>
    );
}