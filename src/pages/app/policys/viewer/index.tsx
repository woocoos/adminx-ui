import { createAppPolicy, getAppPolicyInfo, updateAppPolicy } from '@/services/adminx/app/policy';
import { PageContainer, ProCard, ProForm, ProFormInstance, ProFormSwitch, ProFormText, useToken } from '@ant-design/pro-components';
import { message } from 'antd';
import { Link, useSearchParams } from '@ice/runtime';
import { useEffect, useRef, useState } from 'react';
import PolicyRules from './components/policyRules';
import { getAppActionList } from '@/services/adminx/app/action';
import { getAppInfo } from '@/services/adminx/app';
import { useTranslation } from 'react-i18next';
import { checkAuth } from '@/components/auth';
import { useAuth } from 'ice';
import { App, AppAction, AppPolicy, AppPolicySimpleStatus, PolicyRule } from '@/generated/adminx/graphql';
import { updateFormat } from '@/util';
import { useLeavePrompt } from '@knockout-js/layout';

type ProFormData = {
  name: string;
  comments?: string;
  autoGrant: boolean;
};

export default () => {
  const { token } = useToken(),
    [auth] = useAuth(),
    { t } = useTranslation(),
    [searchParams, setSearchParams] = useSearchParams(),
    formRef = useRef<ProFormInstance>(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [appInfo, setAppInfo] = useState<App>(),
    [appPolicyInfo, setAppPolicyInfo] = useState<AppPolicy>(),
    [rules, setRules] = useState<PolicyRule[]>([]),
    [appActions, setAppActions] = useState<AppAction[]>([]),
    [, setLeavePromptWhen] = useLeavePrompt(),
    policyId = searchParams.get('id');

  useEffect(() => {
    setLeavePromptWhen(saveDisabled);
  }, [saveDisabled]);

  const
    isReadonly = () => {
      if (policyId) {
        // 编辑
        return !checkAuth('updateAppPolicy', auth);
      } else {
        // 新建
        return !checkAuth('createAppPolicy', auth);
      }
    },
    getBase = async (appId: string) => {
      const appResult = await getAppInfo(appId);
      if (appResult?.id) {
        const result = await getAppActionList(appResult.id, {
          pageSize: 9999,
        });
        if (result?.totalCount) {
          setAppActions(result.edges?.map(item => item?.node) as AppAction[]);
        }
        setAppInfo(appResult as App);
      }
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    getRequest = async () => {
      setSaveLoading(false);
      setSaveDisabled(true);
      if (policyId) {
        const result = await getAppPolicyInfo(policyId);
        if (result?.id) {
          setRules(result.rules as PolicyRule[] || []);
          getBase(result.appID || '');
          setAppPolicyInfo(result as AppPolicy);
          return result;
        }
      } else {
        const appId = searchParams.get('appId');
        if (appId) {
          getBase(appId);
        }
      }
      return {};
    },
    verifyRules = () => {
      let errMsg = '';
      if (appInfo) {
        // const appCode = appInfo.code;
        if (rules.length) {
          for (let idx in rules) {
            const item = rules[idx];
            if (!item.actions?.length) {
              errMsg = t('required_operation');
            }
            if (errMsg.length) {
              break;
            }
          }
        }
      } else {
        errMsg = t('required_app');
      }
      if (errMsg) {
        message.warning(errMsg);
      }
      return errMsg;
    },
    onFinish = async (values: ProFormData) => {
      if (verifyRules()) {
        return;
      }
      let id: string | null = null;
      setSaveLoading(true);
      if (policyId) {
        const result = await updateAppPolicy(policyId, updateFormat({
          name: values.name,
          autoGrant: values.autoGrant,
          comments: values.comments,
          rules: rules,
        }, appPolicyInfo || {}));
        if (result?.id) {
          id = result.id;
        }
      } else {
        const appId = searchParams.get('appId');
        if (appId) {
          const result = await createAppPolicy(appId, {
            name: values.name,
            rules: rules,
            appID: appId,
            autoGrant: values.autoGrant,
            comments: values.comments,
            status: AppPolicySimpleStatus.Active,
          });
          if (result?.id) {
            id = result.id;
          }
        }
      }

      if (id) {
        message.success(t('submit_success'));
        if (!policyId) {
          setSearchParams({ id: id });
        }
        await getRequest();
      }
      setSaveLoading(false);
    };


  return (
    <PageContainer
      header={{
        title: `${policyId ? t('policy_detail') : t('create_policy')}`,
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: <Link to={'/system/app'}>{t('app_manage')}</Link> },
            { title: <Link to={`/app/policys?id=${appInfo?.id}`}>{t('policy')}</Link> },
            { title: `${policyId ? t('policy_detail') : t('create_policy')}` },
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
          submitter={isReadonly() ? false : {
            searchConfig: {
              submitText: t('submit'),
              resetText: t('reset'),
            },
            submitButtonProps: {
              loading: saveLoading,
              disabled: saveDisabled,
            },
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
            placeholder={`${t('please_enter_name')}`}
            rules={[
              { required: true, message: `${t('please_enter_name')}` },
            ]}
          />
          <ProFormText
            colProps={{ md: 12 }}
            name="comments"
            label={t('remarks')}
            placeholder={`${t('please_enter_remarks')}`}
          />
          <ProFormSwitch
            colProps={{ md: 6 }}
            name="autoGrant"
            label={t('auto_grant')}
          />
          <ProFormText>
            {appInfo ? <PolicyRules
              rules={rules}
              readonly={isReadonly()}
              onChange={(rules) => {
                setRules([...rules]);
                onValuesChange();
              }}
              appInfo={appInfo}
              appActions={appActions}
            /> : ''}
          </ProFormText>


        </ProForm>
      </ProCard>
    </PageContainer>
  );
};
