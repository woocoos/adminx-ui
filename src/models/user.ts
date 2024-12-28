import { createModel } from 'ice';
import { LoginRes } from '@/services/auth';
import { setItem, removeItem, getItem } from '@/pkg/localStore';
import { User } from '@/generated/adminx/graphql';

type UserState = {
  id: string;
  displayName: string;
  avatar?: string;
};

type ModelState = {
  refreshToken: string;
  token: string;
  tenantId: string;
  user: UserState | null;
};


export default createModel({
  state: {
    token: '',
    refreshToken: '',
    tenantId: '',
    user: null,
    darkMode: false,
    compactMode: false,
  } as ModelState,
  reducers: {
    updateToken(prevState: ModelState, payload: string) {
      if (payload) {
        setItem('token', payload);
      } else {
        removeItem('token');
      }
      prevState.token = payload;
    },
    updateRefreshToken(prevState: ModelState, payload: string) {
      if (payload) {
        setItem('refreshToken', payload);
      } else {
        removeItem('refreshToken');
      }
      prevState.refreshToken = payload;
    },
    updateTenantId(prevState: ModelState, payload: string) {
      if (payload) {
        setItem('tenantId', payload);
      } else {
        removeItem('tenantId');
      }
      prevState.tenantId = payload;
    },
    updateUser(prevState: ModelState, payload: UserState | null) {
      if (payload) {
        setItem('user', payload);
      } else {
        removeItem('user');
      }
      prevState.user = payload;
    },
  },
  effects: () => ({
    /**
     * 退出
     * @param isHistory
     */
    async logout() {
      this.updateToken('');
      this.updateUser(null);
    },
    /**
     * 更新用户信息
     * @param user
     */
    async saveUser(user: User) {
      this.updateUser({
        id: user.id,
        displayName: user.displayName,
        avatar: user.avatar || undefined,
      });
    },
    /**
     * 更新租户id
     * @param key
     */
    async saveTenantId(tenantId: string) {
      this.updateTenantId(tenantId);
    },
  }),
});
