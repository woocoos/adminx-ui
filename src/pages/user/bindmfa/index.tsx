import store from '@/store';
import { PageContainer, ProCard, ProForm, ProFormText, useToken } from '@ant-design/pro-components';
import { history } from '@ice/runtime';
import { Alert, QRCode, Result, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MfaPrepare, bindMfa, bindPrepareMfa } from '@/services/basis';
import { getUserInfoLoginProfile } from '@/services/user';
import { setLeavePromptWhen } from '@/components/LeavePrompt';
import { User } from '@/__generated__/graphql';

export default () => {
  const { t } = useTranslation(),
    { token } = useToken(),
    countdownFn = useRef<NodeJS.Timeout>(),
    [loading, setLoading] = useState(false),
    [info, setInfo] = useState<User>(),
    [mfaInfo, setMfaInfo] = useState<MfaPrepare>(),
    [basisState] = store.useModel('basis'),
    [qrcodeValue, setQrcodeValue] = useState<string>(''),
    [qrcodeLoading, setQrcodeLoading] = useState(false),
    [surplus, setSurplus] = useState(0),
    [saveLoading, setSaveLoading] = useState(false),
    [saveDisabled, setSaveDisabled] = useState(true);

  setLeavePromptWhen(saveDisabled);

  const
    getRequest = async () => {
      if (basisState.user?.id) {
        setLoading(true);
        const result = await getUserInfoLoginProfile(basisState.user.id);
        if (result?.id) {
          setInfo(result as User);
          if (!result.loginProfile?.mfaEnabled) {
            await onRefresh();
          }
        }
      }
      setLoading(false);
    },
    onRefresh = async () => {
      setQrcodeLoading(true);
      const result = await bindPrepareMfa();
      if (result?.stateToken) {
        setMfaInfo(result);
        countdown(result.stateTokenTTL);
        setQrcodeValue(result.qrCodeUri);
      }
      setQrcodeLoading(false);
    },
    countdown = (time: number) => {
      setSurplus(time);
      if (time <= 0) {
        clearTimeout(countdownFn.current);
      } else {
        countdownFn.current = setTimeout(() => {
          countdown(time - 1);
        }, 1000);
      }
    },
    onFinish = async (value: { code: string }) => {
      if (mfaInfo) {
        setSaveLoading(true);
        const result = await bindMfa(mfaInfo.stateToken, value.code);
        if (result) {
          message.success(t('submit_success'));
          history?.push('/user/safety');
        }
      }

      setSaveLoading(false);
      return false;
    };

  useEffect(() => {
    getRequest();

    return () => {
      clearTimeout(countdownFn.current);
    };
  }, []);

  return (<PageContainer
    header={{
      title: t('bind_virtual_MFA'),
      style: { background: token.colorBgContainer },
      breadcrumb: {
        items: [
          { title: t('info_center') },
          { title: t('security_setting') },
          { title: t('bind_virtual_MFA') },
        ],
      },
    }}
  >
    <ProCard loading={loading} split="horizontal">
      <div x-if={mfaInfo} style={{ padding: '16px 24px' }}>
        <Alert showIcon message={t('bind_mfa_alert_msg')} />
        <br />
        <ProCard split="vertical">
          <ProCard colSpan={12}>
            <ProCard
              tabs={{
                items: [
                  {
                    label: t('scanning_bind'),
                    key: 'scanning',
                    children: <div style={{ textAlign: 'center' }}>
                      <ProCard >
                        <QRCode
                          style={{ margin: '0 auto' }}
                          status={qrcodeLoading ? 'loading' : surplus <= 0 ? 'expired' : 'active'}
                          value={qrcodeValue}
                          onRefresh={onRefresh}
                        />
                        <br />
                        <div>
                          {t('account_number')}：{mfaInfo?.principalName}
                        </div>
                        <br />
                        <br />
                        <div>
                          {t('bind_mfa_qr_code_text')}
                        </div>
                      </ProCard>
                    </div>,
                  },
                  {
                    label: t('manual_bind'),
                    key: 'manual',
                    children: <div style={{ textAlign: 'center' }}>
                      <ProCard >
                        <h3>
                          {t('auth_info')}
                        </h3>
                        <div>
                          {t('account_number')}：{mfaInfo?.principalName}
                        </div>
                        <div>
                          {t('secret_key')}：{mfaInfo?.secret}
                        </div>
                        <br />
                        <div>
                          {t('bind_mfa_manual_sub_text')}
                        </div>
                      </ProCard>
                    </div>,
                  },
                ],
              }}
            />
          </ProCard>
          <ProCard colSpan={12}>
            <div style={{ maxWidth: '400px', margin: '80px auto 0 auto' }}>
              <h3 style={{ textAlign: 'center' }}>
                {t('bind_virtual_mfa_device')}
              </h3>
              <Alert showIcon message={t('bind_mfa_device_{{total}}s_{{surplus}}s', { total: mfaInfo?.stateTokenTTL, surplus: surplus })} />
              <br />
              <div>
                {t('bind_mfa_device_sub_text')}
              </div>
              <br />
              <ProForm
                submitter={{
                  searchConfig: {
                    submitText: t('binding'),
                  },
                  submitButtonProps: {
                    loading: saveLoading,
                    disabled: saveDisabled,
                    block: true,
                  },
                  render(props, dom) {
                    return [dom[1]];
                  },
                }}
                onFinish={onFinish}
                onValuesChange={() => {
                  setSaveDisabled(false);
                }}
              >
                <ProFormText
                  name="code"
                  label={t('security_code')}
                  rules={[
                    { required: true, message: `${t('please_enter_security_code')}` },
                  ]}
                />
              </ProForm>
            </div>
          </ProCard>
        </ProCard>
      </div>
      <div x-if={info?.loginProfile?.mfaEnabled}>
        <Result
          status="success"
          title={`${t('bind_completed')}`}
          subTitle=""
          style={{ marginBottom: 16 }}
        />
      </div>
    </ProCard>
  </PageContainer >);
};
