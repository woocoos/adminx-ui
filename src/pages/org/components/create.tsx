import { setLeavePromptWhen } from '@/components/LeavePrompt';
import InputAccount from '@/pages/account/components/inputAccount';
import { Org, OrgKind, createOrgInfo, getOrgInfo, getOrgList, getOrgPathList, updateOrgInfo } from '@/services/org';
import store from '@/store';
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
        [basisState] = store.useModel("basis"),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [oldInfo, setOldInfo] = useState<Org>()

    setLeavePromptWhen(saveDisabled)

    const
        parentRequest = async () => {
            const result: Org[] = [], list: SelectTreeData[] = [
                {
                    value: "0", title: t("top organization"), children: []
                }
            ]
            if (props.kind === 'root') {
                const data = await getOrgList({ kind: props.kind }, {}, {})
                if (data?.totalCount) {
                    result.push(...data.edges.map(item => item.node))
                }
            } else {
                const data = await getOrgPathList(basisState.tenantId, props.kind)
                if (data.length) {
                    result.push(...data)
                }
            }
            if (result) {
                list[0].children = formatTreeData(
                    result.map(item => {
                        return {
                            value: item.id,
                            parentId: item.parentID,
                            title: item.name,
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
            setSaveDisabled(true)
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
                            break;
                        case "peer":
                            result = { parentID: orgInfo.parentID }
                            break;
                        case "child":
                            result = { parentID: orgInfo.id }
                            break;
                        default:
                            break;
                    }
                }
            }
            setOldInfo(result as Org)
            return result
        },
        onValuesChange = () => {
            setSaveDisabled(false)
        },
        onFinish = async (values: Org) => {
            setSaveLoading(true)
            let result: Org | null = null;

            if (values.owner) {
                values.ownerID = values.owner.id
                delete values.owner
            }
            switch (props.scene) {
                case "editor":
                    if (props.id) {
                        result = await updateOrgInfo(props.id, values)
                    } else {
                        result = await createOrgInfo(values, props.kind)
                    }
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
            <ProFormTreeSelect name="parentID" label={t('parent organization')}
                disabled={!!props.id}
                request={parentRequest} rules={[
                    { required: true, message: `${t("Please enter {{field}}", { field: t("parent organization") })}`, },
                ]} />
            <ProFormText
                x-if={props.kind === 'root'}
                disabled={!!oldInfo?.domain}
                name="domain"
                label={t('domain')}
                tooltip={t('The domain cannot be modified at will. Otherwise, the user login account will be changed')}
            />
            <ProFormText
                x-if={props.kind === 'root'}
                name="countryCode"
                label={t('country/region')} />
            <ProFormText
                x-if={props.kind === 'root'}
                name="owner"
                label={t('manage account')}
                tooltip={t('The Settings cannot be modified')} >
                <InputAccount
                    disabled={!!oldInfo?.ownerID}
                    userType="account"
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