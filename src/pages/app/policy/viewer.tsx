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

export default () => {
    const { token } = useToken(),
        [searchParams, setSearchParams] = useSearchParams(),
        formRef = useRef<ProFormInstance>(),
        [saveLoading, setSaveLoading] = useState(false),
        [saveDisabled, setSaveDisabled] = useState(true),
        [appInfo, setAppInfo] = useState<App>(),
        [rules, setRules] = useState<PolicyRule[]>([]),
        [appActions, setAppActions] = useState<AppAction[]>([]),
        policyId: string = searchParams.get('id')

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
                getBase(searchParams.get('appId'))
            }
            return {}
        },
        onFinish = async (values: AppPolicy) => {
            let result: AppPolicy | null;
            setSaveLoading(true)
            if (policyId) {
                values.rules = rules
                result = await updateAppPolicy(policyId, values)
            } else {
                values.rules = rules
                result = await createAppPolicy(searchParams.get('appId'), values)
            }

            if (result?.id) {
                message.success("操作成功");
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
                title: `${policyId ? "" : "创建"}权限策略`,
                style: { background: token.colorBgContainer },
                breadcrumb: {
                    items: [
                        { title: "系统配置", },
                        { title: "应用管理", },
                        { title: "权限策略", },
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
                    <ProFormText
                        colProps={{ md: 6 }}
                        name="version"
                        label="版本"
                        placeholder="请输入版本"
                        rules={[
                            { required: true, message: "请输入版本", },
                        ]}
                    />
                    <ProFormSelect
                        colProps={{ md: 6 }}
                        name="status"
                        label="状态"
                        valueEnum={EnumAppPolicyStatus}
                    />
                    <ProFormSwitch
                        colProps={{ md: 6 }}
                        name="autoGrant"
                        label="自动授予" />
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
                        label="备注（选填）"
                        placeholder="请输入备注"
                    />

                </ProForm>
            </ProCard>
        </PageContainer>
    );
}