import { request } from 'ice';


interface LoginErrors {
  code: number
  messsage: string
  details: string
}

export interface LoginRes {
  accessToken?: string
  expiresIn?: number
  refreshToken?: string
  stateToken?: string
  callbackUrl?: string
  user?: {
    id: string
    displayName: string
    domainName: string
    domainId: string
  },
  errors?: LoginErrors[]
}

export type MfaPrepare = {
  principalName: string
  secret: string
  stateToken: string
  stateTokenTTL: number
}

/**
 * 登录
 * @param data 
 * @returns 
 */
export async function login(username: string, password: string, captcha: string): Promise<LoginRes> {
  return await request.post('/login/auth', {
    username,
    password,
    captcha,
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
