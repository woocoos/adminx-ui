import { createModel, history } from 'ice';
import localStore from '@/pkg/localStore'
import { LoginRes } from '@/services/basis';
import { User } from '@/services/user';

interface BasisModelState {
  locale: LocalLanguage
  token: string
  tenantId: string
  darkMode: boolean
  compactMode: boolean
  user: User | undefined
}

export type LocalLanguage = "zh-CN" | "en-US"


export default createModel({
  state: {
    locale: "zh-CN",
    token: "",
    tenantId: "",
    user: {},
    darkMode: false,
    compactMode: false,
  } as BasisModelState,
  reducers: {
    updateLocale(prevState: BasisModelState, payload: LocalLanguage) {
      localStore.setItem("locale", payload)
      prevState.locale = payload;
    },
    updateToken(prevState: BasisModelState, payload: string) {
      prevState.token = payload;
    },
    updateTenantId(prevState: BasisModelState, payload: string) {
      prevState.tenantId = payload;
    },
    updateUser(prevState: BasisModelState, payload?: User) {
      prevState.user = payload
    },
    updateDarkMode(prevState: BasisModelState, payload: boolean) {
      localStore.setItem("darkMode", payload)
      prevState.darkMode = payload;
    },
    updateCompactMode(prevState: BasisModelState, payload: boolean) {
      localStore.setItem("compactMode", payload)
      prevState.compactMode = payload;
    },
  },
  effects: () => ({
    /**
     * 登录
     * @param payload 
     */
    async login(payload: LoginRes) {
      if (payload.accessToken) {
        this.updateToken(await localStore.setItem("token", payload.accessToken))
        this.updateTenantId(await localStore.setItem("tenantId", `${payload.user?.domainId || ''}`))
        this.updateUser(await localStore.setItem("user", {
          id: payload.user?.id,
          displayName: payload.user?.displayName,
        } as any))
      }
    },
    /**
     * 退出
     * @param isHistory 
     */
    async logout() {
      await localStore.removeItem("token")
      await localStore.removeItem("tenantId")
      await localStore.removeItem("user")
      this.updateToken("")
      this.updateTenantId("")
      this.updateUser(undefined)

      if (!location.pathname.split('/').includes('login')) {
        history?.push(`/login?redirect=${encodeURIComponent(location.href)}`)
      }
    },
    /**
     * 更新用户信息
     * @param user 
     */
    async saveUser(user: User) {
      this.updateUser(await localStore.setItem("user", user))
    },
  })
});
