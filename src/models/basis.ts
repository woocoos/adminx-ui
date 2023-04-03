import { createModel } from 'ice';
import localStorage from '@/pkg/localStorage'

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
      localStorage.setItem("locale", payload)
      prevState.locale = payload;
    },
    updateToken(prevState: BasisModelState, payload: string) {
      localStorage.setItem("token", payload)
      prevState.token = payload;
    },
    updateTenantId(prevState: BasisModelState, payload: string) {
      localStorage.setItem("tenantId", payload)
      prevState.tenantId = payload;
    },
    updateUser(prevState: BasisModelState, payload: BasisUserModelState) {
      localStorage.setItem("user", payload)
      prevState.user = payload;
    },
    logout(prevState: BasisModelState, payload?: any) {
      localStorage.removeItem("token")
      localStorage.removeItem("tenantId")
      localStorage.removeItem("user")
      prevState.token = "";
      prevState.tenantId = "";
      prevState.user = {
        id: "",
        displayName: ""
      };
      location.href = `/login?redirect=${encodeURIComponent(location.href)}`
    }
  },
});
