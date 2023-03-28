import { request } from 'ice';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginRes {
  accessToken: string,
  expiresIn: number,
  refreshToken: string,
  user: UserInfo
}

export interface UserInfo {
  id: number;
  domainName: string;
  domainId: number;
  displayName: string;
}

export async function login(data: LoginParams): Promise<LoginRes> {
  const result: LoginRes = await request({
    url: '/login',
    method: "post",
    data,
  });
  return result
}

export async function fetchUserInfo() {
  const result = await request({
    url: '/ucenter_gql',
    method: 'post',
    data: {
      query: `query {
      viewer{
        id,name,avatar,userType
      }
    }`}
  })
  if (result?.data?.viewer) {
    return result.data.viewer;
  }
}

export async function logout() {
  return await request.post('/logout');
}
