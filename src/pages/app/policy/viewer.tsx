import { AppPolicy, EnumAppPolicyStatus, PolicyRule, createAppPolicy, getAppPolicyInfo, updateAppPolicy } from "@/services/app/policy";
import {
    PageContainer, ProCard, ProForm,
    ProFormInstance,
    ProFormSwitch, ProFormText, ProFormTextArea,
    ProFormSelect,
    useToken
} from "@ant-design/pro-components";
import { message } from "antd";
import { useSearchParams } from "ice";
import { useEffect, useRef, useState } from "react";
import PolicyRules from "../components/policyRules";
import { AppAction, getAppActionList } from "@/services/app/action";
import { App, getAppInfo } from "@/services/app";
import { useTranslation } from "react-i18next";

export default () => {
    const { token } = useToken(),
        { t } = useTranslation(),
        [searchParams, setSearchParams] = useSearchParams(),
        formRef = useRef<ProFormInstance>(),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [appInfo, setAppInfo] = useState<App>(),
        [rules, setRules] = useState<PolicyRule[]>([]),
        [appActions, setAppActions] = useState<AppAction[]>([]),
        policyId = searchParams.get('id')

    const
        getBase = async (appId: string) => {
            const info = await getAppInfo(appId)
            if (info?.id) {
                setAppInfo(info)
                const result = await getAppActionList(info.id, {}, {}, {});
                if (result?.edges) {
                    setAppActions(result?.edges.map(item => item.node))
                }
            }
        },
        onValuesChange = () => {
            setSaveDisabled(false)
        },
        getRequest = async () => {
            setSaveLoading(false)
            setSaveDisabled(true)
            if (policyId) {
                const result = await getAppPolicyInfo(policyId)
                if (result?.id) {
                    setRules(result.rules || [])
                    getBase(result.appID)
                    return result
                }
            } else {
                const appId = searchParams.get('appId')
                if (appId) {
                    getBase(appId)
                }
            }
            return {}
        },
        verifyRules = () => {
            let errMsg = '';
            if (appInfo) {
                const appCode = appInfo.code;
                if (rules.length) {
                    for (let i in rules) {
                        const item = rules[i];
                        if (item.actions.length) {
                            const action = item.actions.find(key => key.split(':')[0] != appCode)
                            if (action) {
                                errMsg = t("{{field}} mismatch", { field: t("app code") })
                            }
                        } else {
                            errMsg = t('this {{field}} is required', { field: t('operation') })
                        }
                        if (errMsg.length) {
                            break;
                        }
                    }
                }
            } else {
                errMsg = t('this {{field}} is required', { field: t('app') })
            }
            if (errMsg) {
                message.warning(errMsg)
            }
            return errMsg
        },
        onFinish = async (values: AppPolicy) => {
            if (verifyRules()) {
                return;
            }
            let result: AppPolicy | null = null;
            setSaveLoading(true)
            if (policyId) {
                values.rules = rules
                result = await updateAppPolicy(policyId, values)
            } else {
                values.rules = rules
                const appId = searchParams.get('appId')
                if (appId) {
                    result = await createAppPolicy(appId, values)
                }
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
                        { title: t("{{field}} management", { field: t('app') }), },
                        { title: t('policy'), },
                    ],
                },
                extra: <></>,
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
                    <ProFormText
                        colProps={{ md: 6 }}
                        name="version"
                        label={t('version')}
                        placeholder={`${t("Please enter {{field}}", { field: t('version') })}`}
                        rules={[
                            { required: true, message: `${t("Please enter {{field}}", { field: t('version') })}`, },
                        ]}
                    />
                    <ProFormSelect
                        colProps={{ md: 6 }}
                        name="status"
                        label={t('status')}
                        valueEnum={EnumAppPolicyStatus}
                    />
                    <ProFormSwitch
                        colProps={{ md: 6 }}
                        name="autoGrant"
                        label={t('auto grant')} />
                    <ProFormText>
                        {appInfo ? <PolicyRules
                            rules={rules}
                            onChange={(rules) => {
                                setRules([...rules])
                                onValuesChange()
                            }}
                            appInfo={appInfo}
                            appActions={appActions} /> : ''}
                    </ProFormText>
                    <ProFormTextArea
                        colProps={{ md: 12 }}
                        name="comments"
                        label={t('remarks')}
                        placeholder={`${t("Please enter {{field}}", { field: t('remarks') })}`}
                    />

                </ProForm>
            </ProCard>
        </PageContainer>
    );
}