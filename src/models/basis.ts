import { createModel, history } from 'ice';
import localStorage from '@/pkg/localStorage'
import { LoginRes } from '@/services/basis';

interface BasisModelState {
  locale: "zh-CN" | "zh-TW" | "en-US"
  token: string
  tenantId: string
  user: BasisUserModelState
}
interface BasisUserModelState {
  id: string,
  displayName: string
  [key: string]: any
}

export default createModel({
  state: {
    locale: "zh-CN",
    token: "",
    tenantId: "",
    user: {}
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
    updateUser(prevState: BasisModelState, payload: BasisUserModelState) {
      prevState.user = payload;
    },
  },
  effects: () => ({
    /**
     * 登录
     * @param payload 
     */
    async login(payload: { result: LoginRes, user: any }) {
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
    async logout(isHistory?: boolean) {
      await localStorage.removeItem("token")
      await localStorage.removeItem("tenantId")
      await localStorage.removeItem("user")
      this.updateToken("")
      this.updateTenantId("")
      this.updateUser({
        id: "",
        displayName: ""
      })

      if (!location.pathname.split('/').includes('login')) {
        let href = `/login?redirect=${encodeURIComponent(location.href)}`
        // 主应用调用这个有问题 后续看怎么处理
        history?.push(href)
        // if (isHistory) {
        // } else {
        //   location.href = href
        // }
      }
    }
  })
});
