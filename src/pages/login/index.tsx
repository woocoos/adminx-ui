import styles from './index.module.css';
import store from '@/store';
import { useTranslation } from 'react-i18next';
import Login from './components/login';
import { LoginRes, getAppDeployConfig, urlSpm } from '@/services/auth';
import { useState } from 'react';
import MfaVerify from './components/mfaVerify';
import { Result, message } from 'antd';
import ResetPassword from './components/resetPassword';
import { useSearchParams } from 'ice';
import { appAccess } from '@/services/adminx/app';
import { RequestHeaderAuthorizationMode, getRequestHeaderAuthorization } from '@knockout-js/ice-urql/request';

const ICE_APP_CODE = process.env.ICE_APP_CODE ?? '',
  ICE_HTTP_SIGN = process.env.ICE_HTTP_SIGN ?? '';

export default () => {
  const { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    [res, setRes] = useState<LoginRes>(),
    [isLoginSuccess, setIsLoginSuccess] = useState(false),
    [, userDispatcher] = store.useModel('user');

  document.title = t('login');

  async function loginSuccess(result: LoginRes) {
    setRes(result);
    if (result?.accessToken) {
      let isEnterApp = true;
      const redirect = searchParams.get('redirect');
      if (!(result.user?.domains && result.user?.domains.length)) {
        // 无domains的情况处理判断应用是否需要强制需要domains
        const appDeployConfig = await getAppDeployConfig();
        if (appDeployConfig) {
          const adcData = appDeployConfig.find(adc => (redirect || location.origin).indexOf(adc.entry) != -1);
          if (adcData && adcData.forceTenantId) {
            isEnterApp = false;
            message.warning(t('login_force_domains'))
          }
        }
      }
      if (isEnterApp) {
        const tenantId = result.user?.domains?.[0]?.id ?? '';
        const isAppAccess = await appAccess(ICE_APP_CODE, {
          Authorization: getRequestHeaderAuthorization(result.accessToken, ICE_HTTP_SIGN === 'ko' ? RequestHeaderAuthorizationMode.KO : undefined),
          'X-Tenant-ID': tenantId,
        })
        if (isAppAccess) {
          setIsLoginSuccess(true);
          await userDispatcher.loginAfter(result);
          message.success(t('login_success'));
          location.replace(await urlSpm(redirect || '/'));
        } else {
          message.error(t('login_not_app_access'));
          setRes(undefined);
        }
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className="container-item">
        {
          res ? <></> : <Login
            onSuccess={loginSuccess}
          />
        }
        {
          res?.stateToken && res?.callbackUrl === '/login/verify-factor' ? <MfaVerify
            stateToken={res.stateToken}
            onSuccess={loginSuccess}
          /> : <></>
        }
        {
          res?.stateToken && res?.callbackUrl === '/login/reset-password' ? <ResetPassword
            stateToken={res.stateToken}
            onSuccess={loginSuccess}
          /> : <></>
        }
        {
          isLoginSuccess ? <Result
            status="success"
            style={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          /> : <></>
        }
      </div>
    </div>
  );
};
