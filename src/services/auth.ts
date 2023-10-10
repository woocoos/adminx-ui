import { User } from '@/generated/adminx/graphql';
import { setItem } from '@/pkg/localStore';
import store from '@/store';
import { request } from 'ice';
import jwtDcode, { JwtPayload } from 'jwt-decode';

interface OasErrors {
  code: number;
  messsage: string;
  details: string;
}

export interface LoginRes {
  accessToken?: string;
  expiresIn?: number;
  refreshToken?: string;
  stateToken?: string;
  callbackUrl?: string;
  user?: {
    id: string;
    displayName: string;
    avatarFileId?: string;
    domains: {
      id: string;
      name: string;
    }[];
  };
  errors?: OasErrors[];
}

export type MfaPrepare = {
  principalName: string;
  secret: string;
  stateToken: string;
  stateTokenTTL: number;
  qrCodeUri: string;
};

export type CaptchaRes = {
  captchaId: string;
  captchaImage: string;
};

export type ForgetPwdBeginRes = {
  stateToken: string;
  stateTokenTTL: number;
  verifies: {
    kind: 'email' | 'mfa';
    value: string;
  }[];
  errors?: OasErrors[];
};

export type AppDeployConfig = {
  title: string;
  appCode: string;
  entry: string;
  forceTenantId: boolean;
};

const ICE_API_AUTH_PREFIX = process.env.ICE_API_AUTH_PREFIX ?? '/api-auth',
  ICE_APP_DEPLOY_CONFIG = process.env.ICE_APP_DEPLOY_CONFIG ?? '',
  ICE_LOGIN_URL = process.env.ICE_LOGIN_URL ?? '/login'

/**
 * 获取验证码
 * @returns
 */
export async function captcha(): Promise<CaptchaRes> {
  return await request.get(`${ICE_API_AUTH_PREFIX}/captcha`);
}

/**
 * 登录
 * @param data
 * @returns
 */
export async function login(username: string, password: string, captcha?: string, captchaId?: string) {
  try {
    const result = await request.post(`${ICE_API_AUTH_PREFIX}/login/auth`, {
      username,
      password,
      captcha,
      captchaId,
    });
    return result as LoginRes;
  } catch (error) {
    return null;
  }
}

const appDeployConfig: AppDeployConfig[] = [];

/**
 * 获取应用部署配置文件
 * @returns
 */
export async function getAppDeployConfig() {
  if (appDeployConfig.length) {
    return appDeployConfig;
  }
  if (ICE_APP_DEPLOY_CONFIG) {
    try {
      const result = await request.get(ICE_APP_DEPLOY_CONFIG) as AppDeployConfig[];
      appDeployConfig.push(...result);
      return appDeployConfig;
    } catch (error) {
    }
  }
  return null;
}

let refreshTokenFn: NodeJS.Timeout;

/**
 * 刷新登录token
 * @param data
 * @returns
 */
export function refreshToken() {
  clearTimeout(refreshTokenFn);
  refreshTokenFn = setTimeout(async () => {
    const userState = store.getModelState('user');
    if (userState.token && userState.refreshToken) {
      const jwt = jwtDcode<JwtPayload>(userState.token);
      if ((jwt.exp || 0) * 1000 - Date.now() < 30 * 60 * 1000) {
        // 小于30分钟的时候需要刷新token
        try {

          const tr = await request.post(`${ICE_API_AUTH_PREFIX}/login/refresh-token`, {
            refreshToken: userState.refreshToken,
          });
          if (tr.accessToken) {
            store.dispatch.user.updateToken(tr.accessToken);
          }
        } catch (error) {
        }
      }
    }
  }, 2000);
}

/**
 * 退出登录
 * @returns
 */
export async function logout() {
  const userState = store.getModelState('user');
  if (userState.token) {
    try {
      request.post(`${ICE_API_AUTH_PREFIX}/logout`);
    } catch (error) { }
  }
  const userDispatcher = store.getModelDispatchers('user')
  userDispatcher.logout();
  if (ICE_LOGIN_URL.toLowerCase().startsWith("http")) {
    const url = new URL(ICE_LOGIN_URL);
    if (location.pathname !== url.pathname || location.host != url.host) {
      location.href = `${ICE_LOGIN_URL}?redirect=${encodeURIComponent(location.href)}`
    }
  } else {
    if (location.pathname !== ICE_LOGIN_URL) {
      location.href = `${ICE_LOGIN_URL}?redirect=${encodeURIComponent(location.href)}`
    }
  }
}

/**
 * 登录后需要重置密码
 * @param stateToken
 * @param newPassword
 * @returns
 */
export async function loginResetPassword(stateToken: string, newPassword: string) {
  try {
    const result = await request.post(`${ICE_API_AUTH_PREFIX}/login/reset-password`, {
      stateToken,
      newPassword,
    });
    return result as LoginRes;
  } catch (error) {
    return null;
  }
}

/**
 * 登录后需要MFA验证
 * @param deviceId
 * @param stateToken
 * @param otpToken
 * @returns
 */
export async function loginVerifyFactor(deviceId: string, stateToken: string, otpToken: string) {
  try {
    const result = await request.post(`${ICE_API_AUTH_PREFIX}/login/verify-factor`, {
      deviceId,
      stateToken,
      otpToken,
    });
    return result as LoginRes;
  } catch (error) {
    return null;
  }
}

/**
 * 绑定mfa前需要的数据
 * @returns
 */
export async function bindPrepareMfa() {
  try {
    const result = await request.post(`${ICE_API_AUTH_PREFIX}/mfa/bind-prepare`);
    return result as MfaPrepare;
  } catch (error) {
    return null;
  }
}

/**
 * 绑定mfa
 * @param stateToken
 * @param otpToken
 * @returns
 */
export async function bindMfa(stateToken: string, otpToken: string) {
  try {
    const result = await request.post(`${ICE_API_AUTH_PREFIX}/mfa/bind`, { stateToken, otpToken });
    return result as boolean;
  } catch (error) {
    return null;
  }
}

/**
 * 解绑mfa
 * @param otpToken
 * @returns
 */
export async function unbindMfa(otpToken: string) {
  try {
    const result = await request.post(`${ICE_API_AUTH_PREFIX}/mfa/unbind`, { otpToken });
    return result as boolean;
  } catch (error) {
    return null;
  }
}

/**
 * 确认用户信息
 * @param username
 * @param captcha
 * @param captchaId
 * @returns
 */
export async function forgetPwdBegin(username: string, captcha: string, captchaId: string) {
  try {
    const result = await request.post(`${ICE_API_AUTH_PREFIX}/forget-pwd/begin`, {
      username,
      captcha,
      captchaId,
    });
    return result as ForgetPwdBeginRes;
  } catch (error) {
    return null;
  }
}


/**
 * 验证email
 * @param stateToken
 * @param captcha
 * @param captchaId
 * @returns
 */
export async function forgetPwdVerifyEmail(
  stateToken: string,
  captcha: string,
  captchaId: string,
) {
  try {
    const result = await request.post(`${ICE_API_AUTH_PREFIX}/forget-pwd/verify-email`, {
      stateToken,
      captcha,
      captchaId,
    });
    return result as ForgetPwdBeginRes;
  } catch (error) {
    return null;
  }
}

/**
 * 邮箱发送验证码
 * @param stateToken
 * @returns
 */
export async function forgetPwdSendEmail(stateToken: string) {
  try {
    const result = await request.post(`${ICE_API_AUTH_PREFIX}/forget-pwd/send-email`, {
      stateToken,
    });
    return result as string;
  } catch (error) {
    return null;
  }
}

/**
 * 验证mfa
 * @param stateToken
 * @param otpToken
 * @returns
 */
export async function forgetPwdVerifyMfa(stateToken: string, otpToken: string) {
  try {
    return await request.post(`${ICE_API_AUTH_PREFIX}/forget-pwd/verify-mfa`, {
      stateToken,
      otpToken,
    }) as ForgetPwdBeginRes;
  } catch (error) {
    return null;
  }
}

/**
 * 重置密码
 * @param stateToken
 * @param newPassword
 * @returns
 */
export async function forgetPwdReset(stateToken: string, newPassword: string) {
  try {
    return await request.post(`${ICE_API_AUTH_PREFIX}/forget-pwd/reset`, {
      stateToken,
      newPassword,
    }) as boolean;
  } catch (error) {
    return null;
  }
}

/**
 * 处理url是否需要创建spm
 * @returns
 */
export async function urlSpm(url: string, tenantId?: string) {
  if (url.toLowerCase().startsWith("http")) {
    const u = new URL(url);
    if (u.origin != location.origin) {
      try {
        const result = await request.post(`${ICE_API_AUTH_PREFIX}/spm/create`), userState = store.getModelState("user");
        if (typeof result === 'string') {
          u.searchParams.set('spm', result)
          if (tenantId || userState.tenantId) {
            u.searchParams.set('tid', tenantId || userState.tenantId)
          }
        }
      } catch (error) {
      }
      return u.href
    }
  }
  return url
}

/**
 * 解析spm信息
 * @returns
 */
export async function parseSpm() {
  const parseData: {
    token?: string;
    refreshToken?: string;
    tenantId?: string;
    user?: User
  } = {}

  const u = new URL(window.location.href), spm = u.searchParams.get('spm');
  parseData.tenantId = u.searchParams.get('tid') ?? undefined;

  if (spm) {
    try {
      // 存放在cookie中避免重复读取
      const ck = `spm=${spm}`;
      if (document.cookie.indexOf(ck) === -1) {
        const result: LoginRes = await request.post(`${ICE_API_AUTH_PREFIX}/spm/auth`, {
          spm,
        });
        if (result?.accessToken) {
          parseData.token = result.accessToken;
          parseData.refreshToken = result.refreshToken;
          if (!parseData.tenantId) {
            parseData.tenantId = result.user?.domains?.[0]?.id
          }
          if (result.user) {
            parseData.user = {
              id: result.user.id,
              displayName: result.user.displayName,
              avatarFileID: result.user.avatarFileId,
            } as User
          }
          setItem('token', parseData.token);
          setItem('refreshToken', parseData.refreshToken);
          setItem('tenantId', parseData.tenantId);
          setItem('user', parseData.user);
        }

        document.cookie = ck
      }
    } catch (error) {
    }
  }
  return parseData
}
