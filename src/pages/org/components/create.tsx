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
import { Input } from 'antd';
import { useEffect, useState } from "react";

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

    const [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [owner, setOwner] = useState<User>()

    const
        parentRequest = async () => {
            const result = await getOrgList({}, {}, {}),
                list: SelectTreeData[] = [
                    {
                        value: "0", title: '顶级组织', children: []
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
            <ProFormTreeSelect name="parentID" label="上级组织"
                disabled={!!props.id}
                request={parentRequest} rules={[
                    { required: true, message: "请选择上级组织", },
                ]} />
            <ProFormText name="domain" label="域" tooltip="域不可随意修改,一旦修改会导致用户登录账号发生变更" />
            <ProFormText name="countryCode" label="国家/地区" />
            <ProFormText label="管理账户" tooltip="设置后不允许修改" >
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
                label="组织介绍"
                placeholder="请输入组织介绍"
            />
        </DrawerForm>
    );
}