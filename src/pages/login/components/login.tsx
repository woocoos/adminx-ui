import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ProFormText, LoginForm } from '@ant-design/pro-components';
import logo from '@/assets/images/woocoo.png';
import Sha256 from 'crypto-js/sha256';
import { useTranslation } from 'react-i18next';
import { CaptchaRes, LoginRes, captcha, login } from '@/services/auth';
import { useEffect, useState } from 'react';
import { Link } from '@ice/runtime';

export default (
  props: {
    onSuccess: (result: LoginRes) => void;
  },
) => {
  const { t } = useTranslation(),
    [captchaInfo, setCaptchaInfo] = useState<CaptchaRes>(),
    [appConfig, setAppConfig] = useState<Window['resource']>(),
    [saveLoading, setSaveLoading] = useState(false);

  const
    getCaptcha = async () => {
      setCaptchaInfo(await captcha());
    },
    getLoginTitle = async () => {
      if (window.resource?.icon) {
        const iconDom = document.querySelector('link[rel="icon"]')
        if (iconDom) {
          iconDom.setAttribute('href', window.resource.icon);
        }
      }

      setAppConfig({
        logo: window.resource?.logo ?? logo,
        loginTitle: window.resource?.loginTitle ?? 'Adminx Pro',
        loginSubTitle: window.resource?.loginSubTitle ?? `${t('manage_system')}`,
      })
    },
    onFinish = async (values: { username: string; password: string; captcha?: string }) => {
      setSaveLoading(true);
      const result = await login(
        values.username?.trim(),
        Sha256(values.password?.trim()).toString(),
        values.captcha,
        captchaInfo?.captchaId,
      );
      if (result && !result.errors) {
        if (result.callbackUrl === '/captcha') {
          await getCaptcha();
        } else {
          props.onSuccess(result);
        }
      }
      setSaveLoading(false);
      return false;
    };

  useEffect(() => {
    getLoginTitle()
  }, [])


  return (
    <LoginForm
      title={appConfig?.loginTitle}
      subTitle={<div>
        <img alt="logo" src={appConfig?.logo} height={26} />
        {appConfig ? <div
          style={{ marginTop: 8 }}
        >
          {appConfig.loginSubTitle}
        </div> : <></>}
      </div>}
      submitter={{
        searchConfig: {
          submitText: t('login'),
          resetText: t('cancel'),
        },
        submitButtonProps: {
          tabIndex: 4,
          loading: saveLoading,
        },
      }}
      onFinish={onFinish}
    >
      <ProFormText
        name="username"
        fieldProps={{
          size: 'large',
          prefix: <UserOutlined className={'prefixIcon'} />,
          tabIndex: 1,
        }}
        placeholder={`${t('please_enter_principal_name')}`}
        rules={[
          {
            required: true,
            message: `${t('please_enter_principal_name')}`,
          },
        ]}
      />
      <ProFormText.Password
        name="password"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={'prefixIcon'} />,
          tabIndex: 2,
        }}
        placeholder={`${t('please_enter_password')}`}
        rules={[
          {
            required: true,
            message: `${t('please_enter_password')}`,
          },
        ]}
      />
      {
        captchaInfo ? <ProFormText
          name="captcha"
          fieldProps={{
            size: 'large',
            addonAfter: <img
              src={captchaInfo.captchaImage}
              height="32px"
              onClick={() => {
                getCaptcha();
              }}
            />,
            tabIndex: 3,
          }}
          placeholder={`${t('auth_code')}`}
          rules={[
            {
              required: true,
              message: `${t('please_enter_auth_code')}`,
            },
          ]}
        /> : <></>
      }

      <div style={{ marginBottom: 24 }}>
        <Link
          style={{ float: 'right' }}
          to="/login/retrievePassword"
        >
          {t('forget_password')}
        </Link>
      </div>
    </LoginForm>
  );
};
