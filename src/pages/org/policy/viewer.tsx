import {
    PageContainer, ProCard, ProForm,
    ProFormInstance,
    ProFormText, ProFormTextArea, useToken
} from "@ant-design/pro-components";
import { message } from "antd";
import { useSearchParams } from "ice";
import { useEffect, useRef, useState } from "react";
import PolicyRules from "../components/policyRules";
import { Org, getOrgInfo } from "@/services/org";
import { PolicyRule } from "@/services/app/policy";
import { OrgPolicy, createOrgPolicy, getOrgPolicyInfo, updateOrgPolicy } from "@/services/org/policy";

export default () => {
    const { token } = useToken(),
        [searchParams, setSearchParams] = useSearchParams(),
        formRef = useRef<ProFormInstance>(),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [orgInfo, setOrgInfo] = useState<Org>(),
        [rules, setRules] = useState<PolicyRule[]>([]),
        policyId: string = searchParams.get('id')

    const
        getBase = async (orgId: string) => {
            const info = await getOrgInfo(orgId)
            if (info?.id) {
                setOrgInfo(info)
            }
        },
        onValuesChange = () => {
            setSaveDisabled(false)
        },
        getRequest = async () => {
            setSaveLoading(false)
            setSaveDisabled(true)
            if (policyId) {
                const result = await getOrgPolicyInfo(policyId)
                if (result?.id) {
                    setRules(result.rules || [])
                    getBase(result.orgID)
                    return result
                }
            } else {
                getBase(searchParams.get('orgId'))
            }
            return {}
        },
        verifyRules = () => {
            let errMsg = '';
            if (rules.length) {
                for (let i in rules) {
                    const item = rules[i];
                    if (item.actions.length) {
                        const appCode = item.actions[0].split(':')[0]
                        const action = item.actions.find(key => key.split(':')[0] != appCode)
                        if (action) {
                            errMsg = '有操作的应用不是统一'
                        }
                    } else {
                        errMsg = '有操作未选择'
                    }
                    if (errMsg.length) {
                        break;
                    }
                }
            }
            if (errMsg) {
                message.warning(errMsg)
            }
            return errMsg
        },
        onFinish = async (values: OrgPolicy) => {
            let result: OrgPolicy | null;
            if (verifyRules()) {
                return;
            }
            // setSaveLoading(true)
            // if (policyId) {
            //     values.rules = rules
            //     result = await updateOrgPolicy(policyId, values)
            // } else {
            //     values.rules = rules
            //     values.orgID = orgInfo?.id || ''
            //     result = await createOrgPolicy(values)
            // }

            // if (result?.id) {
            //     message.success("操作成功");
            //     if (!policyId) {
            //         setSearchParams({ id: result.id })
            //     }
            //     await getRequest()
            // }
            // setSaveLoading(false)
        }



    return (
        <PageContainer
            header={{
                title: `${policyId ? "" : "创建"}权限策略`,
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: "系统配置", },
                        { title: "组织管理", },
                        { title: "权限策略", },
                    ],
                },
            }}
        >
            <ProCard>
                <ProForm
                    layout="vertical"
                    grid
                    formRef={formRef}
                    submitter={{
                        submitButtonProps: {
                            loading: saveLoading,
                            disabled: saveDisabled,
                        }
                    }}
                    rowProps={{ gutter: 20 }}
                    onFinish={onFinish}
                    onReset={getRequest}
                    request={getRequest}
                    onValuesChange={onValuesChange}
                >
                    <ProFormText
                        colProps={{ md: 6 }}
                        name="name"
                        label="名称"
                        placeholder="请输入名称"
                        rules={[
                            { required: true, message: "请输入名称", },
                        ]}
                    />
                    <ProFormText>
                        {orgInfo?.id ? <PolicyRules
                            orgId={orgInfo?.id}
                            rules={rules}
                            onChange={(rules) => {
                                setRules([...rules])
                                onValuesChange()
                            }}
                        /> : ''}
                    </ProFormText>
                    <ProFormTextArea
                        colProps={{ md: 12 }}
                        name="comments"
                        label="描述（选填）"
                        placeholder="请输入描述"
                    />
                </ProForm>
            </ProCard>
        </PageContainer>
    );
}