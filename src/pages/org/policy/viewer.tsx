import {
    PageContainer, ProCard, ProForm,
    ProFormInstance,
    ProFormText, ProFormTextArea, useToken
} from "@ant-design/pro-components";
import { message } from "antd";
import { useSearchParams } from "@ice/runtime";
import { useEffect, useRef, useState } from "react";
import PolicyRules from "../components/policyRules";
import { Org, getOrgInfo } from "@/services/org";
import { PolicyRule } from "@/services/app/policy";
import { OrgPolicy, createOrgPolicy, getOrgPolicyInfo, updateOrgPolicy } from "@/services/org/policy";
import { useTranslation } from "react-i18next";

export default () => {
    const { token } = useToken(),
        { t } = useTranslation(),
        [searchParams, setSearchParams] = useSearchParams(),
        formRef = useRef<ProFormInstance>(),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [orgInfo, setOrgInfo] = useState<Org>(),
        [rules, setRules] = useState<PolicyRule[]>([]),
        policyId = searchParams.get('id')

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
                const orgId = searchParams.get('orgId')
                if (orgId) {
                    getBase(orgId)
                }
            }
            return {}
        },
        verifyRules = () => {
            let errMsg = '';
            if (rules.length) {
                for (let i in rules) {
                    const item = rules[i];
                    let appCode: string = '';
                    if (item.actions.length) {
                        appCode = item.actions[0].split(':')[0]
                        const action = item.actions.find(key => key.split(':')[0] != appCode)
                        if (action) {
                            errMsg = t("{{field}} mismatch", { field: t("app code") })
                        }
                    } else {
                        errMsg = t('this {{field}} is required', { field: t('operation') })
                    }
                    if (item.resources.length) {
                        const resources = item.resources.find(key => key.split(':')[0] != appCode)
                        if (resources) {
                            errMsg = t("{{field}} mismatch", { field: t("app code") })
                        }

                    } else {
                        errMsg = t('this {{field}} is required', { field: t('resources') })
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
            if (verifyRules()) {
                return;
            }
            let result: OrgPolicy | null;
            setSaveLoading(true)
            if (policyId) {
                values.rules = rules
                result = await updateOrgPolicy(policyId, values)
            } else {
                values.rules = rules
                values.orgID = orgInfo?.id || ''
                result = await createOrgPolicy(values)
            }

            if (result?.id) {
                message.success(t('submit success'));
                if (!policyId) {
                    setSearchParams({ id: result.id })
                }
                await getRequest()
            }
            setSaveLoading(false)
        }



    return (
        <PageContainer
            header={{
                title: `${policyId ? t('policy') : t("create {{field}}", { field: t('policy') })}`,
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: t('System configuration'), },
                        { title: t("{{field}} management", { field: t('organization') }), },
                        { title: t('policy'), },
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
                        searchConfig: {
                            submitText: t('submit'),
                            resetText: t('reset')
                        },
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
                        label={t('name')}
                        placeholder={`${t("Please enter {{field}}", { field: t('name') })}`}
                        rules={[
                            { required: true, message: `${t("Please enter {{field}}", { field: t('name') })}`, },
                        ]}
                    />
                    <ProFormText>
                        <ProFormTextArea
                            colProps={{ md: 12 }}
                            name="comments"
                            label={t('remarks')}
                            placeholder={`${t("Please enter {{field}}", { field: t('remarks') })}`}
                        />
                    </ProFormText>
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

                </ProForm>
            </ProCard>
        </PageContainer>
    );
}