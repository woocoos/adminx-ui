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

export default () => {
  const { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    [res, setRes] = useState<LoginRes>(),
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
        await userDispatcher.loginAfter(result);
        message.success(t('login_success'));
        location.replace(await urlSpm(redirect || '/'));
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
          res?.accessToken ? <Result
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
