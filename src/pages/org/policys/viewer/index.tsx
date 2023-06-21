import { PageContainer, ProCard, ProForm, ProFormInstance, ProFormText, useToken } from '@ant-design/pro-components';
import { message } from 'antd';
import { Link, useSearchParams } from '@ice/runtime';
import { useRef, useState } from 'react';
import PolicyRules from './components/policyRules';
import { getOrgInfo } from '@/services/knockout/org';
import { createOrgPolicy, getOrgPolicyInfo, updateOrgPolicy } from '@/services/knockout/org/policy';
import { useTranslation } from 'react-i18next';
import { checkAuth } from '@/components/Auth';
import { useAuth } from 'ice';
import { setLeavePromptWhen } from '@/components/LeavePrompt';
import { Org, PolicyRule } from '@/__generated__/knockout/graphql';

type ProFormData = {
  name: string;
  comments: string;
};

export default (props: {
  isFromSystem?: boolean;
}) => {
  const { token } = useToken(),
    [auth] = useAuth(),
    { t } = useTranslation(),
    [searchParams, setSearchParams] = useSearchParams(),
    formRef = useRef<ProFormInstance>(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [orgInfo, setOrgInfo] = useState<Org>(),
    [rules, setRules] = useState<PolicyRule[]>([]),
    policyId = searchParams.get('id');

  setLeavePromptWhen(saveDisabled);

  const
    isReadonly = () => {
      if (policyId) {
        // 编辑
        return !checkAuth('updateOrganizationPolicy', auth);
      } else {
        // 新建
        return !checkAuth('createOrganizationPolicy', auth);
      }
    },
    getBase = async (orgId: string) => {
      const info = await getOrgInfo(orgId);
      if (info?.id) {
        setOrgInfo(info as Org);
      }
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    getRequest = async () => {
      setSaveLoading(false);
      setSaveDisabled(true);
      if (policyId) {
        const result = await getOrgPolicyInfo(policyId);
        if (result?.id) {
          setRules(result.rules as PolicyRule[] || []);
          if (result.orgID) {
            getBase(result.orgID);
          }
          return result;
        }
      } else {
        const orgId = searchParams.get('orgId');
        if (orgId) {
          getBase(orgId);
        }
      }
      return {};
    },
    verifyRules = () => {
      let errMsg = '';
      if (rules.length) {
        for (let idx in rules) {
          const item = rules[idx];
          let appCode = '';
          if (item.actions?.length) {
            appCode = item.actions[0].split(':')[0];
            const action = item.actions.find(key => key.split(':')[0] != appCode);
            if (action) {
              errMsg = t('app_code_mismatch');
            }
          } else {
            errMsg = t('required_operation');
          }
          if (item.resources) {
            if (item.resources.length) {
              const resources = item.resources.find(key => key.split(':')[0] != appCode);
              if (resources) {
                errMsg = t('app_code_mismatch');
              }
            }
          }
          if (errMsg.length) {
            break;
          }
        }
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
        const result = await updateOrgPolicy(policyId, {
          name: values.name,
          comments: values.comments,
          rules,
        });
        if (result?.id) {
          id = result.id;
        }
      } else {
        const result = await createOrgPolicy({
          name: values.name,
          comments: values.comments,
          rules,
          orgID: orgInfo?.id || '',
        });
        if (result?.id) {
          id = result.id;
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
        title: `${policyId ? t('policy') : t('create_policy')}`,
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: props.isFromSystem ? [
            { title: t('system_conf') },
            { title: <Link to={'/system/org'}>{t('org_manage')}</Link> },
            { title: <Link to={`/system/org/policys?id=${orgInfo?.id}`}>{t('policy')}</Link> },
            { title: t('policy_detail') },
          ] : [
            { title: t('org_cooperation') },
            { title: <Link to={'/org/policys'}>{t('policy')}</Link> },
            { title: t('policy_detail') },
          ],
        },
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
          <ProFormText>
            {orgInfo?.id ? <PolicyRules
              orgId={orgInfo?.id}
              rules={rules}
              readonly={isReadonly()}
              onChange={(rules) => {
                setRules([...rules]);
                onValuesChange();
              }}
            /> : ''}
          </ProFormText>

        </ProForm>
      </ProCard>
    </PageContainer>
  );
};
