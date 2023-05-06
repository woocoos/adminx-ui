import { request } from 'ice';
import { Mfa } from './user';

export interface LoginParams {
  username: string
  password: string
  captcha: string
}

interface LoginErrors {
  code: number
  messsage: string
}

export interface LoginRes {
  accessToken?: string
  expiresIn?: number
  refreshToken?: string
  user?: {
    id: number
    displayName: string
    domainName: string
    domainId: number
  },
  errors?: LoginErrors[]
}

/**
 * 登录
 * @param data 
 * @returns 
 */
export async function login(data: LoginParams): Promise<LoginRes> {
  return await request({
    url: '/login/auth',
    method: "post",
    data,
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
 * 绑定mfa前需要的数据
 * @returns 
 */
export async function bindPrepareMfa(): Promise<Mfa> {
  return await request.post('/mfa/bind-prepare');
}

/**
 * 绑定mfa
 * @param stateToken 
 * @param otpToken 
 * @returns 
 */
export async function bindMfa(stateToken: string, otpToken: string): Promise<Mfa> {
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
