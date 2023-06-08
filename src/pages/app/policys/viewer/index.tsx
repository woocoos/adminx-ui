import { AppPolicy, PolicyRule, createAppPolicy, getAppPolicyInfo, updateAppPolicy } from '@/services/app/policy';
import { PageContainer, ProCard, ProForm, ProFormInstance, ProFormSwitch, ProFormText, useToken } from '@ant-design/pro-components';
import { message } from 'antd';
import { useSearchParams } from '@ice/runtime';
import { useRef, useState } from 'react';
import PolicyRules from './components/policyRules';
import { AppAction, getAppActionList } from '@/services/app/action';
import { App, getAppInfo } from '@/services/app';
import { useTranslation } from 'react-i18next';
import { checkAuth } from '@/components/Auth';
import { useAuth } from 'ice';
import { setLeavePromptWhen } from '@/components/LeavePrompt';

export default () => {
  const { token } = useToken(),
    [auth] = useAuth(),
    { t } = useTranslation(),
    [searchParams, setSearchParams] = useSearchParams(),
    formRef = useRef<ProFormInstance>(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [appInfo, setAppInfo] = useState<App>(),
    [rules, setRules] = useState<PolicyRule[]>([]),
    [appActions, setAppActions] = useState<AppAction[]>([]),
    policyId = searchParams.get('id');

  setLeavePromptWhen(saveDisabled);

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
      const info = await getAppInfo(appId);
      if (info?.id) {
        setAppInfo(info);
        const result = await getAppActionList(info.id, {}, {}, {});
        if (result?.edges) {
          setAppActions(result?.edges.map(item => item.node));
        }
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
          setRules(result.rules || []);
          getBase(result.appID);
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
            if (!item.actions.length) {
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
    onFinish = async (values: AppPolicy) => {
      if (verifyRules()) {
        return;
      }
      let result: AppPolicy | null = null;
      setSaveLoading(true);
      values.status = 'active';
      if (policyId) {
        values.rules = rules;
        result = await updateAppPolicy(policyId, values);
      } else {
        values.rules = rules;
        const appId = searchParams.get('appId');
        if (appId) {
          result = await createAppPolicy(appId, values);
        }
      }

      if (result?.id) {
        message.success(t('submit_success'));
        if (!policyId) {
          setSearchParams({ id: result.id });
        }
        await getRequest();
      }
      setSaveLoading(false);
    };


  return (
    <PageContainer
      header={{
        title: `${policyId ? t('policy') : t('create_policy')}`,
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: t('app_manage') },
            { title: t('policy') },
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
