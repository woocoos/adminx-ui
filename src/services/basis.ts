import { request } from 'ice';

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

/**
 * 获取验证码
 * @returns
 */
export async function captcha(): Promise<CaptchaRes> {
  return await request.get('/captcha');
}
/**
 * 登录
 * @param data
 * @returns
 */
export async function login(username: string, password: string, captcha: string, captchaId: string): Promise<LoginRes> {
  return await request.post('/login/auth', {
    username,
    password,
    captcha,
    captchaId,
  });
}

/**
 * 退出登录
 * @returns
 */
export async function logout() {
  return await request.post('/logout');
}

/**
 * 登录后需要重置密码
 * @param stateToken
 * @param newPassword
 * @returns
 */
export async function loginResetPassword(stateToken: string, newPassword: string): Promise<LoginRes> {
  return await request.post('/login/reset-password', {
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
  return await request.post('/login/verify-factor', {
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
  return await request.post('/mfa/bind-prepare');
}

/**
 * 绑定mfa
 * @param stateToken
 * @param otpToken
 * @returns
 */
export async function bindMfa(stateToken: string, otpToken: string): Promise<boolean> {
  return await request.post('/mfa/bind', { stateToken, otpToken });
}

/**
 * 解绑mfa
 * @param otpToken
 * @returns
 */
export async function unbindMfa(otpToken: string): Promise<boolean> {
  return await request.post('/mfa/unbind', { otpToken });
}

/**
 * 确认用户信息
 * @param username
 * @param captcha
 * @param captchaId
 * @returns
 */
export async function forgetPwdBegin(username: string, captcha: string, captchaId: string): Promise<ForgetPwdBeginRes> {
  return await request.post('/forget-pwd/begin', {
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
  return await request.post('/forget-pwd/verify-email', {
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
  return await request.post('/forget-pwd/send-email', {
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
  return await request.post('/forget-pwd/verify-mfa', {
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
  return await request.post('/forget-pwd/reset', {
    stateToken,
    newPassword,
  });
}
