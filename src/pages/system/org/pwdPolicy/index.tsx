import { useEffect, useState } from 'react';
import { PageContainer, ProForm, ProFormText, ProFormTextArea, useToken, ProFormSelect, ProFormRadio, ProFormCheckbox, ProFormDigit } from '@ant-design/pro-components';
import { Card, Col, message, Row } from 'antd';
import { Link, useSearchParams } from '@ice/runtime';
import { getPwdPolicy, updatePwdPolicy, createPwdPolicy, getOrgInfo } from '@/services/adminx/org';
import store from '@/store';
import { useTranslation } from 'react-i18next';
import { CreateUserPasswordPolicyInput, User, UserGender, UserPasswordPolicy } from '@/generated/adminx/graphql';
import { updateFormat, getANDResult, getORResult } from '@/util';
import { UploadAvatar, useLeavePrompt } from '@knockout-js/layout';
import { definePageConfig } from 'ice';
import { Org } from '@knockout-js/api/ucenter';

type ProFormData = {
  allowIncludeUserName?: boolean;
  captchaTimes?: number;
  includeChar?: number;
  includeElement?: number;
  invalidDay?: number;
  invalidLoginLimit?: boolean;
  length?: number;
  retry?: number;
};
type FormUserPasswordPolicy = UserPasswordPolicy & {
  /** 必须包含的元素，异或：1-小写字母，2-大写字母，4-数字，8-符号 */
  includeElements?: string[];
};

export default () => {
  const
    { t } = useTranslation(),
    { token } = useToken(),
    [searchParams] = useSearchParams(),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true),
    [, setLeavePromptWhen] = useLeavePrompt(),
    [pwdPolicy, setPwdPolicy] = useState<FormUserPasswordPolicy>(),
    [orgInfo, setOrgInfo] = useState<Org>(),
    [userState, userDispatcher] = store.useModel('user');

  useEffect(() => {
    setLeavePromptWhen(saveDisabled);
    getOrgInfo(searchParams.get('id') || '').then(result => {
      if (result && result.id) {
        setOrgInfo(result as Org);
      }
    });
  }, [saveDisabled]);

  const
    getRequest = async () => {
      setSaveLoading(false);
      setSaveDisabled(true);
      if (userState.user?.id) {
        const result = await getPwdPolicy(searchParams.get('id') || '');
        if (result && result?.id) {
          let form = { ...result } as FormUserPasswordPolicy
          setPwdPolicy(form)
          form.includeElements = getANDResult<string>(['1', '2', '4', '8'], result.includeElement + '')
          return form;
        }
      }
      return {
        allowIncludeUserName: false,
        invalidLoginLimit: false,
      } as ProFormData;
    },
    onValuesChange = () => {
      setSaveDisabled(false);
    },
    onFinish = async (values: ProFormData & {
      includeElements?: string[];
    }) => {
      values.includeElement = parseInt(getORResult<string>(values.includeElements || []));
      delete values.includeElements;
      let formData = { ...values } as ProFormData
      setSaveLoading(true);
      if (pwdPolicy?.id) {
        // 更新
        const result = await updatePwdPolicy(searchParams.get('id') || '', updateFormat(formData, pwdPolicy || {}));
        if (result?.id) {
          message.success(t('submit_success'));
          setSaveDisabled(true);
        }
      } else {
        // 创建
        const result = await createPwdPolicy(searchParams.get('id') || '', updateFormat(formData, pwdPolicy || {}));
        if (result?.id) {
          message.success(t('submit_success'));
          setSaveDisabled(true);
        }
      }
      setSaveLoading(false);
    };

  return (
    <PageContainer
      header={{
        title: t('password_policy'),
        style: { background: token.colorBgContainer },
        breadcrumb: {
          items: [
            { title: t('system_conf') },
            { title: <Link to={'/system/org'}>{t('org_manage')}</Link> },
            { title: t('password_policy') },
          ],
        },
      }}
    >
      <Card title={t('organization') + "：" + orgInfo?.name} bordered={false}>
        <ProForm
          submitter={{
            searchConfig: {
              submitText: t('submit'),
              resetText: t('reset'),
            },
            submitButtonProps: {
              loading: saveLoading,
              disabled: saveDisabled,
            },
          }}
          onFinish={onFinish}
          onReset={getRequest}
          request={getRequest}
          onValuesChange={onValuesChange}
        >
          <Row gutter={16}>
            <Col span={8}>
              <ProFormDigit
                width="sm"
                min={6}
                max={32}
                name="length"
                label={`${t('pwd_policy_length')}`}
                addonAfter={`${t('pwd_policy_length_limit')}`}
              />
            </Col>
            <Col span={8}>
              <ProFormCheckbox.Group
                name="includeElements"
                label={`${t('pwd_policy_include')}`}
                options={[
                  { label: t('lowercase'), value: "1" },
                  { label: t('uppercase'), value: "2" },
                  { label: t('digit'), value: "4" },
                  { label: t('symbol'), value: "8" },
                ]}
              />
            </Col>
            <Col span={8}>
              <ProFormDigit
                width="sm"
                min={0}
                max={8}
                name="includeChar"
                label={`${t('pwd_policy_includeChar')}`}
                addonAfter={`${t('pwd_policy_includeChar_limit')}`}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <ProFormRadio.Group
                name="allowIncludeUserName"
                label={`${t('pwd_policy_allowIncludeUserName')}`}
                options={[
                  {
                    label: t('allow'),
                    value: true,
                  },
                  {
                    label: t('deny'),
                    value: false,
                  }
                ]}
              />
            </Col>
            <Col span={8}>
              <ProFormDigit
                width="sm"
                min={0}
                max={1095}
                name="invalidDay"
                label={`${t('pwd_policy_invalidDay')}`}
                addonAfter={`${t('pwd_policy_invalidDay_limit')}`}
              />
            </Col>
            <Col span={8}>
              <ProFormRadio.Group
                name="invalidLoginLimit"
                label={`${t('pwd_policy_invalidLoginLimit')}`}
                options={[
                  {
                    label: t('limit_login'),
                    value: true,
                  },
                  {
                    label: t('not_limit_login'),
                    value: false,
                  }
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <ProFormDigit
                width="sm"
                min={0}
                max={5}
                name="captchaTimes"
                label={`${t('pwd_policy_captchaTimes')}`}
                addonAfter={`${t('pwd_policy_captchaTimes_limit')}`}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <ProFormDigit
                width="sm"
                min={0}
                max={32}
                name="retry"
                label={`${t('pwd_policy_retry')}`}
                addonBefore={`${t('pwd_policy_retry_limit_befroe')}`}
                addonAfter={`${t('pwd_policy_retry_limit_after')}`}
              />
            </Col>
          </Row>
        </ProForm>
      </Card>
    </PageContainer>
  );
};
