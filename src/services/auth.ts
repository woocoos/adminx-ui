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
    avatarFileId: string;
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

const baseURL = "/api-auth"

/**
 * 获取验证码
 * @returns
 */
export async function captcha(): Promise<CaptchaRes> {
  return await request.get(`${baseURL}/captcha`);
}

/**
 * 登录
 * @param data
 * @returns
 */
export async function login(username: string, password: string, captcha: string, captchaId: string): Promise<LoginRes> {
  return await request.post(`${baseURL}/login/auth`, {
    username,
    password,
    captcha,
    captchaId,
  });
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
        const tr = await request.post(`${baseURL}/login/refresh-token`, {
          refreshToken: userState.refreshToken,
        });
        if (tr.accessToken) {
          store.dispatch.user.updateToken(tr.accessToken);
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
  return await request.post(`${baseURL}/logout`);
}

/**
 * 登录后需要重置密码
 * @param stateToken
 * @param newPassword
 * @returns
 */
export async function loginResetPassword(stateToken: string, newPassword: string): Promise<LoginRes> {
  return await request.post(`${baseURL}/login/reset-password`, {
    stateToken,
    newPassword,
  });
}

/**
 * 登录后需要MFA验证
 * @param deviceId
 * @param stateToken
 * @param otpToken
 * @returns
 */
export async function loginVerifyFactor(deviceId: string, stateToken: string, otpToken: string): Promise<LoginRes> {
  return await request.post(`${baseURL}/login/verify-factor`, {
    deviceId,
    stateToken,
    otpToken,
  });
}

/**
 * 绑定mfa前需要的数据
 * @returns
 */
export async function bindPrepareMfa(): Promise<MfaPrepare> {
  return await request.post(`${baseURL}/mfa/bind-prepare`);
}

/**
 * 绑定mfa
 * @param stateToken
 * @param otpToken
 * @returns
 */
export async function bindMfa(stateToken: string, otpToken: string): Promise<boolean> {
  return await request.post(`${baseURL}/mfa/bind`, { stateToken, otpToken });
}

/**
 * 解绑mfa
 * @param otpToken
 * @returns
 */
export async function unbindMfa(otpToken: string): Promise<boolean> {
  return await request.post(`${baseURL}/mfa/unbind`, { otpToken });
}

/**
 * 确认用户信息
 * @param username
 * @param captcha
 * @param captchaId
 * @returns
 */
export async function forgetPwdBegin(username: string, captcha: string, captchaId: string): Promise<ForgetPwdBeginRes> {
  return await request.post(`${baseURL}/forget-pwd/begin`, {
    username,
    captcha,
    captchaId,
  });
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
): Promise<ForgetPwdBeginRes> {
  return await request.post(`${baseURL}/forget-pwd/verify-email`, {
    stateToken,
    captcha,
    captchaId,
  });
}

/**
 * 邮箱发送验证码
 * @param stateToken
 * @returns
 */
export async function forgetPwdSendEmail(stateToken: string): Promise<string> {
  return await request.post(`${baseURL}/forget-pwd/send-email`, {
    stateToken,
  });
}

/**
 * 验证mfa
 * @param stateToken
 * @param otpToken
 * @returns
 */
export async function forgetPwdVerifyMfa(stateToken: string, otpToken: string): Promise<ForgetPwdBeginRes> {
  return await request.post(`${baseURL}/forget-pwd/verify-mfa`, {
    stateToken,
    otpToken,
  });
}

/**
 * 重置密码
 * @param stateToken
 * @param newPassword
 * @returns
 */
export async function forgetPwdReset(stateToken: string, newPassword: string): Promise<boolean> {
  return await request.post(`${baseURL}/forget-pwd/reset`, {
    stateToken,
    newPassword,
  });
}
