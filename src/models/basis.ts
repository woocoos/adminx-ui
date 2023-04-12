import { createModel, history } from 'ice';
import localStorage from '@/pkg/localStorage'
import { LoginRes } from '@/services/basis';
import { User } from '@/services/user';

interface BasisModelState {
  locale: "zh-CN" | "zh-TW" | "en-US"
  token: string
  tenantId: string
  darkMode: boolean
  compactMode: boolean
  user: User | undefined
}


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
    updateLocale(prevState: BasisModelState, payload: "zh-CN" | "zh-TW" | "en-US") {
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
      localStorage.setItem("darkMode", payload)
      prevState.darkMode = payload;
    },
    updateCompactMode(prevState: BasisModelState, payload: boolean) {
      localStorage.setItem("compactMode", payload)
      prevState.compactMode = payload;
    },
  },
  effects: () => ({
    /**
     * 获取缓存数据
     * @returns 
     */
    async initBasis() {
      const token = await localStorage.getItem<string>("token");
      const darkMode = await localStorage.getItem<string>("darkMode");
      const compactMode = await localStorage.getItem<string>("compactMode");
      const tenantId = await localStorage.getItem<string>("tenantId");
      const user = await localStorage.getItem<User>("user");

      // TODO：增加jwt判断token的处理

      return {
        locale: "zh-CN",
        token,
        darkMode,
        compactMode,
        tenantId,
        user,
      };
    },
    /**
     * 登录
     * @param payload 
     */
    async login(payload: { result: LoginRes, user: User }) {
      const { result, user } = payload
      if (result.accessToken) {
        this.updateToken(await localStorage.setItem("token", result.accessToken))
        this.updateTenantId(await localStorage.setItem("tenantId", `${result.user?.domainId || ''}`))
        this.updateUser(await localStorage.setItem("user", user))
      }
    },
    /**
     * 退出
     * @param isHistory 
     */
    async logout() {
      await localStorage.removeItem("token")
      await localStorage.removeItem("tenantId")
      await localStorage.removeItem("user")
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
      this.updateUser(await localStorage.setItem("user", user))
    },
  })
});
