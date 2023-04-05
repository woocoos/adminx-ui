import { request } from 'ice';
import localStorage from "@/pkg/localStorage";

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

export async function login(data: LoginParams): Promise<LoginRes> {
  return await request({
    url: '/login/auth',
    method: "post",
    data,
  });
}

export async function logout() {
  return await request.post('/logout');
}

export async function basisData() {
  const token = await localStorage.getItem<string>("token");
  const darkMode = await localStorage.getItem<string>("darkMode");
  const compactMode = await localStorage.getItem<string>("compactMode");
  const tenantId = await localStorage.getItem<string>("tenantId");
  const user = await localStorage.getItem<any>("user");
  
  return {
    token,
    darkMode,
    compactMode,
    tenantId,
    user,
  };
}
