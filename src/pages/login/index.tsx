import styles from './index.module.css';
import { useTranslation } from 'react-i18next';
import Login from './components/login';
import { LoginRes, urlSpm } from '@/services/auth';
import { useState } from 'react';
import MfaVerify from './components/mfaVerify';
import { Result, message } from 'antd';
import ResetPassword from './components/resetPassword';
import { useSearchParams } from 'ice';
import { appAccess } from '@/services/adminx/app';
import { RequestHeaderAuthorizationMode, getRequestHeaderAuthorization } from '@knockout-js/ice-urql/requestInterceptor';
import { getItem } from '@/pkg/localStore';

const ICE_APP_CODE = process.env.ICE_APP_CODE ?? '',
  ICE_ROUTER_BASENAME = process.env.ICE_ROUTER_BASENAME ?? '/',
  ICE_HTTP_SIGN = process.env.ICE_HTTP_SIGN ?? '';

export default () => {
  const { t } = useTranslation(),
    [searchParams] = useSearchParams(),
    [res, setRes] = useState<LoginRes>(),
    [isLoginSuccess, setIsLoginSuccess] = useState(false);

  document.title = t('login');
  async function loginSuccess(result: LoginRes) {
    setRes(result);
    if (result?.accessToken) {
      const redirect = searchParams.get('redirect') ?? `${location.origin}${ICE_ROUTER_BASENAME}`.replaceAll('//', '/');
      let tenantId = getItem<string>('tenantId') ?? '',
        token = getRequestHeaderAuthorization(result.accessToken, ICE_HTTP_SIGN === 'ko' ? RequestHeaderAuthorizationMode.KO : undefined);
      if (!result.user?.domains?.find(d => d.id == tenantId)) {
        tenantId = result.user?.domains?.[0].id ?? ''
      }
      const isAppAccess = await appAccess(ICE_APP_CODE, {
        Authorization: token,
        'X-Tenant-ID': tenantId,
      })
      if (isAppAccess) {
        setIsLoginSuccess(true);
        message.success(t('login_success'));
        location.replace(await urlSpm(redirect, undefined, {
          Authorization: token,
          'X-Tenant-ID': tenantId,
        }));
      } else {
        message.error(t('login_not_app_access'));
        setRes(undefined);
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
