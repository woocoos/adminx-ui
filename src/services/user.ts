import { request } from 'ice';
import type { LoginParams, LoginResult, UserInfo } from '@/interfaces/user';

let currentUserInfo: UserInfo | {};

export async function login(data: LoginParams): Promise<LoginResult> {
  const result: LoginResult = await request({
    url: '/login',
    method: "post",
    data
  });

  if (result.data) {
    currentUserInfo = result.data
  }
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
  currentUserInfo = {}
  return await request.post('/logout');
}
